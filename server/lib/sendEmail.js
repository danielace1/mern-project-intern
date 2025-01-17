import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import emailVerification from "../models/emailVerification.model.js";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendEmail = async (_id, email, username) => {
  const token = _id + uuidv4();
  // const link = `http://localhost:5173/reset-password/${_id}/${token}`;
  const link = `https://mern-project-intern-client.vercel.app/reset-password/${_id}/${token}`;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<div style="background-color: #f3f4f6; font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome ${username}</h1>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      To complete your registration, please click the link below to verify your email address:
    </p>
    <div style="text-align: center; margin-bottom: 20px;">
      <a href="${link}" style="
        background-color: #3b82f6;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none;
        display: inline-block;
      ">
        Verify Email
      </a>
    </div>
    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      If you didn't request this, please ignore this email.
    </p>
  </div>
</div>
    `,
  };

  try {
    const newVerifiedEmail = new emailVerification({
      userId: _id,
      token: token,
      createdAt: Date.now(),
    });

    await newVerifiedEmail.save();
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error in sending email:", error.message);
    return false;
  }
};
