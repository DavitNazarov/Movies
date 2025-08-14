import { User } from "../model/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendEmail } from "../mail/sendEmail.js";
import { baseTemplate } from "../mail/templates/base.js";

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

    // 3) JWT cookie — wrap to avoid killing the request if env is wrong
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET");
      }
      generateTokenAndSetCookie(res, user._id);
    } catch (e) {
      console.error("JWT error:", e);
    }

    (async () => {
      try {
        const html = baseTemplate({
          title: "New sign-in to Movie Hub",
          body: `
            <h1>Hi${user.name ? `, ${user.name}` : ""}</h1>
            <p>We noticed a new sign-in to your account just now.</p>
            <p><a class="button" href="${
              process.env.APP_URL
            }">Open Movie Hub</a></p>
          `,
        });
        await sendEmail({
          to: user.email,
          subject: "New sign-in to your account",
          html,
          text: "New sign-in to your account.",
        });
      } catch (e) {
        console.error("Login email failed:", e?.response?.body || e);
        // don’t throw; login should still succeed
      }
    })();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
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
