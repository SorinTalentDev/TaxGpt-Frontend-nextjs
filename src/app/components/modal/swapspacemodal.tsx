"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface SwapWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workspaceName: string) => void;
  messageId?: string;
}

const SwapWorkspaceModal: React.FC<SwapWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  messageId,
}) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [sampleWorkspaces, setSampleWorkspaces] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Initially set dropdown to false

  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Fetch workspaces when modal is opened
  useEffect(() => {
    if (isOpen) {
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id } = JSON.parse(userdata);
      const userId = _id;
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/getAll`, {
          userId,
        })
        .then((response) => {
          if (response.data.success === 1) {
            const workspaces = response.data.data.map(
              (workspace: { workspaceName: string }) => workspace.workspaceName
            );
            setSampleWorkspaces(workspaces);
          } else {
            toast.error(response.data.message || "Failed to load workspaces.");
          }
        })
        .catch((error) => {
          console.error("Error fetching workspaces:", error);
          toast.error("Error loading workspaces.");
        });
    }
  }, [isOpen]);

  // Close dropdown if clicked outside of modal or input
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleInputFocus = () => {
    setIsDropdownVisible(true); // Show dropdown when input is focused
  };

  const handleInputClick = () => {
    setIsDropdownVisible((prev) => !prev); // Toggle dropdown visibility on click
  };

  const handleWorkspaceClick = (workspace: string) => {
    setWorkspaceName(workspace);
    setIsDropdownVisible(false); // Close dropdown after selection
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      toast.error("Please select a workspace!");
      return;
    }

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
        "https://ltpoc-backend-b90752644b3c.herokuapp.com/message/addworkspace",
        {
          userId,
          messageId,
          workspaceName,
        }
      );
      console.log("response:", response);
      if (response.data.success === 1) {
        // Notify parent component
        onSubmit(workspaceName);
      } else {
        toast.error(response.data.message || "Failed to swap workspace.");
      }
    } catch (error) {
      console.error("Error swapping workspace:", error);
      toast.error("An error occurred while swapping the workspace.");
    }

    onClose(); // Close modal
    // window.location.reload();
    setWorkspaceName(""); // Reset input field
    setIsDropdownVisible(false); // Hide dropdown
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-96 relative">
        <h2 className="text-lg font-bold mb-4">Swap Workspace</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={workspaceName}
              onFocus={handleInputFocus} // Show dropdown on input focus
              onClick={handleInputClick} // Toggle dropdown on input click
              placeholder="Select a Workspace"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            {/* Dropdown for workspace suggestions */}
            {isDropdownVisible && (
              <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {sampleWorkspaces.map((workspace) => (
                  <li
                    key={workspace}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleWorkspaceClick(workspace)} // Select workspace
                  >
                    {workspace}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-4">
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
              Swap
            </button>
          </div>
        </form>

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

export default SwapWorkspaceModal;
