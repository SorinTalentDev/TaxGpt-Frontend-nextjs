"use client";

import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/layout/UserLayout";
import { ArrowDown, Send } from "lucide-react";
import axios from "axios";
import Spinner from "../components/layout/Spinner";
import TextLoading from "../components/layout/TextLoading";
import RenderMessage from "../components/layout/RenderMessage";
import Image from "next/image";
import Typewriter from "../components/layout/Typewriter";
import logo from "./../Assets/image/logo.png";
import {
  fetchMessageHistory,
  MessageHistoryCount,
} from "../utils/fetchmessage";
import toast from "react-hot-toast";
import PaymentModal from "../components/modal/paymentmodal";
interface Workspace {
  id: string;
  name: string;
  created_date: string;
}

interface responseData {
  _id: string; // Adjust based on your MongoDB ObjectId handling (it could be ObjectId or string)
  workspaceName: string;
  created_date: string; // or Date if it's a Date object
}

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [profileUrl, SetProfileUrl] = useState();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const fetchMessages = async () => {
    const storedData = localStorage.getItem("userdata");
    let userId: string | null = null;

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      userId = parsedData._id;
    }

    if (!userId) {
      console.log("User ID is missing. Cannot fetch messages.");
      return;
    }
    // const today = new Date().toISOString().split("T")[0];
    const groupBy = localStorage.getItem("currentGroupItems") || ""; // Default to an empty string if groupBy is null
    const date = localStorage.getItem("currentDate") || "";
    const formattedMessages = await fetchMessageHistory(userId, date, groupBy);

    console.log("formatted Message: ", formattedMessages);
    setMessages(formattedMessages);
  };
  const clearMessages = () => {
    setMessages([]); // Clears the messages state
  };

  const fetchWorkspaces = async () => {
    try {
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id } = JSON.parse(userdata);
      const userId = _id;
      // Call the backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/getAll`,
        { userId }
      );

      if (response.status === 200 && response.data.success === 1) {
        // Transform and update state
        const workspacesData = response.data.data.map(
          (workspace: responseData) => ({
            id: workspace._id,
            name: workspace.workspaceName,
            created_date: workspace.created_date,
          })
        );
        console.log("workspace: ", workspacesData);
        localStorage.setItem("workspace", JSON.stringify(workspacesData));
        setWorkspaces(workspacesData);
      } else {
        localStorage.setItem("workspace", "");
        // toast.error("Can't find workspaces.");
      }
    } catch (error) {
      console.log("Error fetching workspaces:", error);
      toast.error("please check your internet connection.");
    }
  };

  useEffect(() => {
    // fetchMessages();
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("ChangeSidebarState") === "true") {
        clearMessages();
        fetchMessages();
        localStorage.setItem("ChangeSidebarState", "false");
      }
    }, 1000); // Run every 1 second
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("newChat") === "true") {
        clearMessages();
        localStorage.setItem("newChat", "false");
      }
    }, 1000); // Run every 1 second
    return () => {
      clearInterval(interval);
    };
  }, []);
  const handleSendMessage = async () => {
    const storedData = localStorage.getItem("userdata");
    let expired_date: string | null = null;

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      expired_date = parsedData.expired_date;
    }

    if (expired_date == "") {
      const storedData = localStorage.getItem("userdata");
      let userId: string | null = null;

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        userId = parsedData._id;
      }

      if (!userId) {
        console.log("User ID is missing. Cannot fetch messages.");
        return;
      }

      const result = await MessageHistoryCount(userId);

      if (result === "true") {
        setIsPaymentModalOpen(true);
        return;
      }
    }
    // Ensure `expired_date` is compared as a valid date
    if (expired_date && new Date(expired_date).getTime() < Date.now()) {
      setIsPaymentModalOpen(true);
      return;
    }
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setLoading(true);
      setInput(""); // Clear input box

      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null; // Declare `userId` outside the block

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id; // Assign the value inside the block
          console.log(userId);
        } else {
          console.log("No data found in localStorage under 'userdata'.");
        }

        if (messages.length == 0) {
          // console.log("message: ", messages);
          localStorage.setItem("currentGroupItems", input);
        }
        const groupBy = localStorage.getItem("currentGroupItems");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/send-message`,
          {
            messages: input,
            sessionId: userId,
            workspaceId: "",
            groupBy: groupBy,
          } // `userId` is accessible here
        );

        const assistantMessage = response.data.assistantResponse;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
        if (messages.length < 3) {
          localStorage.setItem("refreshSidebar", "true");
        }
        scrollToBottom();
        setLoading(false);
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setInput("");
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior like line breaks
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    setShowScrollButton(!isAtBottom);
  };

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
  useEffect(() => {
    const parsedUserData = JSON.parse(localStorage.getItem("userdata")!);
    SetProfileUrl(parsedUserData.profile_img);
  }, []);

  useEffect(() => {
    scrollToBottom(); // Automatically scroll to bottom on new messages
  }, [messages]);

  return (
    // <Layout clearMessages={clearMessages}>
    <div className="flex flex-col h-[calc(100vh-73px)] py-4 max-md:w-screen m-auto relative dark:bg-[#232324]">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto w-full max-md:w-[100%] m-auto scrollbar-track-current px-[25%] max-lg:px-3"
      >
        <div className="flex-col gap-4 flex">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "user" ? (
                <div className="flex justify-end w-full items-center">
                  <div className="text-black text-lg text-right">
                    <div
                      className={`message ${message.role} bg-gray-200 inline-block p-4 rounded-full font-Ambit text-black dark:bg-[#1c1c1c] dark:text-white`}
                    >
                      {message.content}
                    </div>
                  </div>
                  <div>
                    {/* <RxAvatar className="text-3xl m-3" /> */}
                    <img
                      src={profileUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border border-gray-300 mr-4 mx-3"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex">
                  <div className="m-2">
                    <Image src={logo} alt="logo" width={30} height={30} />
                  </div>
                  <div className="bg-blue-100 text-black w-full p-4 text-lg rounded-xl mb-6 font-Ambit dark:bg-[#1a1a1a] dark:text-white">
                    <RenderMessage message={message} />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {loading && <TextLoading />}
        {messages.length === 0 ? <Typewriter /> : ""}
      </div>

      {/* Input Box */}
      <div className="mt-4 mb-4 m-auto w-full">
        <div className="flex items-center w-[40%] m-auto gap-0.5 max-md:w-[100%] max-lg:w-[80%]">
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message MyAIWiz"
            className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#232324] dark:text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className={`px-4 py-3 text-black rounded-r-lg  border text-base dark:text-gray-400 ${
              loading
                ? "bg-gray-50"
                : "bg-white hover:bg-blue-600 hover:text-white dark:bg-[#232324] dark:hover:bg-[#232324] dark:hover:text-white"
            }`}
          >
            {loading ? <Spinner /> : <Send />}
          </button>
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute left-[50%] bottom-[110px] z-50 transform -translate-x-1/2 bg-white border border-gray-300 text-black p-2 rounded-full hover:bg-gray-50 "
            >
              <ArrowDown size={20} />
            </button>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>

    // </Layout>
  );
}
