"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/app/components/layout/AdminLayout";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [testPubKey, setTestPubKey] = useState<string>("");
  const [testSecKey, setTestSecKey] = useState<string>("");
  const [livePubKey, setLivePubKey] = useState<string>("");
  const [liveSecKey, setLiveSecKey] = useState<string>("");
  const [mode, setMode] = useState<"test" | "live">("test");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/get-stripe-settings`
        );
        setTestPubKey(data.testPubKey || "");
        setTestSecKey(data.testSecKey || "");
        setLivePubKey(data.livePubKey || "");
        setLiveSecKey(data.liveSecKey || "");
        setMode(data.mode || "test");
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/save-stripe-settings`,
        {
          testPubKey,
          testSecKey,
          livePubKey,
          liveSecKey,
          mode,
        }
      );
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <Layout>
      <div className="w-full m-0 p-8 h-[calc(100vh-73px)] dark:bg-[#1f1f1f]">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Stripe Settings
        </h1>

        <div className="mb-4">
          <label className="block text-lg text-gray-800 dark:text-gray-200">Mode</label>
          <div className="flex items-center space-x-4">
            <div>
              <input
                type="radio"
                id="testMode"
                name="mode"
                value="test"
                checked={mode === "test"}
                onChange={() => setMode("test")}
                className="mr-2"
              />
              <label htmlFor="testMode" className="text-gray-700 dark:text-gray-300">
                Test Mode
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="liveMode"
                name="mode"
                value="live"
                checked={mode === "live"}
                onChange={() => setMode("live")}
                className="mr-2"
              />
              <label htmlFor="liveMode" className="text-gray-700 dark:text-gray-300">
                Live Mode
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-lg text-gray-800 dark:text-gray-200">Test Publishable Key</label>
          <input
            type="text"
            value={testPubKey}
            onChange={(e) => setTestPubKey(e.target.value)}
            disabled={mode === "live"}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Enter Test Publishable Key"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-gray-800 dark:text-gray-200">Test Secret Key</label>
          <input
            type="text"
            value={testSecKey}
            onChange={(e) => setTestSecKey(e.target.value)}
            disabled={mode === "live"}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Enter Test Secret Key"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-gray-800 dark:text-gray-200">Live Publishable Key</label>
          <input
            type="text"
            value={livePubKey}
            onChange={(e) => setLivePubKey(e.target.value)}
            disabled={mode === "test"}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Enter Live Publishable Key"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-gray-800 dark:text-gray-200">Live Secret Key</label>
          <input
            type="text"
            value={liveSecKey}
            onChange={(e) => setLiveSecKey(e.target.value)}
            disabled={mode === "test"}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Enter Live Secret Key"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
