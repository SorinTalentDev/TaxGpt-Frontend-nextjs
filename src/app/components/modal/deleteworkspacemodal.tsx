import React from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  workspaceId: string;
  workspaceName: string;
}

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceId,
  workspaceName,
}) => {
  const handleDeleteForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Retrieve userId from localStorage
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id: userId } = JSON.parse(userdata);

      // Send request to delete the workspace
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/delete`,
        {
          userId,
          workspaceId,
          workspaceName,
        }
      );

      console.log(userId);
      console.log(workspaceId);
      console.log(workspaceName);
      // Check if the deletion was successful
      if (response.data.success === 1) {
        toast.success("Workspace deleted successfully!");
        onSubmit(workspaceName); // Handle any further UI logic
        onClose(); // Close the modal
        window.location.href = "/workspace"; // Redirect to workspace listing
      } else {
        throw new Error(response.data.message || "Failed to delete workspace.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the workspace."
      );
    }
  };

  if (!isOpen) return null; // If the modal is not open, return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <h2 className="text-lg font-bold mb-4">Delete the Space</h2>
        <p className="mb-4">Are you sure you want to delete the workspace?</p>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteForm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default DeleteWorkspaceModal;
