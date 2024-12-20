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
  groupBy: string | null;
}

interface ResponseData {
  success: number;
  data: MessageData[];
  message: string;
}

export const fetchnavbaritems = async (
  userId: string
): Promise<{
  data: {
    createdDate: string;
    groups: { groupBy: string; latestDate: string }[]; // Array of groups
  }[];
}> => {
  try {
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
      { userId }
    );

    if (response.data.success === 1 && response.data.data) {
      const transformedData: {
        createdDate: string;
        groups: { groupBy: string; latestDate: string }[]; // Array of groups
      }[] = [];

      // Grouping the data by date and group
      response.data.data.forEach((messageData) => {
        const messageDate = new Date(messageData.createddate)
          .toISOString()
          .split("T")[0]; // Extract date only (yyyy-mm-dd)
        const groupByValue = messageData.groupBy || "Unknown Group";
        const createdDate = messageData.createddate; // The full createddate

        // Check if the date already exists in transformedData
        let existingDateEntry = transformedData.find(
          (item) => item.createdDate === messageDate
        );

        if (!existingDateEntry) {
          // If date doesn't exist, create a new entry
          existingDateEntry = {
            createdDate: messageDate,
            groups: [],
          };
          transformedData.push(existingDateEntry);
        }

        // Check if the group already exists for the given date
        const existingGroup = existingDateEntry.groups.find(
          (group) => group.groupBy === groupByValue
        );

        if (!existingGroup) {
          // If group doesn't exist, add it
          existingDateEntry.groups.push({
            groupBy: groupByValue,
            latestDate: createdDate,
          });
        } else {
          // Compare and keep the latest createdDate for the group
          const currentLatestDate = new Date(existingGroup.latestDate);
          const newCreatedDate = new Date(createdDate);

          if (newCreatedDate > currentLatestDate) {
            existingGroup.latestDate = createdDate;
          }
        }
      });

      return { data: transformedData }; // Return the new structure
    }

    return { data: [] }; // Return an empty data array in case of failure
  } catch (error) {
    console.error("Error fetching message history:", error);
    return { data: [] }; // Return an empty data array in case of an error
  }
};
