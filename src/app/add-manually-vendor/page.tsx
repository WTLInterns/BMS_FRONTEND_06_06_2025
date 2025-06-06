"use client";
import { useState } from "react";
import { useTheme } from '../utils/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function AddManuallyVendorPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { isDark, toggleTheme } = useTheme();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Vendor invite sent successfully!");
    setEmail("");
  };

  return (
    <div className={`min-h-screen py-6 px-2 md:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6 max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Add Manually Vendor</h1>
      </div>
      <div className={`w-full max-w-md mx-auto rounded-xl shadow-lg p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter vendor email"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full py-2 rounded font-semibold shadow-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Send Invite
          </button>
          {message && <div className="text-green-500 dark:text-green-400 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
}
