"use client";

import { useSearchParams } from "next/navigation"; // App Router's navigation
import { useEffect, useState, useRef } from "react";
import Threads from "@/app/components/layout/Threads";
import React from "react";
import EditWorkspaceModal from "@/app/components/modal/editworkspacename";
import Layout from "@/app/components/layout/UserLayout";
import { RxAvatar } from "react-icons/rx";
import Image from "next/image";
import RenderMessage from "@/app/components/layout/RenderMessage";
import TextLoading from "@/app/components/layout/TextLoading";
import logo from "./../../Assets/image/logo.png";
import {
  ArrowDown,
  // ArrowRight,
  // Boxes,
  // CirclePlus,
  Ellipsis,
  History,
  Send,
  // LockKeyholeIcon,
  Slack,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteWorkspaceModal from "@/app/components/modal/deleteworkspacemodal";
import SocialShare from "@/app/components/layout/socialshare";
import Spinner from "@/app/components/layout/Spinner";
import UserInvite from "@/app/components/layout/Userinvite";

// Define the types for the message and response data
interface Message {
  role: string;
  message: string;
}

interface MessageData {
  _id: string;
  createddate: string;
  messages: Message[];
  userId: string;
  workspaceName: string | null;
}

interface ResponseData {
  success: number;
  data: MessageData[];
  message: string;
}

interface MessageStructure {
  id: string;
  userMessage: string;
  assistantMessage: string;
  createdDate: string;
  workspaceName: string;
}

export default function EditWorkspace({
  params: asyncParams,
}: {
  params: Promise<{ id: string; name: string }>;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [id, setId] = useState<string | null>(null);
  const [sharedUserId, SetShareduserId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isSwitchOn, setIsSwitchOn] = useState(false); // State for the switch
  const searchParams = useSearchParams();
  const [messageHistory, setMessageHistory] = useState<MessageStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [profileUrl, SetProfileUrl] = useState();

  // Handle scrolling
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    setShowScrollButton(!isAtBottom);
  };
  const fetchMessageHistory = async () => {
    try {
      // Get userId from localStorage
      const storedData = localStorage.getItem("userdata");
      let userId: string | null = null;

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        userId = parsedData._id;
        if (userId !== null) {
          SetShareduserId(userId);
        }
      } else {
        console.log("No data found in localStorage under 'userdata'.");
      }

      if (!userId) {
        setLoading(false);
        return;
      }
      // Fetch data from the backend
      const response = await axios.post<ResponseData>(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
        { userId } // Send userId in the request body
      );

      if (response.data.success === 1 && response.data.data) {
        const formattedMessages = response.data.data
          .filter(
            (messageData) =>
              messageData.workspaceName &&
              messageData.workspaceName === workspaceName // Filter by workspaceName
          )
          .sort((a, b) => {
            // Sort by createdDate (newest first)
            return (
              new Date(b.createddate).getTime() -
              new Date(a.createddate).getTime()
            );
          })
          .map((messageData) => {
            // Extract userMessage, assistantMessage, createdDate, and workspaceName
            const userMessage =
              messageData.messages.find((message) => message.role === "user")
                ?.message || "";
            const assistantMessage =
              messageData.messages.find(
                (message) => message.role === "assistant"
              )?.message || "";
            const createdDate = messageData.createddate;

            return {
              id: messageData._id,
              userMessage,
              assistantMessage,
              createdDate,
              workspaceName: messageData.workspaceName || "",
            };
          });

        setMessageHistory(formattedMessages);

        // Group inversion
        const invertedGroups = formattedMessages
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the group order
          .flatMap((history) => [
            { role: "user", content: history.userMessage },
            { role: "assistant", content: history.assistantMessage },
          ]);

        setMessages(invertedGroups);
        setLoading(false);
      } else {
        console.log("Failed to fetch messages:", response.data.message);
        setMessageHistory([]);
      }
    } catch (error) {
      setMessageHistory([]);
      console.log("Error fetching message history:", error);
    }
  };

  // Use `React.use` to unwrap async params
  useEffect(() => {
    asyncParams.then((params) => {
      setId(params.id); // Unwrap and set the `id`
      // Get the workspace name from the query params
      const workspaceNameFromQuery = searchParams.get("name");
      if (workspaceNameFromQuery) {
        setWorkspaceName(workspaceNameFromQuery); // Set workspace name
      }
      // console.log("params.name:", workspaceNameFromQuery);
      // setWorkspaceName(params.name); // Set the initial workspace name
      // console.log(params);
    });
  }, [asyncParams]);
  useEffect(() => {
    const parsedUserData = JSON.parse(localStorage.getItem("userdata")!);
    SetProfileUrl(parsedUserData.profile_img);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const clearMessages = () => {
    setMessages([]); // Clears the messages state
  };
  // useEffect(() => {
  //   scrollToBottom(); // Automatically scroll to bottom on new messages
  // }, [messages]);
  useEffect(() => {
    if (workspaceName) {
      fetchMessageHistory();
    }
  }, [workspaceName, messages]); // Trigger fetch when workspaceName changes
  const handleDeleteWorkspaceName = () => {};

  if (!id) {
    // Render a loading state until the `id` is available
    return (
      <Layout clearMessages={clearMessages}>
        <div>Loading...</div>
      </Layout>
    );
  }
  const handleEditWorkspaceName = (name: string) => {
    setWorkspaceName(name);
    toast.success(`Successfully changed the workspace name to ${name}!`);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setMessageLoading(true);
      setInput(""); // Clear input box

      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null; // Declare `userId` outside the block
        const currentlyWorkspaceName = workspaceName;
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id; // Assign the value inside the block
          console.log(userId);
        } else {
          console.log("No data found in localStorage under 'userdata'.");
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/send-message`,
          {
            messages: input,
            sessionId: userId,
            workspaceName: currentlyWorkspaceName,
          } // `userId` is accessible here
        );

        const assistantMessage = response.data.assistantResponse;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
        scrollToBottom();
        setMessageLoading(false);
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setInput("");
        setMessageLoading(false);
      }
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Check for Ctrl + Enter
      e.preventDefault(); // Prevent default behavior
      // Call your function here
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* <Layout clearMessages={clearMessages}> */}
      <div className="dark:bg-[#191a1a] h-[calc(100vh-73px)] max-md:w-screen">
        <div className="flex items-center justify-between text-white border-b-2 p-3 border-b-gray-300 dark:border-b-[#2b2c2d]">
          <div className="flex items-center text-5xl max-md:hidden">
            <RxAvatar className=" text-black dark:text-white max-md:hidden hidden" />
            {/* <button className="flex items-center mx-5 text-[#20b8cd] max-md:mx-0">
              <UserPlus />
              <p className="text-lg mx-2 max-md:mx-0 max-md:ml-2">Invite</p>
            </button> */}
            <UserInvite
              dynamicContentId={id}
              dynamicContentTitle={workspaceName}
              dynamicContentSharedUserId={sharedUserId}
            />
          </div>
          <div className="flex dark:text-[#8d9191] text-lg items-center text-black">
            <Slack className="mx-2 max-md:mx-1" />
            <p className="text-lg mx-2 max-md:mx-1">{workspaceName}</p>
          </div>
          <div className="flex items-center relative max-md:block">
            {/* Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="dark:text-white text-black p-3 rounded-full dark:bg-[#060707] dark:hover:bg-gray-700 focus:outline-none bg-gray-300 hover:bg-gray-400"
              >
                <Ellipsis />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 dark:bg-[#191a1a] dark:text-white rounded-lg shadow-lg text-black z-50 bg-white">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="block w-full text-left px-4 py-2 dark:hover:bg-[#323333] rounded-lg hover:bg-gray-300"
                  >
                    Edit Workspace Name
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="block w-full text-left px-4 py-2 dark:hover:bg-[#323333] rounded-lg hover:bg-gray-300"
                  >
                    Delete Workspace
                  </button>
                  <button className="hidden w-full text-left px-4 py-2 hover:bg-[#323333] rounded-lg max-md:block">
                    share
                  </button>
                  <button className="hidden w-full text-left px-4 py-2 hover:bg-[#323333] rounded-lg max-md:block">
                    Invite
                  </button>
                </div>
              )}
            </div>

            {/* <button className="bg-[#20b8cd] flex p-3 ml-3 rounded-lg text-black items-center max-md:hidden">
              <Share2 className="mx-1" />
              <p className="mx-1 font-semibold font-Ambit">Share</p>
            </button> */}
            <SocialShare
              dynamicContentId={id}
              dynamicContentTitle={workspaceName}
              dynamicContentSharedUserId={sharedUserId}
            />
          </div>
        </div>
        <div className="flex text-black">
          <div className="w-[70%] max-md:w-full max-lg:w-full max-[1024px]:w-full">
            <div className="flex flex-col h-[calc(100vh-148px)] max-md:w-screen m-auto relative py-4">
              {/* message container */}
              <div
                ref={messagesContainerRef}
                className="flex-grow overflow-y-auto w-full px-[10%] max-md:w-[100%] m-auto scrollbar-track-inherit"
              >
                <div className="flex-col gap-4 flex">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex mb-2 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "user" ? (
                        <div className="flex justify-end w-full items-center">
                          <div className="text-black text-lg text-right">
                            <div
                              className={`message ${message.role} bg-gray-200 inline-block p-4 rounded-full font-Ambit`}
                            >
                              {message.content}
                            </div>
                          </div>
                          <div className="ml-4">
                            {/* <RxAvatar className="text-3xl m-3" /> */}
                            <img
                              src={profileUrl}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full border border-gray-300 mr-4"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex">
                          <div className="m-2">
                            <Image
                              src={logo}
                              alt="logo"
                              width={30}
                              height={30}
                            />
                          </div>
                          <div className="bg-blue-100 text-black w-full p-4 text-lg rounded-xl mb-6 font-Ambit">
                            <RenderMessage message={message} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                {messageLoading && <TextLoading />}
              </div>
              <div className="flex items-center w-[60%] m-auto gap-0.5 max-md:w-[100%]">
                <input
                  type="text"
                  value={input}
                  disabled={messageLoading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`New threads in ${workspaceName}`}
                  className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#232324] dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={messageLoading}
                  className={`px-4 py-3 text-black rounded-r-lg  border text-base dark:text-gray-400 ${
                    loading
                      ? "bg-gray-50"
                      : "bg-white hover:bg-blue-600 hover:text-white dark:bg-[#232324] dark:hover:bg-[#232324] dark:hover:text-white"
                  }`}
                >
                  {messageLoading ? <Spinner /> : <Send />}
                </button>
                {showScrollButton && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute left-[45%] bottom-[110px] z-50 transform -translate-x-1/2 bg-white border border-gray-300 text-black p-2 rounded-full hover:bg-gray-50 "
                  >
                    <ArrowDown size={20} />
                  </button>
                )}
              </div>
            </div>
            {/* <div className="m-6 relative">
              <label
                htmlFor="message"
                className="block mb-2 text-4xl font-medium dark:text-white text-black hidden"
              >
                {workspaceName}
              </label>
              <textarea
                id="message"
                // rows={4}
                rows={1}
                value={input}
                disabled={messageLoading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="block p-2.5 w-full text-base text-black dark:text-[#8d9191] dark:bg-[#202222] bg-white rounded-lg border dark:border-gray-300 border-gray-100 resize-none pb-12"
                placeholder={`New threads in ${workspaceName}`}
              ></textarea>

              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
                <div className="flex items-center">
                  <button className="bg-none text-[#8d9191] font-semibold py-2 flex items-center dark:hover:text-white hover:text-black hidden">
                    <Boxes className="mx-1" />
                    <p className="max-md:hidden">Source</p>
                  </button>
                  <button className="bg-none text-[#8d9191] font-semibold py-2 px-2 flex items-center dark:hover:text-white hover:text-black hidden">
                    <CirclePlus className="mx-1" />
                    <p className="max-md:hidden">Attach</p>
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mx-3 hidden">
                    <label className="flex items-center cursor-pointer">
                      <div
                        className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in`}
                      >
                        <input
                          type="checkbox"
                          id="switch"
                          checked={isSwitchOn}
                          onChange={() => setIsSwitchOn(!isSwitchOn)}
                          className="toggle-checkbox hidden"
                        />
                        <div
                          className={`toggle-label block w-12 h-6 rounded-full transition-transform duration-200 ease-in ${
                            isSwitchOn
                              ? "bg-blue-500"
                              : "dark:bg-[#2f302f] bg-gray-200"
                          }`}
                        >
                          <div
                            className={`toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${
                              isSwitchOn ? "transform translate-x-6" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </label>
                    <p
                      className={` mx-1 dark:hover:text-white hover:text-black ${
                        isSwitchOn
                          ? "dark:text-white text-black"
                          : "text-[#8d9191]"
                      }`}
                    >
                      {isSwitchOn ? "Pros" : "Pros"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleSendMessage}
                      className="dark:bg-[#2f302f] dark:text-[#575a5a] bg-gray-200 py-2 px-2 flex items-center rounded-full dark:hover:text-white hover:text-black"
                    >
                      <ArrowRight />
                    </button>
                  </div>
                </div>
              </div>
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute left-[50%] bottom-[110px] z-50 transform -translate-x-1/2 bg-white border border-gray-300 text-black p-2 rounded-full hover:bg-gray-50 "
                >
                  <ArrowDown size={20} />
                </button>
              )}
            </div> */}

            {/* Threads */}
          </div>
          <div className="w-[30%] max-md:hidden px-2 border-s-gray-300 border max-lg:hidden max-[1024px]:hidden">
            <div className="my-6">
              <div className="flex justify-start items-center text-center dark:text-white text-black">
                <History />
                <p className="font-medium text-2xl mx-3">Threads</p>
              </div>
            </div>
            <div className="w-full h-[calc(100vh-250px)] inline-block overflow-y-auto scrollbar-none text-black">
              <Threads
                messageHistory={messageHistory}
                fetchMessageHistory={fetchMessageHistory}
              />
            </div>
          </div>
        </div>
      </div>
      <EditWorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditWorkspaceName}
        workspaceId={id}
        workspaceName={workspaceName}
      />

      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteWorkspaceName}
        workspaceId={id}
        workspaceName={workspaceName}
      />
    </div>
    // </Layout>
  );
}
