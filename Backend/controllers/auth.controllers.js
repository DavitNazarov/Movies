import { User } from "../model/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendEmail } from "../mail/sendEmailNodemailer.js";
import { welcomeTemplate } from "../mail/templates/welcome.js";
import { verificationCodeTemplate } from "../mail/templates/verificationCode.js";
import { loginNotificationTemplate } from "../mail/templates/loginNotification.js";
import { passwordResetTemplate } from "../mail/templates/passwordReset.js";
import {
  generateVerificationCode,
  generateResetToken,
} from "../utils/generateCode.js";
import {
  parseDeviceInfo,
  getLocationFromIP,
  getClientIP,
} from "../utils/deviceInfo.js";

const isProduction = process.env.NODE_ENV === "production";
const cookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

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

    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false, // User must verify email first
      verificationToken: verificationCode,
      verificationTokenExpiresAt: verificationExpires,
    });

    await user.save();

    // Send verification code email (don't set cookie yet - user must verify first)
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Movie Hub",
        html: verificationCodeTemplate({
          name: user.name,
          code: verificationCode,
        }),
        text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
        category: "auth-verification",
      });
    } catch (emailError) {
      console.error("Failed to send verification email", emailError);
      // Don't fail signup if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message:
        "Account created. Please check your email for verification code.",
      requiresVerification: true,
      user: {
        ...user.toObject(),
        password: undefined,
        verificationToken: undefined, // Don't send code to client
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ error: "User already exists" });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Sign up failed:", error);
    res.status(500).json({ error: `Internal server error ${error.message}` });
  }
};

export const EmailVerification = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code || typeof code !== "string" || code.length !== 6) {
      return res
        .status(400)
        .json({ error: "Invalid verification code format" });
    }

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    // Verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    // Set authentication cookie
    generateTokenAndSetCookie(res, user._id);

    // Send welcome email after successful verification
    try {
      await sendEmail({
        to: user.email,
        subject: `Welcome: ${user.name}`,
        html: welcomeTemplate({ name: user.name }),
        text: `Welcome to Movie Hub, ${user.name}! Your email has been verified.`,
        category: "auth-welcome",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email", emailError);
      // Don't fail verification if email fails
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Welcome to Movie Hub!",
      user: {
        ...user.toObject(),
        password: undefined,
        verificationToken: undefined,
        imageUrl: user.imageUrl || "/avatars/default.jpg",
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: `Internal server error ${error.message}` });
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

    // Get device info and location for login notification
    const userAgent = req.headers["user-agent"] || "";
    const deviceInfo = parseDeviceInfo(userAgent);
    const clientIP = getClientIP(req);
    const location = await getLocationFromIP(clientIP);
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Send login notification email (don't block login if it fails)
    try {
      await sendEmail({
        to: user.email,
        subject: "New Login Detected - Movie Hub",
        html: loginNotificationTemplate({
          name: user.name,
          deviceInfo,
          location,
          timestamp,
        }),
        text: `New login detected from ${deviceInfo.device} (${deviceInfo.browser}) in ${location.city}, ${location.country} at ${timestamp}.`,
        category: "auth-login",
      });
    } catch (emailError) {
      console.error("Failed to send login notification email", emailError);
      // Don't fail login if email fails
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user.toObject(),
        password: undefined,
        verificationToken: undefined,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    ...cookieConfig,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  res.json({
    success: true,
    user: req.user,
  });
};

// POST /api/auth/forgot-password - Request password reset
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetExpires;
    await user.save();

    // Create reset link
    const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
    const resetLink = `${appUrl}/resetpassword/${resetToken}`;

    // Send password reset email
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password - Movie Hub",
        html: passwordResetTemplate({ name: user.name, resetLink }),
        text: `Click this link to reset your password: ${resetLink}. This link will expire in 1 hour.`,
        category: "auth-password-reset",
      });
    } catch (emailError) {
      console.error("Failed to send password reset email", emailError);
      // Clear token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();
      return res
        .status(500)
        .json({ error: "Failed to send password reset email" });
    }

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/auth/reset-password/:token - Reset password with token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
