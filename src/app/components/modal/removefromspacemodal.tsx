import React from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface RemoveFromSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  messageId?: string;
}

const RemoveFromSpaceModal: React.FC<RemoveFromSpaceModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  messageId,
}) => {
  if (!isOpen) return null; // Do not render the modal if it's closed

  const handleDelete = async () => {
    const userdata = localStorage.getItem("userdata");
    if (!userdata) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const { _id: userId } = JSON.parse(userdata); // Extract userId from localStorage

    console.log("userId:", userId);
    try {
      // Make POST request to backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/addworkspace`,
        {
          userId,
          messageId,
          workspaceName: "",
        }
      );
      console.log("response:", response);
      if (response.data.success === 1) {
        toast.success("Successfully removed from the space.");
      } else {
        toast.error(response.data.message || "Failed to remove workspace.");
      }
    } catch (error) {
      console.error("Error removing workspace:", error);
      toast.error("An error occurred while removing the workspace.");
    }
    onDelete(); // Trigger the delete action
    onClose(); // Close the modal
    // window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative dark:bg-[#1a1a1a]">
        <h2 className="text-lg font-bold mb-4">Remove from Space</h2>
        <p className="mb-4">
          Are you sure you want to remove yourself from this space?
        </p>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Remove
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

export default RemoveFromSpaceModal;
