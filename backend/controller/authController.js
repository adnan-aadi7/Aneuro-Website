import User from "../model/User.js";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";

export async function Signup(reqBody) {
  try {
    await connectDB();

    const { name, email, password, userType = "user" } = reqBody;

    // Validate required fields
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();

    // Return success (omit password)
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
