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

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [profileUrl, SetProfileUrl] = useState();

  const fetchMessageHistory = async () => {
    try {
      const storedData = localStorage.getItem("userdata");
      let userId: string | null = null;

      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        userId = parsedData._id;
      } else {
        console.log("No data found in localStorage under 'userdata'.");
      }

      if (!userId) {
        console.log("User ID is missing. Cannot fetch messages.");
        setLoading(false);
        return;
      }

      const response = await axios.post<ResponseData>(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
        { userId }
      );

      if (response.data.success === 1 && response.data.data) {
        // Get today's date in "YYYY-MM-DD" format
        const today = new Date().toISOString().split("T")[0];

        const formattedMessages = response.data.data.flatMap((messageData) => {
          // Filter by today's date
          const messageDate = new Date(messageData.createddate)
            .toISOString()
            .split("T")[0];

          if (messageDate === today) {
            const userMessage =
              messageData.messages.find((message) => message.role === "user")
                ?.message || "";
            const assistantMessage =
              messageData.messages.find(
                (message) => message.role === "assistant"
              )?.message || "";

            return [
              {
                role: "user",
                content: userMessage,
              },
              {
                role: "assistant",
                content: assistantMessage,
              },
            ];
          }
          return [];
        });

        setMessages(formattedMessages); // Set the state with filtered messages
      } else {
        console.log("Failed to fetch messages:", response.data.message);
        setMessages([]); // Clear messages if fetching fails
      }
    } catch (error) {
      console.log("Error fetching message history:", error);
      setMessages([]); // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  const handleSendMessage = async () => {
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

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/send-message`,
          { messages: input, sessionId: userId, workspaceId: "" } // `userId` is accessible here
        );

        const assistantMessage = response.data.assistantResponse;

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantMessage },
        ]);
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
    <Layout>
      <div className="flex flex-col h-[calc(100vh-73px)] p-4 max-md:w-screen m-auto relative dark:bg-[#232324]">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto w-[50%] max-md:w-[100%] m-auto scrollbar-none"
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
                        className={`message ${message.role} bg-gray-200 inline-block p-4 rounded-full font-Ambit`}
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
                      <Image
                        src="/image/mark.png"
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
          {loading && <TextLoading />}
          {messages.length === 0 ? <Typewriter /> : ""}
        </div>

        {/* Input Box */}
        <div className="mt-4 mb-4 m-auto w-full">
          <div className="flex items-center w-[40%] m-auto gap-0.5 max-md:w-[100%]">
            <input
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a Prompt here"
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
      </div>
    </Layout>
  );
}
