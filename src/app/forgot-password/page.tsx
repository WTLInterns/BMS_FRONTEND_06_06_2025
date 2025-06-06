"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("OTP sent successfully");
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setMessage("Password reset successfully");
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <label className="block mb-2 text-sm font-medium">OTP</label>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <label className="block mb-2 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Reset Password
            </button>
          </form>
        )}
        {message && <div className="text-center text-sm text-green-600 my-4">{message}</div>}
        {step === 3 && (
          <div className="text-center text-green-700 font-bold">Password reset successfully</div>
        )}
      </div>
    </div>
  );
}
