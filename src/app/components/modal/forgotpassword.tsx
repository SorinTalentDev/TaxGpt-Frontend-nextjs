// ForgotPasswordModal.tsx
import React, { useState } from "react";
import { auth } from "./../firebase/firebase"; // Firebase authentication methods
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent successfully!");
      onClose(); // Close modal after successful email sent
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
          Reset Password
        </h2>

        <form onSubmit={handleResetPassword} className="mt-6">
          <label
            htmlFor="email"
            className="text-lg text-gray-700 dark:text-white"
          >
            Enter your email address:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md dark:text-black"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
