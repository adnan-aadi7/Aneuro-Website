import User from "../model/User.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';
import { generateGoogleToken } from '../services/googlePassport.js';
import { generateFacebookToken } from '../services/facebookPassport.js';

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
        mobileNumber: user.mobileNumber || "",
        userType: user.userType,
        accountStatus: user.accountStatus,
        subscription: user.subscription || null,
        profileImage: user.profileImage || "",
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

//suspend user
export async function suspendUser(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus: "suspended" },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "User suspended successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to suspend user");
  }
}

//reactivate user
export async function reactivateUser(userId) {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus: "active" },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "User reactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to reactivate user");
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

    // ✅ Remove empty string fields (treat them as "don't update") - but allow mobileNumber to be updated even if empty
    Object.keys(userData).forEach(key => {
      if (userData[key] === "" && key !== "mobileNumber") {
        delete userData[key];
      }
    });

    // Debug log
    console.log('userData:', userData);

    // Use $set to ensure fields are always updated
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber || "",
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

// Google OAuth2 Authentication Methods

/**
 * Handle Google OAuth2 callback and redirect to frontend
 */
export const handleGoogleCallback = async (req, res) => {
  try {
    // User is already authenticated by passport middleware
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    // Generate JWT token
    const token = generateGoogleToken(user);

    // Check user's subscription plan
    const hasActiveSubscription = user.subscription && 
                               user.subscription.plan && 
                               user.subscription.status === 'active';

    // Redirect to frontend with user data and token
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      userType: user.userType,
      accountStatus: user.accountStatus,
      profileImage: user.profileImage || "",
      subscription: user.subscription || null,
    };

    // Encode the data to pass via URL
    const encodedData = encodeURIComponent(JSON.stringify({
      token,
      user: userData,
      hasActiveSubscription
    }));

    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?data=${encodedData}`);
  } catch (error) {
    console.error('Google callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

/**
 * Get Google OAuth2 URL for frontend redirect
 */
export const getGoogleAuthUrl = async (req, res) => {
  try {
    // Check if required environment variables are set
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: "GOOGLE_CLIENT_ID not configured" });
    }
    
    if (!process.env.GOOGLE_CALLBACK_URL) {
      return res.status(500).json({ error: "GOOGLE_CALLBACK_URL not configured" });
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}&` +
      `scope=profile email&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    return res.status(200).json({
      authUrl: googleAuthUrl
    });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return res.status(500).json({ error: "Failed to generate Google auth URL" });
  }
};

/**
 * Handle Google OAuth2 with authorization code (for mobile apps or custom flows)
 */
export const googleAuthWithCode = async (req, res) => {
  try {
    await connectDB();
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.status(400).json({ error: "Failed to get access token" });
    }

    // Get user profile from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileResponse.json();
    
    if (!profile.email) {
      return res.status(400).json({ error: "Email not found in Google profile" });
    }

    // Check if user exists or create new user
    let user = await User.findOne({ email: profile.email });

    if (user) {
      // Update profile image if not set
      if (!user.profileImage && profile.picture) {
        user.profileImage = profile.picture;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: profile.name,
        email: profile.email,
        password: `google_${profile.id}`,
        profileImage: profile.picture || '',
        userType: 'user',
        accountStatus: 'active'
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateGoogleToken(user);

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        userType: user.userType,
        accountStatus: user.accountStatus,
        profileImage: user.profileImage || "",
        subscription: user.subscription || null,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: "Google authentication failed" });
  }
};

// Facebook OAuth2 Authentication Methods

/**
 * Handle Facebook OAuth2 callback and redirect to frontend
 */
export const handleFacebookCallback = async (req, res) => {
  try {
    // User is already authenticated by passport middleware
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`);
    }

    // Generate JWT token
    const token = generateFacebookToken(user);

    // Check user's subscription plan
    const hasActiveSubscription = user.subscription && 
                               user.subscription.plan && 
                               user.subscription.status === 'active';

    // Redirect to frontend with user data and token
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      userType: user.userType,
      accountStatus: user.accountStatus,
      profileImage: user.profileImage || "",
      subscription: user.subscription || null,
    };

    // Encode the data to pass via URL
    const encodedData = encodeURIComponent(JSON.stringify({
      token,
      user: userData,
      hasActiveSubscription
    }));

    return res.redirect(`${process.env.FRONTEND_URL}/auth/facebook/callback?data=${encodedData}`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`);
  }
};

/**
 * Get Facebook OAuth2 URL for frontend redirect
 */
export const getFacebookAuthUrl = async (req, res) => {
  try {
    // Check if required environment variables are set
    if (!process.env.FACEBOOK_APP_ID) {
      return res.status(500).json({ error: "FACEBOOK_APP_ID not configured" });
    }
    
    if (!process.env.FACEBOOK_CALLBACK_URL) {
      return res.status(500).json({ error: "FACEBOOK_CALLBACK_URL not configured" });
    }

    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${process.env.FACEBOOK_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.FACEBOOK_CALLBACK_URL)}&` +
      `scope=email&` +
      `response_type=code`;

    return res.status(200).json({
      authUrl: facebookAuthUrl
    });
  } catch (error) {
    console.error('Error generating Facebook auth URL:', error);
    return res.status(500).json({ error: "Failed to generate Facebook auth URL" });
  }
};

/**
 * Handle Facebook OAuth2 with authorization code (for mobile apps or custom flows)
 */
export const facebookAuthWithCode = async (req, res) => {
  try {
    await connectDB();
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.status(400).json({ error: "Failed to get access token" });
    }

    // Get user profile from Facebook
    const profileResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
    const profile = await profileResponse.json();
    
    if (!profile.email) {
      return res.status(400).json({ error: "Email not found in Facebook profile" });
    }

    // Check if user exists or create new user
    let user = await User.findOne({ email: profile.email });

    if (user) {
      // Update profile image if not set
      if (!user.profileImage && profile.picture?.data?.url) {
        user.profileImage = profile.picture.data.url;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: profile.name,
        email: profile.email,
        password: `facebook_${profile.id}`,
        profileImage: profile.picture?.data?.url || '',
        userType: 'user',
        accountStatus: 'active'
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateFacebookToken(user);

    return res.status(200).json({
      message: "Facebook login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber || "",
        userType: user.userType,
        accountStatus: user.accountStatus,
        profileImage: user.profileImage || "",
        subscription: user.subscription || null,
      },
    });
  } catch (error) {
    console.error('Facebook auth error:', error);
    return res.status(500).json({ error: "Facebook authentication failed" });
  }
};