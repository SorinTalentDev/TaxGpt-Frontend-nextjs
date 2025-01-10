import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Mark from "./Mark";
import {
  defaultNavItems,
  NavItem,
  useWorkspaceItems,
  useTodayMsgItems,
  useYesterdayMsgItems,
  useLast7dayMsgItems,
  useLast30dayMsgItems,
} from "./UserNavItems";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Folders, Minus, Plus } from "lucide-react";

// Define the props interface
type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
  clearMessages: () => void;
};

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedWorkspaceIndex, setSelectedWorkspaceIndex] = useState<
    number | null
  >(null);
  const pathname = usePathname(); // Get current pathname
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;
  const [showWorkspaceList, setShowWorkspaceList] = useState<boolean>(false);
  const workspaceItems = useWorkspaceItems();
  const TodayMsgItems = useTodayMsgItems();
  const YesterdayMsgItems = useYesterdayMsgItems();
  const Last7dayMsgItems = useLast7dayMsgItems();
  const Last30dayMsgItems = useLast30dayMsgItems();
  const getBaseUrl = (url: string) => {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.pathname;
  };
  // Set the selected index when the pathname changes
  useEffect(() => {
    const selectedIndex = navItems.findIndex((item) => item.href === pathname);
    const selectedWorkspaceIndex = workspaceItems.findIndex(
      (workspace) => getBaseUrl(workspace.href) === getBaseUrl(pathname)
    );
    // alert(pathname);
    setSelectedIndex(selectedIndex !== -1 ? selectedIndex : null);
    setSelectedWorkspaceIndex(
      selectedWorkspaceIndex !== -1 ? selectedWorkspaceIndex : null
    );
    // alert(workspace.href);
  }, [pathname, navItems, workspaceItems]);

  useEffect(() => {
    const Last30daysItems = localStorage.getItem("Last30dayMsgItems");
    if (Last30daysItems) {
      const parsedItems = JSON.parse(Last30daysItems);
      const Last30dayMsgItems = parsedItems;
      console.log(parsedItems); // Use the parsed items as needed
    }
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
            >
              {navItems[0].icon}
              <span>{!collapsed && navItems[0].label}</span>
            </Link>

            <div
              key={1}
              onClick={() =>
                localStorage.setItem("currentGroupItems", "New Chat")
              }
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
              <Link href="/workspace" className="flex items-center gap-4">
                <Folders />
                <span>{!collapsed && "Workspace"}</span>
              </Link>
              {!collapsed && workspaceItems.length !== 0 && (
                <div onClick={() => setShowWorkspaceList(!showWorkspaceList)}>
                  {showWorkspaceList ? <Plus /> : <Minus />}
                </div>
              )}
            </div>

            {/* Workspace items */}
            {!collapsed && !showWorkspaceList && (
              <ul className="pl-8">
                {workspaceItems.map((workspace, index) => (
                  <Link
                    key={index}
                    href={workspace.href}
                    onClick={() => {
                      setSelectedWorkspaceIndex(index);
                      localStorage.setItem("currentGroupItems", "New Chat");
                    }} // Handle selection on click
                    className={classNames({
                      flex: true,
                      "text-black hover:bg-regal-blue hover:text-white dark:text-white flex":
                        true,
                      "transition-colors duration-300": true,
                      "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                      "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                      "bg-blue-500 text-white":
                        selectedWorkspaceIndex === index,
                    })}
                  >
                    <Folders />
                    {workspace.label}
                  </Link>
                ))}
              </ul>
            )}

            <Link
              key={2}
              href={navItems[2].href}
              onClick={() =>
                localStorage.setItem("currentGroupItems", "New Chat")
              }
              className={classNames({
                flex: true,
                "text-black hover:bg-regal-blue hover:text-white dark:text-white":
                  true,
                "transition-colors duration-300": true,
                "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                "bg-blue-500 text-white": selectedIndex === 2,
              })}
            >
              {navItems[2].icon}
              <span>{!collapsed && navItems[2].label}</span>
            </Link>
          </ul>
          <hr />
          <div>
            <p className="pl-4">{TodayMsgItems.length > 0 && "Today"}</p>
            <ul className="pl-4">
              {TodayMsgItems.map((TodayMsgItem, index) => (
                <Link
                  key={index}
                  href={TodayMsgItem.href}
                  onClick={() => {
                    localStorage.setItem(
                      "currentGroupItems",
                      TodayMsgItem.label
                    );
                    localStorage.setItem(
                      "currentDate",
                      new Date(TodayMsgItem.createDate)
                        .toISOString()
                        .split("T")[0]
                    );
                    localStorage.setItem(
                      "selectedGroup",
                      JSON.stringify({
                        groupBy: TodayMsgItem.label,
                        createdDate: new Date(TodayMsgItem.createDate)
                          .toISOString()
                          .split("T")[0],
                      })
                    );
                    localStorage.setItem("ChangeSidebarState", "true");
                  }}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white flex":
                      true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    // "bg-blue-500 text-white":
                    //   selectedWorkspaceIndex === index,
                  })}
                >
                  {TodayMsgItem.label.length > 29
                    ? `${TodayMsgItem.label.slice(0, 29)}...`
                    : TodayMsgItem.label}
                </Link>
              ))}
            </ul>
            <p className="pl-4">
              {YesterdayMsgItems.length > 0 && "Yesterday"}
            </p>
            <ul className="pl-4">
              {YesterdayMsgItems.map((YesterdayMsgItem, index) => (
                <Link
                  key={index}
                  href={YesterdayMsgItem.href}
                  onClick={() => {
                    localStorage.setItem(
                      "currentGroupItems",
                      YesterdayMsgItem.label
                    );
                    localStorage.setItem(
                      "currentDate",
                      new Date(YesterdayMsgItem.createDate)
                        .toISOString()
                        .split("T")[0]
                    );
                    localStorage.setItem("ChangeSidebarState", "true");
                  }}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white flex":
                      true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    // "bg-blue-500 text-white":
                    //   selectedWorkspaceIndex === index,
                  })}
                >
                  {YesterdayMsgItem.label.length > 29
                    ? `${YesterdayMsgItem.label.slice(0, 29)}...`
                    : YesterdayMsgItem.label}
                </Link>
              ))}
            </ul>
            <p className="pl-4">
              {Last7dayMsgItems.length > 0 && "Previous 7 day"}
            </p>
            <ul className="pl-4">
              {Last7dayMsgItems.map((Last7dayMsgItem, index) => (
                <Link
                  key={index}
                  href={Last7dayMsgItem.href}
                  onClick={() => {
                    localStorage.setItem(
                      "currentGroupItems",
                      Last7dayMsgItem.label
                    );
                    localStorage.setItem(
                      "currentDate",
                      new Date(Last7dayMsgItem.createDate)
                        .toISOString()
                        .split("T")[0]
                    );
                    localStorage.setItem("ChangeSidebarState", "true");
                  }}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white flex":
                      true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    // "bg-blue-500 text-white":
                    //   selectedWorkspaceIndex === index,
                  })}
                >
                  {Last7dayMsgItem.label.length > 29
                    ? `${Last7dayMsgItem.label.slice(0, 29)}...`
                    : Last7dayMsgItem.label}
                </Link>
              ))}
            </ul>
            <p className="pl-4">
              {Last30dayMsgItems.length > 0 && "Previous 30 day"}
            </p>
            <ul className="pl-4">
              {Last30dayMsgItems.map((Last30dayMsgItem, index) => (
                <Link
                  key={index}
                  href={Last30dayMsgItem.href}
                  onClick={() => {
                    localStorage.setItem(
                      "currentGroupItems",
                      Last30dayMsgItem.label
                    );
                    localStorage.setItem(
                      "currentDate",
                      new Date(Last30dayMsgItem.createDate)
                        .toISOString()
                        .split("T")[0]
                    );
                    localStorage.setItem("ChangeSidebarState", "true");
                  }}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white flex":
                      true,
                    "transition-colors duration-300": true,
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    // "bg-blue-500 text-white":
                    //   selectedWorkspaceIndex === index,
                  })}
                >
                  {Last30dayMsgItem.label.length > 29
                    ? `${Last30dayMsgItem.label.slice(0, 29)}...`
                    : Last30dayMsgItem.label}
                </Link>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
