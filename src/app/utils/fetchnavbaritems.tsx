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
  today: { groupBy: string; latestDate: string }[]; // Today's groups
  yesterday: { groupBy: string; latestDate: string }[]; // Yesterday's groups
  last7Days: { groupBy: string; latestDate: string }[]; // Previous 7 days groups
  last30Days: { groupBy: string; latestDate: string }[]; // Previous 30 days groups
}> => {
  try {
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/message/get`,
      { userId }
    );

    if (response.data.success === 1 && response.data.data) {
      // Categorized data arrays
      const today: { groupBy: string; latestDate: string }[] = [];
      const yesterday: { groupBy: string; latestDate: string }[] = [];
      const last7Days: { groupBy: string; latestDate: string }[] = [];
      const last30Days: { groupBy: string; latestDate: string }[] = [];

      const now = new Date();

      // Helper function to get the difference in days between two dates
      const getDiffInDays = (date1: string, date2: string) => {
        const diffTime = Math.abs(
          new Date(date1).getTime() - new Date(date2).getTime()
        );
        return Math.floor(diffTime / (1000 * 3600 * 24)); // Returns difference in days
      };

      // Categorize and group the data
      response.data.data.forEach((messageData) => {
        const createdDate = new Date(messageData.createddate);
        const diffInDays = getDiffInDays(
          now.toISOString(),
          messageData.createddate
        );

        const groupByValue = messageData.groupBy || "Unknown Group";

        // Skip processing if the groupBy is "Unknown Group"
        if (groupByValue === "Unknown Group") {
          return;
        }

        // Depending on the date, add to the correct category
        const group = {
          groupBy: groupByValue,
          latestDate: messageData.createddate,
        };

        if (diffInDays === 0) {
          if (!today.some((existingGroup) => existingGroup.groupBy === group.groupBy)) {
            today.push(group);
          }
        } else if (diffInDays === 1) {
          if (!yesterday.some((existingGroup) => existingGroup.groupBy === group.groupBy)) {
            yesterday.push(group);
          }
        } else if (diffInDays <= 7) {
          if (!last7Days.some((existingGroup) => existingGroup.groupBy === group.groupBy)) {
            last7Days.push(group);
          }
        } else if (diffInDays <= 30) {
          if (!last30Days.some((existingGroup) => existingGroup.groupBy === group.groupBy)) {
            last30Days.push(group);
          }
        }
      });

      // Sort each category by latestDate in descending order
      const sortByLatestDate = (
        a: { latestDate: string },
        b: { latestDate: string }
      ) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();

      return {
        today: today.sort(sortByLatestDate),
        yesterday: yesterday.sort(sortByLatestDate),
        last7Days: last7Days.sort(sortByLatestDate),
        last30Days: last30Days.sort(sortByLatestDate),
      };
    }

    return {
      today: [],
      yesterday: [],
      last7Days: [],
      last30Days: [],
    };
  } catch (error) {
    console.error("Error fetching message history:", error);
    return {
      today: [],
      yesterday: [],
      last7Days: [],
      last30Days: [],
    };
  }
};
