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

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pathname = usePathname(); // Get current pathname
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [groupedItems, setGroupedItems] = useState<any>([]); // State to hold grouped items
  const [selectedGroup, setSelectedGroup] = useState<{
    groupBy: string;
    createdDate: string;
  } | null>(null);

  // Group response data by date ranges (today, yesterday, etc.)
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

    // Sort groups by the latest `createdDate`
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
        fetchSidebaritems(); // Refresh the sidebar items
        localStorage.setItem("refreshSidebar", "false"); // Reset the flag
      }
    }, 1000); // Run every 1 second

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Save the first item of the first group to localStorage if no selection exists
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

  const handleGroupClick = (groupBy: string, createdDate: string) => {
    setSelectedGroup({ groupBy, createdDate });
    handlesetMessages(groupBy, createdDate); // Keep your original function call here
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
    }
  }, []);

  // Handle item click
  const handleItemClick = (index: number) => {
    if (index === 0) {
      alert("ok!");
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
    setSelectedIndex(index);
  };

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

        <nav className="flex-grow">
          <ul className="my-2 flex flex-col gap-2 items-stretch">
            {navItems.map((item, index) => {
              const isSelected =
                pathname === item.href || selectedIndex === index;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white":
                      true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    "bg-blue-500 text-white": isSelected,
                  })}
                  onClick={() => handleItemClick(index)}
                >
                  {item.icon}
                  <span>{!collapsed && item.label}</span>
                </Link>
              );
            })}
          </ul>

          <hr className="mb-3" />
          {!collapsed && currentUrl === "https://app.myaiwiz.com/home" && (
            <div className="scrollbar-track-black overflow-y-auto h-[calc(100vh-280px)]">
              {Object.keys(groupedItems).map((groupKey) => (
                <div key={groupKey}>
                  <h3 className="font-bold text-lg mx-5">
                    {
                      groupedItems[groupKey].length > 0 &&
                        groupKey
                          .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
                          .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                    }
                  </h3>
                  {groupedItems[groupKey].map((group: any) => (
                    <div key={group.createdDate}>
                      {group.groups.map((item: any, index: number) => {
                        // Determine if this item should be selected based on `selectedGroup`
                        const isSelected =
                          (index === 0 && !selectedGroup) || // Select the first item by default
                          (selectedGroup?.groupBy === item.groupBy &&
                            selectedGroup?.createdDate === group.createdDate);

                        return (
                          <div
                            key={item.groupBy}
                            onClick={() => {
                              // Update `selectedGroup` on click
                              handleGroupClick(item.groupBy, group.createdDate);
                              localStorage.setItem(
                                "selectedGroup",
                                JSON.stringify({
                                  groupBy: item.groupBy,
                                  createdDate: group.createdDate,
                                })
                              );
                            }}
                            className={`p-2 mx-3 rounded-xl my-1 ${
                              isSelected
                                ? "bg-slate-600 text-white"
                                : "hover:bg-slate-600 hover:text-white"
                            }`}
                          >
                            <p className="font-medium">{item.groupBy}</p>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
