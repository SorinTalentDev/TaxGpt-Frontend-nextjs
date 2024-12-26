import axios from "axios";

// Define the types for the response and message format
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

// Function to fetch and group message history by workspace name
export const fetchWorkspacemsglist = async (): Promise<any[]> => {
  try {
    // Get userId from localStorage
    const storedData = localStorage.getItem("userdata");
    let userId: string | null = null;

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      userId = parsedData._id;
    }

    if (!userId) {
      console.log("No user ID found in localStorage");
      return []; // Return empty array if userId is not available
    }

    // Fetch message data from the backend
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
      { userId }
    );

    if (response.data.success === 1 && response.data.data) {
      const formattedMessages = response.data.data
        .map((messageData) => {
          const userMessage =
            messageData.messages.find((msg) => msg.role === "user")?.message ||
            "";
          const assistantMessage =
            messageData.messages.find((msg) => msg.role === "assistant")
              ?.message || "";
          const createdDate = messageData.createddate;

          return {
            id: messageData._id,
            userMessage,
            assistantMessage,
            createdDate,
            workspaceName: messageData.workspaceName,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );

      // Group messages by workspaceName and return as an array of objects
      const groupedMessages = formattedMessages.reduce((groups, message) => {
        if (!message.workspaceName) {
          return groups; // Skip if workspaceName is null
        }
        const workspaceGroup = groups.find(
          (group) => group.workspaceName === message.workspaceName
        );
        if (workspaceGroup) {
          workspaceGroup.messages.push({
            message: message.userMessage, // Only store the user message
          });
        } else {
          groups.push({
            workspaceName: message.workspaceName,
            messages: [
              {
                message: message.userMessage, // Only store the user message
              },
            ],
          });
        }
        return groups;
      }, [] as { workspaceName: string; messages: { message: string }[] }[]);

      return groupedMessages; // Return the grouped messages as JSON
    } else {
      console.log("Failed to fetch messages:", response.data.message);
      return []; // Return empty array if response is not successful
    }
  } catch (error) {
    console.error("Error fetching message history:", error);
    return []; // Return empty array in case of error
  }
};
