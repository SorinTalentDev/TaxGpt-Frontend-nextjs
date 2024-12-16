"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Mark from "@/app/components/layout/Mark";
import toast from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const gotoadmin = () => {
    if (username === "admin" && password === "123123123") {
      // Navigate to the admin dashboard if credentials are valid
      localStorage.setItem("AdminAuth", "true");
      router.push("/admin/dashboard");
    } else {
      console.log("Username:", username);
      console.log("Password:", password);
      toast.error("Wrong username or password!");
      return;
    }
  };

  const gotoback = () => {
    router.push("/");
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="w-full m-0 p-0 h-screen bg-bg-main">
      {/* Header */}
      <div className="w-full m-0 bg-white flex justify-between items-center shadow-lg">
        <div className="flex items-center mx-5">
          <Mark />
        </div>
        <div>
          <button
            className="bg-regal-blue text-white p-2 rounded-md mx-5"
            onClick={gotoback}
          >
            Go to Home
          </button>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full m-0 p-12">
        <div className="flex text-center justify-center">
          <p className="font-Ambit font-bold text-3xl">Login</p>
        </div>
        <div className="flex justify-center mt-6">
          <div className="bg-white rounded-xl p-8 font-Ambit shadow-2xl">
            {/* Username */}
            <p>Username*</p>
            <input
              className="bg-gray-200 h-10 rounded-lg p-2 w-60"
              placeholder="Enter the Username"
              value={username}
              onChange={handleUsernameChange}
            />

            {/* Password */}
            <p className="mt-5">Password*</p>
            <input
              type="password"
              className="bg-gray-200 h-10 rounded-lg p-2 w-60"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />

            {/* Buttons */}
            <div className="flex justify-between mt-5">
              <button onClick={gotoback}>Back</button>
              <button
                className="bg-regal-blue text-white p-2 rounded-md"
                onClick={gotoadmin}
              >
                Go to Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
