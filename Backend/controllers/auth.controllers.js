import { User } from "../model/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExistence = await User.findOne({ email });
    if (userExistence) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000, // 1 hour
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found,Please sign up or check your email" });
    }
    const passwordValidity = await bcrypt.compare(password, user.password);
    if (!passwordValidity) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogIn = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        success: true,
        user: {
          ...user._doc,
          password: undefined,
          verificationToken: undefined,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
