import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import emailVerification from "../models/emailVerification.model.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import { sendEmail } from "../lib/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.log("Error in registering user: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!username || !isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in logging in user: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      secure: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      sameSite: "none",
      domain: ".vercel.app",
    });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logging out user: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist." });
    }

    const emailSent = await sendEmail(user._id, email, user.username);
    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Error sending email. Please try again later." });
    }

    res.status(200).json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.log("Error in forgotPassword: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    const resetRecord = await emailVerification.findOne({ userId: id });
    if (!resetRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset link." });
    }

    const isValidToken = token === resetRecord.token;

    if (!isValidToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset link." });
    }

    const currentTime = Date.now();
    if (resetRecord.createdAt + 3600000 < currentTime) {
      return res
        .status(400)
        .json({ message: "Password reset link has expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await emailVerification.findByIdAndDelete(resetRecord._id);

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.log("Error in resetting password:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller: ", error.message);
    res.status(500).json({ message: error.message });
  }
};
