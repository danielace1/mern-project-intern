import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await fetch(`${API_URL}/api/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong. Please try again."
        );
      }

      return data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      console.error("Forgot Password Error:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };
  return (
    <div className="flex justify-center items-center min-h-screen mx-auto">
      <div className="space-y-5 w-full max-w-md">
        {isSubmitted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              Check Your Email
            </h2>
            <p className="text-white mt-2">
              If the email is registered, you will receive a password reset
              link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold  text-center">
              Forgot Password
            </h2>
            <p className="text-gray-100 text-center mt-2">
              Enter your email address to reset your password.
            </p>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full outline-none mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login">
            <button type="button" className="text-blue-500 hover:underline">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
