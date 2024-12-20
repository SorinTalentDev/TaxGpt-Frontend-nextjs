import { useState, useEffect } from "react";
import {
  // ArrowDown,
  ArrowLeftRight,
  // ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Ellipsis,
  Plus,
  Trash,
  X,
} from "lucide-react"; // For the dropdown button
import AddWorkspaceModal from "../modal/addworkspacemodal";
// import toast from "react-hot-toast";
import SwapWorkspaceModal from "../modal/swapspacemodal";
import RemoveFromSpaceModal from "../modal/removefromspacemodal";
import RenderMessage from "./RenderMessage";
import DeleteThreadModal from "../modal/deletethreadmodal";
import moment from "moment";
import classNames from "classnames";

interface MessageHistoryItemProps {
  id: string;
  userMessage: string;
  assistantMessage: string;
  createdDate: string;
  workspaceName: string; // We now have workspaceName prop
  fetchMessageHistory: () => Promise<void>;
}

const MessageHistoryItem = ({
  id,
  userMessage,
  assistantMessage,
  createdDate,
  workspaceName, // Accept workspaceName prop
  fetchMessageHistory,
}: MessageHistoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track expanded/collapsed view
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("");
  const [currentUrl, setCurrentUrl] = useState<string>("");
  // Helper function to truncate the userMessage
  const getTruncatedMessage = (message: string, maxLength: number) => {
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const handleCreateWorkspace = (name: string) => {
    // toast.success(`Created workspace ${name} successfully!`);
    console.log(name);
    fetchMessageHistory();
  };

  const handleSwapWorkspace = (workspaceName: string) => {
    setCurrentWorkspace(workspaceName); // Update the current workspace
    fetchMessageHistory();
    console.log(currentWorkspace);
  };

  const handleDelete = () => {
    // Implement the logic for removing from the space here.
    fetchMessageHistory();
  };
  // Add current URL to state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      const parsedUrl = new URL(fullUrl);

      // Log the full URL to see what's happening
      console.log("Full URL:", fullUrl);
      console.log("Parsed URL:", parsedUrl);
      // Split the pathname and take the desired part
      const extractedBaseUrl = `${parsedUrl.origin}${parsedUrl.pathname
        .split("/")
        .slice(0, 2)
        .join("/")}`;
      setCurrentUrl(extractedBaseUrl);
      console.log("currentUrl: ", extractedBaseUrl);
    }
  }, []);
  return (
    <div
      id={id}
      className="p-4 border-t-4 dark:border-[#2b2c2d] border-gray-300 relative"
    >
      {/* Show truncated or full userMessage based on `isExpanded` */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 dark:text-white text-black font-bold cursor-pointer"
      >
        <p className="flex items-center">
          {isExpanded ? (
            <>
              {userMessage} <ChevronDown size={20} className="ml-3" />
            </>
          ) : (
            <>
              {getTruncatedMessage(userMessage, 20)}{" "}
              <ChevronRight size={20} className="ml-3" />
            </>
          )}
        </p>
      </div>

      {/* Only show assistantMessage when expanded */}
      {isExpanded && (
        <div className="mb-2 dark:text-[#828686] text-gray-500">
          {/* Pass only the assistant message content to RenderMessage */}
          <RenderMessage message={{ content: assistantMessage }} />
        </div>
      )}

      {/* Bottom section: Created date and dropdown */}
      <div className="bottom-2 left-0 right-0 flex items-center justify-between dark:text-[#8d9191] text-black text-sm">
        <div className="flex items-center">
          <Clock />
          <span className="mx-1">
            {/* {formatDistanceToNow(new Date(createdDate), { addSuffix: true })} */}
            {moment(createdDate).local().fromNow()}
          </span>
        </div>
        <div className="relative flex items-center">
          {/* Check if workspaceName is present */}
          {workspaceName ? (
            <span className="dark:text-white px-4 py-2 dark:bg-[#2b2c2d] bg-gray-300 rounded-full text-center">
              {workspaceName} {/* Display workspace name */}
            </span>
          ) : (
            // Show Plus button if workspaceName is empty
            currentUrl &&
            currentUrl !== "https://app.myaiwiz.com/share" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-full hover:bg-gray-700 focus:outline-none p-2"
              >
                <Plus />
              </button>
            )
          )}

          {currentUrl && currentUrl !== "https://app.myaiwiz.com/share" && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from toggling the message
                setIsDropdownOpen((prev) => !prev);
              }}
              className="text-white p-2 rounded-full dark:hover:bg-gray-700 hover:bg-gray-300 focus:outline-none"
            >
              <Ellipsis className="text-[#828686]" />
            </button>
          )}
          {isDropdownOpen && (
            <div
              className={classNames(
                "absolute right-0 mt-44 w-48 dark:bg-[#191a1a] bg-gray-300 rounded-lg shadow-lg border-t-2 dark:border-[#2b2c2d] z-50",
                {
                  "mt-[80px]": !workspaceName,
                }
              )}
            >
              {workspaceName && (
                <button
                  onClick={() => setIsSwapModalOpen(true)}
                  className="flex items-center w-full text-left px-4 py-2 rounded-lg dark:text-white text-black dark:hover:bg-[#323333] hover:bg-gray-400"
                >
                  <ArrowLeftRight />
                  <p className="mx-1">Swap Spaces</p>
                </button>
              )}

              {workspaceName && (
                <button
                  onClick={() => setIsRemoveModalOpen(true)}
                  className="flex items-center w-full text-left px-4 py-2 rounded-lg dark:text-white text-black dark:hover:bg-[#323333] hover:bg-gray-400"
                >
                  <X />
                  <p className="mx-1">Remove from Space</p>
                </button>
              )}
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center w-full text-left px-4 py-2 rounded-lg dark:text-white text-black dark:hover:bg-[#323333] hover:bg-gray-400"
              >
                <Trash />
                <p className="mx-1">Delete Thread</p>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Workspace Modal */}
      <AddWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkspace}
        messageId={id}
      />
      <SwapWorkspaceModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={handleSwapWorkspace}
        messageId={id}
      />
      <RemoveFromSpaceModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onDelete={handleDelete}
        messageId={id}
      />
      <DeleteThreadModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        messageId={id}
      />
    </div>
  );
};

export default MessageHistoryItem;
