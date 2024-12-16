"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string, created_date: string) => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim() === "") {
      toast.error("Workspace name cannot be empty!");
      return;
    }

    setLoading(true); // Start loading
    try {
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id } = JSON.parse(userdata); // Extract userId from localStorage
      const userId = _id;
      // Make API call to save the workspace
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/save`,
        {
          userId,
          workspaceName,
        }
      );

      if (response.status === 200 || response.status === 201) {
        onSubmit(_id, workspaceName, new Date().toISOString());
        toast.success("Workspace created successfully!");
        setWorkspaceName(""); // Reset input field
        onClose(); // Close modal
      } else {
        throw new Error("Failed to create workspace");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the workspace.");
    } finally {
      setLoading(false); // End loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 dark:bg-[#1a1a1a]">
        <h2 className="text-lg font-bold mb-4">Create New Workspace</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Workspace Name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 mb-4 dark:text-black"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading} // Disable button during loading
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading} // Disable button during loading
              className={`px-4 py-2 rounded-md text-white ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create"} {/* Show loading text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;
