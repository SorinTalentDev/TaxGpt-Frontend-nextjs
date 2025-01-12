import React, { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { fetchnavbaritems } from "@/app/utils/fetchnavbaritems";

// Define a NavItem type
// Define NavItem type
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type MsgItem = {
  label: string;
  href: string;
  createDate: string;
};

// Hook for workspace items
export const useWorkspaceItems = () => {
  const [workspaceItems, setWorkspaceItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const updateWorkspaceItems = () => {
      const storedData = localStorage.getItem("workspace");
      const parsedData: { id: string; name: string }[] = storedData
        ? JSON.parse(storedData)
        : [];

      const updatedWorkspaceItems = parsedData.reverse().map((workspace) => ({
        label: workspace.name,
        href: `/workspace/${workspace.id}?name=${workspace.name}`,
        icon: <UserGroupIcon className="w-6 h-6" />,
      }));

      setWorkspaceItems(updatedWorkspaceItems);
    };

    updateWorkspaceItems();

    // Optionally use an interval if workspace changes frequently
    const interval = setInterval(updateWorkspaceItems, 1000);

    return () => clearInterval(interval);
  }, []);

  return workspaceItems;
};

// Default navigation items
export const defaultNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: <HomeIcon className="w-6 h-6" />,
  },
  {
    label: "WorkSpace",
    href: "/workspace",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    label: "Chat History",
    href: "/chatHistory",
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
  },
];

export const useTodayMsgItems = () => {
  const [todayMsgItems, setTodayMsgItems] = useState<MsgItem[]>([]);

  useEffect(() => {
    const updateTodayMsgItems = async () => {
      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id;
        }
        if (userId) {
          const data = await fetchnavbaritems(userId); // Fetch navbar items using userId
          const todayData = data.today; // Get today's data from the fetched response
          // console.log("Todaydata : ", todayData);
          // Transform the 'today' data into the NavItem format
          const transformedTodayMsgItems: MsgItem[] = todayData.map((item) => ({
            label: `${item.groupBy}`, // You can format this label however you'd like
            href: `/home`, // Assuming the createdDate is a valid query parameter
            createDate: item.latestDate,
          }));

          setTodayMsgItems(transformedTodayMsgItems);
        }
      } catch (error) {
        console.error("Error fetching today's message items:", error);
      }
    };

    updateTodayMsgItems(); // Call the function to update the state

    const interval = setInterval(updateTodayMsgItems, 1000); // Optionally, you can use an interval to refresh the data

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []); // Run the effect whenever the userId changes

  return todayMsgItems;
};

export const useYesterdayMsgItems = () => {
  const [YesterdayMsgItems, setYesterdayMsgItems] = useState<MsgItem[]>([]);

  useEffect(() => {
    const updateYesterdayMsgItems = async () => {
      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id;
        }
        if (userId) {
          const data = await fetchnavbaritems(userId); // Fetch navbar items using userId
          const YesterdayData = data.yesterday; // Get today's data from the fetched response
          // console.log("data : ", YesterdayData);
          // Transform the 'today' data into the NavItem format
          const transformedYesterdayMsgItems: MsgItem[] = YesterdayData.map(
            (item) => ({
              label: `${item.groupBy}`, // You can format this label however you'd like
              href: `/home`, // Assuming the createdDate is a valid query parameter
              createDate: item.latestDate,
            })
          );

          setYesterdayMsgItems(transformedYesterdayMsgItems);
        }
      } catch (error) {
        console.error("Error fetching today's message items:", error);
      }
    };

    updateYesterdayMsgItems(); // Call the function to update the state

    const interval = setInterval(updateYesterdayMsgItems, 1000); // Optionally, you can use an interval to refresh the data

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []); // Run the effect whenever the userId changes

  return YesterdayMsgItems;
};

export const useLast7dayMsgItems = () => {
  const [Last7dayMsgItems, setLast7dayMsgItems] = useState<MsgItem[]>([]);

  useEffect(() => {
    const updateLast7dayMsgItems = async () => {
      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id;
        }
        if (userId) {
          const data = await fetchnavbaritems(userId); // Fetch navbar items using userId
          const Last7dayData = data.last7Days; // Get today's data from the fetched response
          // console.log("data : ", Last7dayData);
          // Transform the 'today' data into the NavItem format
          const transformedLast7dayMsgItems: MsgItem[] = Last7dayData.map(
            (item) => ({
              label: `${item.groupBy}`, // You can format this label however you'd like
              href: `/home`, // Assuming the createdDate is a valid query parameter
              createDate: item.latestDate,
            })
          );

          setLast7dayMsgItems(transformedLast7dayMsgItems);
        }
      } catch (error) {
        console.error("Error fetching today's message items:", error);
      }
    };

    updateLast7dayMsgItems(); // Call the function to update the state

    const interval = setInterval(updateLast7dayMsgItems, 1000); // Optionally, you can use an interval to refresh the data

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []); // Run the effect whenever the userId changes

  return Last7dayMsgItems;
};

export const useLast30dayMsgItems = () => {
  const [Last30dayMsgItems, setLast30dayMsgItems] = useState<MsgItem[]>([]);

  useEffect(() => {
    const updateLast30dayMsgItems = async () => {
      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id;
        }
        if (userId) {
          const data = await fetchnavbaritems(userId); // Fetch navbar items using userId
          const Last30dayData = data.last30Days; // Get today's data from the fetched response
          // console.log("data : ", Last30dayData);
          // Transform the 'today' data into the NavItem format
          const transformedLast30dayMsgItems: MsgItem[] = Last30dayData.map(
            (item) => ({
              label: `${item.groupBy}`, // You can format this label however you'd like
              href: `/home`, // Assuming the createdDate is a valid query parameter
              createDate: item.latestDate,
            })
          );

          setLast30dayMsgItems(transformedLast30dayMsgItems);
          localStorage.setItem(
            "Last30dayMsgItems",
            JSON.stringify({ transformedLast30dayMsgItems })
          );
        }
      } catch (error) {
        console.error("Error fetching today's message items:", error);
      }
    };

    updateLast30dayMsgItems(); // Call the function to update the state

    const interval = setInterval(updateLast30dayMsgItems, 1000); // Optionally, you can use an interval to refresh the data

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []); // Run the effect whenever the userId changes

  return Last30dayMsgItems;
};
