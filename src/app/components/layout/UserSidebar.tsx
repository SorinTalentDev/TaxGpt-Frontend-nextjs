import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Mark from "./Mark";
import { defaultNavItems, NavItem } from "./UserNavItems";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { fetchnavbaritems } from "@/app/utils/fetchnavbaritems";
import { Folders, Minus, Plus } from "lucide-react";
import { fetchWorkspacemsglist } from "@/app/utils/fetchworkspacemsglist";

// Define the props interface
type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
  clearMessages: () => void;
};

interface GroupItem {
  groupBy: string;
  latestDate: string;
}

interface GroupedData {
  today: GroupItem[];
  yesterday: GroupItem[];
  previous7Days: GroupItem[];
  previous14Days: GroupItem[];
  previous20Days: GroupItem[];
}

interface WorkspaceList {
  id: string;
  name: string;
  created_date: string;
}

interface Message {
  message: string;
}

interface WorkspaceMessageList {
  workspaceName: string;
  messages: Message[];
}

// Example message lists for each workspace
const workspaceItemMsglist = [
  ["Message 1 for Workspace 1", "Message 2 for Workspace 1"], // Messages for Workspace 1
  [
    "Message 1 for Workspace 2",
    "Message 2 for Workspace 2",
    "Message 3 for Workspace 2",
  ], // Messages for Workspace 2
];

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedworkspacelist, setSelectedworkspacelist] = useState<
    number | null
  >(-1);
  const [workspaceItemMsglists, setWorkspaceItemMsglists] = useState<
    WorkspaceMessageList[]
  >([]);
  const pathname = usePathname(); // Get current pathname
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(true);
  const [groupedItems, setGroupedItems] = useState<any>([]); // State to hold grouped items
  const [selectedGroup, setSelectedGroup] = useState<{
    groupBy: string;
    createdDate: string;
  } | null>(null);
  const [selectedMessagelist, setSelectedMessagelist] = useState<number | null>(
    null
  );
  const [workspacelist, setWorkspacelist] = useState<WorkspaceList[]>([]);
  const [workspaceitems, setWorkspaceitems] = useState<boolean[]>([]);

  const groupByDateRange = (data: any[]): GroupedData => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const yesterday = new Date(now.setDate(now.getDate() - 1))
      .toISOString()
      .split("T")[0];
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 6))
      .toISOString()
      .split("T")[0];
    const fourteenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      .toISOString()
      .split("T")[0];
    const twentyDaysAgo = new Date(now.setDate(now.getDate() - 7))
      .toISOString()
      .split("T")[0];

    // Initialize the grouped data with the correct type
    const grouped: GroupedData = {
      today: [],
      yesterday: [],
      previous7Days: [],
      previous14Days: [],
      previous20Days: [],
    };

    data.forEach((item: any) => {
      const createdDate = item.createdDate.split("T")[0]; // Use only date part (YYYY-MM-DD)
      if (createdDate === today) grouped.today.push(item);
      else if (createdDate === yesterday) grouped.yesterday.push(item);
      else if (createdDate >= sevenDaysAgo) grouped.previous7Days.push(item);
      else if (createdDate >= fourteenDaysAgo)
        grouped.previous14Days.push(item);
      else if (createdDate >= twentyDaysAgo) grouped.previous20Days.push(item);
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key as keyof GroupedData] = grouped[key as keyof GroupedData]
        .map((group: any) => {
          // Sort by latest `createdDate`
          group.groups.sort(
            (a: any, b: any) =>
              new Date(b.latestDate).getTime() -
              new Date(a.latestDate).getTime()
          );
          return group;
        })
        .reverse();
    });

    return grouped;
  };

  const fetchSidebaritems = async () => {
    const storedData = localStorage.getItem("userdata");
    let userId: string | null = null;

    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      userId = parsedData._id;
    }

    if (userId) {
      const response = await fetchnavbaritems(userId);
      console.log("response: ", response);
      // Group the data by date ranges
      const groupedData = groupByDateRange(response.data);
      setGroupedItems(groupedData); // Update the state with grouped data
    }
  };

  useEffect(() => {
    fetchSidebaritems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const refreshSidebarValue = localStorage.getItem("refreshSidebar");
      if (refreshSidebarValue === "true") {
        fetchSidebaritems();
        localStorage.setItem("refreshSidebar", "false");
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("selectedGroup")) {
      const firstGroupKey = Object.keys(groupedItems)[0];
      if (firstGroupKey && groupedItems[firstGroupKey].length > 0) {
        const firstGroup = groupedItems[firstGroupKey][0]; // First group in the first category
        const firstItem = firstGroup.groups[0]; // First item in the first group

        if (firstItem) {
          localStorage.setItem(
            "selectedGroup",
            JSON.stringify({
              groupBy: firstItem.groupBy,
              createdDate: firstGroup.createdDate,
            })
          );
        }
      }
    }
  }, [groupedItems]);

  const handlesetMessages = (items: string, date: string) => {
    localStorage.setItem("currentGroupItems", items);
    localStorage.setItem("currentDate", date);
    localStorage.setItem("ChangeSidebarState", "true");
  };

  const handleGroupClick = (
    groupBy: string,
    createdDate: string,
    uuid: number
  ) => {
    setSelectedGroup({ groupBy, createdDate });
    setSelectedMessagelist(uuid);
    // localStorage.setItem("selectedMessagelist", uuid);
    handlesetMessages(groupBy, createdDate); // Keep your original function call here
    if (window.location.pathname !== "/home") {
      window.location.href = "/home";
    }
  };

  // Handle item click
  const handleItemClick = (index: number) => {
    if (index === 0) {
      // alert("ok!");
      const firstGroupKey = Object.keys(groupedItems)[0];
      if (firstGroupKey && groupedItems[firstGroupKey].length > 0) {
        const firstGroup = groupedItems[firstGroupKey][0]; // First group in the first category
        const firstItem = firstGroup.groups[0]; // First item in the first group

        if (firstItem) {
          localStorage.setItem(
            "selectedGroup",
            JSON.stringify({
              groupBy: firstItem.groupBy,
              createdDate: firstGroup.createdDate,
            })
          );
        }
      }
    }
    // setSelectedIndex(index);
  };

  const handleworkspaceClick = (index: number) => {
    localStorage.setItem("Selectedworkspacelist", JSON.stringify(index));
    setSelectedworkspacelist(index);
  };

  // Handle workspace toggle
  const handleWorkspaceToggle = (index: number) => {
    setWorkspaceitems((prev) => {
      const newItems = [...prev];
      newItems[index] = !newItems[index]; // Toggle the specific index
      return newItems;
    });
  };

  // Set the selected index when the pathname changes
  useEffect(() => {
    const selectedIndex = navItems.findIndex((item) => item.href === pathname);
    setSelectedIndex(selectedIndex !== -1 ? selectedIndex : null);
  }, [pathname, navItems]);

  // Add current URL to state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      setCurrentUrl(fullUrl);
      if (
        fullUrl === "http://localhost:3000/workspace" ||
        fullUrl === "http://localhost:3000/home" ||
        fullUrl === "http://localhost:3000/chatHistory"
      ) {
        setSelectedworkspacelist(-1);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const storedData = localStorage.getItem("workspace");
        const parsedData: WorkspaceList[] = storedData
          ? JSON.parse(storedData)
          : [];
        setWorkspacelist(parsedData);
      }, 1000); // Runs every 1 second

      return () => clearInterval(interval); // Cleanup the interval
    }
  }, []);

  useEffect(() => {
    const storedWorkspaceId = localStorage.getItem("Selectedworkspacelist");
    if (storedWorkspaceId !== null) {
      const parsedId = parseInt(storedWorkspaceId, 10);
      localStorage.removeItem("Selectedworkspacelist");
      if (!isNaN(parsedId)) {
        setSelectedworkspacelist(parsedId);
      } else {
        setSelectedworkspacelist(null);
      }
    }
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Fetch the messages from your API
        const messages = await fetchWorkspacemsglist();

        // Log the response for debugging
        console.log("Fetched messages:", messages);

        // Ensure the response is in the correct format before setting state
        if (Array.isArray(messages)) {
          setWorkspaceItemMsglists(messages); // Set state only if data is in the correct format
        } else {
          console.error("Fetched data is not an array", messages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
    const intervalId = setInterval(loadMessages, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={classNames({
        "bg-white text-black fixed md:static md:translate-x-0 z-20 shadow-2xl dark:bg-[#111111] dark:text-white":
          true,
        "transition-all duration-300 ease-in-out": true,
        "w-[300px]": !collapsed,
        "w-16": collapsed,
        "-translate-x-full": !shown,
      })}
    >
      <div className="flex flex-col justify-between h-screen md:h-full sticky inset-0">
        {/* logo and collapse button */}
        <div
          className={classNames(
            "flex items-center border-b transition-none",
            collapsed ? "py-4 justify-center" : "p-4 justify-between"
          )}
        >
          {!collapsed && <Mark />}
          <button
            className="grid place-content-center hover:bg-regal-blue hover:text-white w-10 h-10 rounded-full opacity-0 md:opacity-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto h-[calc(100vh-116px)]">
          <ul className="my-2 flex flex-col gap-2 items-stretch">
            <Link
              key={0}
              href={navItems[0].href}
              className={classNames({
                flex: true,
                "text-black hover:bg-regal-blue hover:text-white dark:text-white":
                  true,
                "transition-colors duration-300": true,
                "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                "bg-blue-500 text-white": selectedIndex === 0,
              })}
              onClick={() => handleItemClick(0)}
            >
              {navItems[0].icon}
              <span>{!collapsed && navItems[0].label}</span>
            </Link>
            <div
              key={1}
              className={classNames({
                flex: true,
                "text-black hover:bg-regal-blue hover:text-white dark:text-white justify-between flex":
                  true,
                "transition-colors duration-300": true,
                "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                "bg-blue-500 text-white": selectedIndex === 1,
              })}
            >
              <Link
                href="/workspace"
                className="flex items-center gap-4"
                onClick={() => handleworkspaceClick(1)}
              >
                <Folders />
                <span>{!collapsed && "Workspace"}</span>
              </Link>
              {!collapsed && (
                <div onClick={() => setShowWorkspaceList(!showWorkspaceList)}>
                  {showWorkspaceList ? <Plus /> : <Minus />}
                </div>
              )}
            </div>

            {!collapsed &&
              !showWorkspaceList &&
              workspacelist.map((workspace, index: number) => {
                // Find the corresponding workspace messages from workspaceItemMsglists
                const workspaceMessages = workspaceItemMsglists.find(
                  (workspaceMsg) =>
                    workspaceMsg.workspaceName === workspace.name
                );

                return (
                  <div key={index}>
                    <div
                      className={classNames({
                        flex: true,
                        "text-black hover:bg-slate-500 hover:text-white dark:text-white justify-between":
                          true,
                        "transition-colors duration-300": true,
                        "rounded-md p-2 mr-3 ml-6 gap-4": !collapsed,
                        "bg-slate-500 text-white":
                          selectedworkspacelist === index,
                      })}
                    >
                      <Link
                        href={{
                          pathname: `/workspace/${workspace.id}`,
                          query: {
                            name: workspace.name,
                          },
                        }}
                        className="flex items-center"
                        onClick={() => handleworkspaceClick(index)}
                      >
                        <Folders className="mr-3" />
                        {workspace.name}
                      </Link>
                      <div onClick={() => handleWorkspaceToggle(index)}>
                        {workspaceitems[index] ? <Plus /> : <Minus />}
                      </div>
                    </div>

                    {!workspaceitems[index] && workspaceMessages && (
                      <div>
                        {workspaceMessages.messages.map((message, msgIndex) => (
                          <div
                            key={msgIndex}
                            className={classNames({
                              flex: true,
                              "text-black hover:bg-slate-400 hover:text-white dark:text-white justify-between my-1":
                                true,
                              "transition-colors duration-300": true,
                              "rounded-md p-2 mr-3 ml-10 gap-4": !collapsed,
                            })}
                          >
                            {message.message.length > 20
                              ? `${message.message.slice(0, 25)}...`
                              : message.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            <Link
              key={2}
              href={navItems[2].href}
              className={classNames({
                flex: true,
                "text-black hover:bg-regal-blue hover:text-white dark:text-white":
                  true,
                "transition-colors duration-300": true,
                "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                "bg-blue-500 text-white": selectedIndex === 2,
              })}
              onClick={() => handleItemClick(2)}
            >
              {navItems[2].icon}
              <span>{!collapsed && navItems[2].label}</span>
            </Link>
          </ul>

          <hr className="mb-3" />
          {!collapsed && (
            <div className="scrollbar-track-black">
              {Object.keys(groupedItems).map((groupKey) => {
                const validGroups = groupedItems[groupKey]
                  .map((group: any) => ({
                    ...group,
                    groups: group.groups.filter(
                      (item: any) => item.groupBy !== "Unknown Group"
                    ),
                  }))
                  .filter((group: any) => group.groups.length > 0);
                // Skip rendering this group if there are no valid items
                if (validGroups.length === 0) return null;
                return (
                  <div key={groupKey}>
                    <h3 className="font-bold text-lg mx-5">
                      {
                        groupKey
                          .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
                          .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                      }
                    </h3>
                    {validGroups.map((group: any) => (
                      <div key={group.createdDate}>
                        {group.groups.map((item: any, index: number) => {
                          // Determine if this item should be selected based on `selectedGroup`
                          // const isSelected =
                          //   (index === 0 && !selectedGroup) || // Select the first item by default
                          //   (selectedGroup?.groupBy === item.groupBy &&
                          //     selectedGroup?.createdDate === group.createdDate);

                          return (
                            <div
                              key={index}
                              onClick={() => {
                                handleGroupClick(
                                  item.groupBy,
                                  group.createdDate,
                                  index
                                );
                                localStorage.setItem(
                                  "selectedGroup",
                                  JSON.stringify({
                                    groupBy: item.groupBy,
                                    createdDate: group.createdDate,
                                  })
                                );
                              }}
                              className={`p-2 mx-3 rounded-xl my-1 ${
                                index === selectedMessagelist &&
                                selectedGroup?.groupBy === item.groupBy
                                  ? "bg-slate-600 text-white"
                                  : "hover:bg-slate-600 hover:text-white"
                              }
                              `}
                            >
                              <p className="font-medium">
                                {item.groupBy.length > 20
                                  ? `${item.groupBy.slice(0, 29)}...`
                                  : item.groupBy}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
