"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface EditWorkspaceModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  workspaceId: string; // Add workspaceId prop
  workspaceName: string; // Add workspaceName prop
}

const EditWorkspaceModal: React.FC<EditWorkspaceModal> = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  workspaceName,
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState(workspaceName);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newWorkspaceName.trim() === "") {
      toast.error("Workspace name cannot be empty!");
      return;
    }

    try {
      // Retrieve userId from localStorage
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id: userId } = JSON.parse(userdata);

      // Make API call to update workspace name
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/edit`,
        {
          userId,
          workspaceId,
          workspaceName: newWorkspaceName,
        }
      );
      if (response.status === 200) {
        toast.success("Workspace name updated successfully!");
        onSubmit(newWorkspaceName); // Update the parent component state
        onClose(); // Close modal
        window.location.href = "/workspace";
      } else {
        throw new Error("Failed to update workspace name");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the workspace name.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Edit Workspace Name</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Workspace Name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 mb-4"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkspaceModal;
