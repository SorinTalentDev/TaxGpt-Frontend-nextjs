"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface AddWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  messageId?: string;
}

const AddWorkspaceModal: React.FC<AddWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  messageId,
}) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [sampleWorkspaces, setSampleWorkspaces] = useState<string[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<string[]>([]);
  const [isExistingWorkspace, setIsExistingWorkspace] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Fetch workspaces when modal is opened
  useEffect(() => {
    const userdata = localStorage.getItem("userdata");
    if (!userdata) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const { _id } = JSON.parse(userdata);
    const userId = _id;
    if (isOpen) {
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
            setFilteredWorkspaces(workspaces); // Initialize filtered workspaces with all workspaces
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

  // Update filtered workspaces whenever workspaceName changes
  useEffect(() => {
    // alert(messageId);
    if (workspaceName.trim()) {
      const filtered = sampleWorkspaces.filter((workspace) =>
        workspace.toLowerCase().includes(workspaceName.toLowerCase())
      );
      setFilteredWorkspaces(filtered);

      // Check if workspace already exists in the list
      const workspaceExists = sampleWorkspaces.some(
        (workspace) => workspace.toLowerCase() === workspaceName.toLowerCase()
      );
      setIsExistingWorkspace(workspaceExists);
    } else {
      setFilteredWorkspaces(sampleWorkspaces); // Show all workspaces if the input is empty
      setIsExistingWorkspace(false);
    }
  }, [workspaceName, sampleWorkspaces]);

  useEffect(() => {
    // Close dropdown if click happens outside of the input or modal
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false); // Hide dropdown when clicking outside
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setWorkspaceName(""); // Update workspace name and trigger filtering
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true); // Show dropdown when input is focused
    if (workspaceName.trim() === "") {
      setFilteredWorkspaces(sampleWorkspaces); // Show all workspaces when input is empty
    }
  };

  const handleInputClick = () => {
    setIsDropdownVisible((prev) => !prev); // Toggle dropdown visibility
  };

  const handleWorkspaceClick = (workspace: string) => {
    setWorkspaceName(workspace); // Set selected workspace as the input value
    setIsExistingWorkspace(true); // Mark the workspace as existing
    setIsDropdownVisible(false); // Close dropdown after selection
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure workspaceName is not empty
    if (workspaceName.trim() === "") {
      toast.error("Workspace name cannot be empty!");
      return;
    }

    const userdata = localStorage.getItem("userdata");
    if (!userdata) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const { _id: userId } = JSON.parse(userdata); // Extract userId from localStorage

    console.log("userId:", userId);
    console.log("messageId", messageId);
    console.log("workspaceName:", workspaceName);
    try {
      // Make POST request to backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/addworkspace`,
        {
          userId,
          messageId,
          workspaceName,
        }
      );
      console.log("response:", response);
      if (response.data.success === 1) {
        toast.success(`Workspace "${workspaceName}" selected successfully.`);

        // Notify parent component
        onSubmit(workspaceName);
      } else {
        toast.error(response.data.message || "Failed to add workspace.");
      }
    } catch (error) {
      console.error("Error adding workspace:", error);
      toast.error("An error occurred while adding the workspace.");
    }

    // Reset form state and close modal
    setWorkspaceName("");
    setFilteredWorkspaces([]);
    setIsDropdownVisible(false);
    onClose();
    // window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-96 relative">
        <h2 className="text-lg font-bold mb-4">Select the Workspace</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={workspaceName}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            placeholder="Select the Workspace Name"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 mb-4"
          />

          {/* Dropdown for workspace suggestions */}
          {isDropdownVisible && (
            <ul className="absolute mt-1 w-[340px] bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredWorkspaces.map((workspace) => (
                <li
                  key={workspace}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleWorkspaceClick(workspace)}
                >
                  {workspace}
                </li>
              ))}
            </ul>
          )}

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
              className={`px-4 py-2 rounded-md text-white ${
                isExistingWorkspace
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isExistingWorkspace ? "Add" : "Select"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkspaceModal;
