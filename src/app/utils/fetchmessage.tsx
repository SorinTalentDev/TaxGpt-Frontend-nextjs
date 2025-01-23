import axios from "axios";

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
  groupBy?: string; // Added groupBy to the interface if it's part of the response
}

interface ResponseData {
  success: number;
  data: MessageData[];
  message: string;
}

/**
 * Fetch message history for a specific date.
 * @param userId - The ID of the user.
 * @param date - The date in "YYYY-MM-DD" format to filter messages.
 * @param groupBy - The grouping criteria.
 * @returns An array of formatted messages.
 */
export const fetchMessageHistory = async (
  userId: string,
  date: string,
  groupBy: string
): Promise<{ role: string; content: string }[]> => {
  try {
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
      { userId }
    );
    if (response.data.success === 1 && response.data.data) {
      const formattedMessages = response.data.data.flatMap((messageData) => {
        const messageDate = new Date(messageData.createddate)
          .toISOString()
          .split("T")[0];

        // Ensure `groupBy` exists in `messageData` or handle it accordingly
        if (messageDate === date && messageData.groupBy === groupBy) {
          const userMessage =
            messageData.messages.find((message) => message.role === "user")
              ?.message || "";
          const assistantMessage =
            messageData.messages.find((message) => message.role === "assistant")
              ?.message || "";

          return [
            { role: "user", content: userMessage },
            { role: "assistant", content: assistantMessage },
          ];
        }
        return [];
      });

      return formattedMessages;
    }

    return [];
  } catch (error) {
    console.error("Error fetching message history:", error);
    return [];
  }
};

export const MessageHistoryCount = async (userId: string) => {
  try {
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
      { userId }
    );

    console.log(response.data.data);
    if (response.data.success === 1 && response.data.data) {
      if (response.data.data.length > 4) {
        return "true";
      } else {
        return "false";
      }
    }
  } catch (error) {
    console.error(error);
  }
};
