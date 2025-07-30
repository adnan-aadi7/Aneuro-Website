import User from "../model/User.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';

export async function Signup(reqBody) {
  try {
    await connectDB();

    const { name, email, password, userType = "user" } = reqBody;
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    await newUser.save();
    return {
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Signup failed");
  }
}


export async function Login(reqBody) {
  try {
    await connectDB();

    const { email, password } = reqBody;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Populate subscription field
    const user = await User.findOne({ email }).lean();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
   const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: user.userType,
      },
      process.env.JWT_SECRET, 
      {
        expiresIn: "7d",
      }
    );
    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        accountStatus: user.accountStatus,
        subscription: user.subscription || null,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
}

//get api
export async function getAllUsers({ page = 1, limit = 10, accountStatus }) {
  await connectDB();

  const query = {};
  if (accountStatus && accountStatus !== "all") {
    query.accountStatus = accountStatus;
  }

  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-password");

  const total = await User.countDocuments(query);

  if (!users || users.length === 0) {
    return {
      users: [],
      total: 0,
      page: Number(page),
      totalPages: 0,
      message: "No users found",
    };
  }

  return {
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserById({ id, accountStatus }) {
  await connectDB();

  const query = { _id: id };
  if (accountStatus && accountStatus !== "all") {
    query.accountStatus = accountStatus;
  }

  const user = await User.findOne(query).select("-password");

  if (!user) {
    return {
      user: null,
      message: "User not found",
    };
  }

  return user;
}


//delete user
export async function deleteUser(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "User deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to delete user");
  }
}

//update user
// updateUser.js
export async function updateUser(userId, userData, file) {
  try {
    await connectDB();

    // 🛑 Prevent password update
    if ('password' in userData) {
      delete userData.password;
    }

    // ✅ Handle profile image upload if a new file is uploaded
    if (file && file.buffer) {
      const cloudinaryRes = await uploadToCloudinary(file.buffer, "user_profiles", file.originalname);
      userData.profileImage = cloudinaryRes.secure_url;
    }

    // ✅ Remove empty string fields (treat them as "don't update")
    Object.keys(userData).forEach(key => {
      if (userData[key] === "") {
        delete userData[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        accountStatus: updatedUser.accountStatus,
        profileImage: updatedUser.profileImage || "",
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to update user");
  }
}

//change password

export const changePassword = async (req, res) => {
  try {
    await connectDB();

    const { userId, currentPassword, newPassword } = req.body;

    // Check for required fields
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//forget password

export const sendOtp = async (req, res) => {
  try {
    await connectDB();

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 2 * 60 * 60 * 1000); // ⏰ 2 hours from now

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}. It will expire in 2 hours.`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};


//verify otp

export const verifyOtp = async (req, res) => {
  try {
    await connectDB();

    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};


//reset password

export const resetPassword = async (req, res) => {
  try {
    await connectDB();

    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to reset password" });
  }
};