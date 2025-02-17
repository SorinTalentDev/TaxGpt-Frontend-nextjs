import React, { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { fetchnavbaritems } from "@/app/utils/fetchnavbaritems";

// Define a NavItem type
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
    label: "My documents",
    href: "/documents",
    icon: <UserGroupIcon className="w-6 h-6" />,
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

// New consolidated hook
export const useMessageItems = () => {
  const [messageItems, setMessageItems] = useState({
    today: [] as MsgItem[],
    yesterday: [] as MsgItem[],
    last7Days: [] as MsgItem[],
    last30Days: [] as MsgItem[],
  });

  useEffect(() => {
    let isSubscribed = true;

    const updateMessageItems = async () => {
      try {
        const storedData = localStorage.getItem("userdata");
        let userId: string | null = null;

        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          userId = parsedData._id;
        }

        if (userId) {
          const data = await fetchnavbaritems(userId);

          if (!isSubscribed) return;

          const transformedData = {
            today: data.today.map((item) => ({
              label: `${item.groupBy}`,
              href: "/home",
              createDate: item.latestDate,
            })),
            yesterday: data.yesterday.map((item) => ({
              label: `${item.groupBy}`,
              href: "/home",
              createDate: item.latestDate,
            })),
            last7Days: data.last7Days.map((item) => ({
              label: `${item.groupBy}`,
              href: "/home",
              createDate: item.latestDate,
            })),
            last30Days: data.last30Days.map((item) => ({
              label: `${item.groupBy}`,
              href: "/home",
              createDate: item.latestDate,
            })),
          };

          setMessageItems(transformedData);
          localStorage.setItem(
            "Last30dayMsgItems",
            JSON.stringify(transformedData.last30Days)
          );
        }
      } catch (error) {
        console.error("Error fetching message items:", error);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        (e.key === "ChangeSidebarState" && e.newValue === "true") ||
        (e.key === "refreshSidebar" && e.newValue === "true") ||
        (e.key === "newChat" && e.newValue === "true")
      ) {
        updateMessageItems();
        localStorage.setItem(e.key, "false");
      }
    };

    // Initial fetch
    updateMessageItems();

    // Set up event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("updateMessages", () => updateMessageItems());

    // Periodic update every 30 seconds instead of every second
    const interval = setInterval(updateMessageItems, 30000);

    return () => {
      isSubscribed = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("updateMessages", () => updateMessageItems());
      clearInterval(interval);
    };
  }, []);

  return messageItems;
};

// Add this utility function
export const triggerMessageUpdate = () => {
  window.dispatchEvent(new Event("updateMessages"));
};
