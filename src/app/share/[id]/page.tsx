"use client";

import Layout from "@/app/components/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Threads from "@/app/components/layout/Threads";

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

export default function SharePage({
  params: asyncParams,
}: {
  params: Promise<{ id: string; name: string }>;
}) {
  const searchParams = useSearchParams();
  // const [id, setId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [sharedUser, setSharedUser] = useState<string>("");
  const [messageHistory, setMessageHistory] = useState<MessageStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    asyncParams.then((params) => {
      // setId(params.id);
      console.log(params);
      const workspaceNameFromQuery = searchParams.get("title");
      const SharedUserFromQuery = searchParams.get("Shared");
      if (workspaceNameFromQuery) {
        setWorkspaceName(workspaceNameFromQuery); // Set workspace name
      }
      if (SharedUserFromQuery) {
        setSharedUser(SharedUserFromQuery);
      }
    });
  }, [asyncParams, searchParams]);
  const fetchMessageHistory = async () => {
    if (!workspaceName) return;

    try {
      setLoading(true);
      const userId = sharedUser;
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
          .sort(
            (a, b) =>
              new Date(b.createddate).getTime() -
              new Date(a.createddate).getTime()
          )
          .map((messageData) => {
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
      } else {
        console.error("Failed to fetch messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching message history:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessageHistory();
  }, [workspaceName, sharedUser]); // Fetch when workspaceName or sharedUser changes

  return (
    <Layout>
      <div className="w-full dark:bg-[#0a0a0a]">
        <p className="text-center text-3xl text-black dark:text-white font-bold py-5 font-Ambit">
          {workspaceName}
        </p>
        <div className="flex-grow overflow-y-auto w-[80%] max-md:w-[100%] m-auto scrollbar-none  h-[calc(100vh-149px)]">
          {loading === false ? (
            <Threads
              messageHistory={messageHistory}
              fetchMessageHistory={fetchMessageHistory}
            />
          ) : (
            <p className="dark:text-white text-black text-center">
              Loading....
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
