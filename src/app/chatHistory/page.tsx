"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/UserLayout";
import Threads from "../components/layout/Threads";
import { History } from "lucide-react";
// import toast from "react-hot-toast";

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

export default function Page() {
  const [messageHistory, setMessageHistory] = useState<MessageStructure[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<MessageStructure[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessageHistory = async () => {
    try {
      console.log(loading);
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
        const formattedMessages = response.data.data
          .map((messageData) => {
            const userMessage =
              messageData.messages.find((message) => message.role === "user")
                ?.message || "";
            const assistantMessage =
              messageData.messages.find(
                (message) => message.role === "assistant"
              )?.message || "";
            const createdDate = messageData.createddate;
            const workspaceName = messageData.workspaceName || "";

            return {
              id: messageData._id,
              userMessage,
              assistantMessage,
              createdDate,
              workspaceName,
            };
          })
          .sort((a, b) => {
            return (
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
            );
          });

        setMessageHistory(formattedMessages);
        setFilteredHistory(formattedMessages); // Initialize filtered history
      } else {
        // console.log("Failed to fetch messages:", response.data.message);
        setMessageHistory([]);
        setFilteredHistory([]);
      }
    } catch (error) {
      console.log("Error fetching message history:", error);
      setMessageHistory([]);
      setFilteredHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageHistory();
  }, []);

  // Update filtered history whenever the search query changes
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = messageHistory.filter(
      (message) =>
        message.userMessage.toLowerCase().includes(lowerCaseQuery) ||
        message.assistantMessage.toLowerCase().includes(lowerCaseQuery) ||
        message.workspaceName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHistory(filtered);
  }, [searchQuery, messageHistory]);

  const clearMessages = () => {
    // setMessages([]); // Clears the messages state
  };

  return (
    <div>
      {/* <Layout clearMessages={clearMessages}> */}
      <div className="dark:bg-[#191a1a] h-[calc(100vh-73px)] max-md:w-screen">
        <div className="flex dark:text-white text-black py-6 pl-6 justify-between items-center w-[90%]">
          <p className="text-4xl font-medium max-md:text-xl">Chat History</p>
          <form className="max-md:w-28 w-[60%]">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-[##676b6d]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 ps-10 text-base border border-[#676b6d] dark:text-white rounded-full dark:bg-[#202222] focus:ring-0"
                placeholder="Search your threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
        <div className="m-6">
          <div className="flex justify-start items-center text-center dark:text-white">
            <History />
            <p className="font-medium text-2xl mx-3">Threads</p>
          </div>
        </div>
        <div className="h-[calc(100vh-250px)] inline-block overflow-y-auto w-[100%] max-md:w-[88%] max-[350px]:w-[83%] max-[375px]:w-[85%] scrollbar-track-black pl-8 pr-[120px]">
          <Threads
            messageHistory={filteredHistory}
            fetchMessageHistory={fetchMessageHistory}
          />
        </div>
      </div>
      {/* </Layout> */}
    </div>
  );
}
