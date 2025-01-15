import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import emailVerification from "../models/emailVerification.model.js";

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

let transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendEmail = async (_id, email, username, res) => {
  const token = _id + uuidv4();
  const link = `http://localhost:5000/users/verify/${_id}/${token}`;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "EMAIL VERIFICATION",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <script src="https://cdn.tailwindcss.com"></script> <!-- Tailwind CDN -->
    </head>
    <body class="bg-gray-100 font-sans text-gray-900">
      <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center mb-4">Welcome ${username}</h1>
        <p class="text-lg text-gray-700 mb-6">To complete your registration, please click the link below to verify your email address:</p>
        <div class="flex justify-center mb-6">
          <a href="${link}" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            Verify Email
          </a>
        </div>
        <p class="text-sm text-center text-gray-600">If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `,
  };

  try {
    const hashedToken = await bcrypt.hash(token, 12);
    const newVerifiedEmail = await emailVerification({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (!newVerifiedEmail) {
      return res
        .status(500)
        .json({ message: "Error saving email verification token." });
    }

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.log("Error in saving email verification: ", error.message);
    // Make sure to send the response only once
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};
