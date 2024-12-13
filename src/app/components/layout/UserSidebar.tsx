import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Mark from "./Mark";
import { defaultNavItems, NavItem } from "./UserNavItems";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation"; // Import usePathname

type Props = {
  collapsed: boolean;
  navItems?: NavItem[];
  setCollapsed(collapsed: boolean): void;
  shown: boolean;
};

const Sidebar = ({
  collapsed,
  navItems = defaultNavItems,
  shown,
  setCollapsed,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected item
  const pathname = usePathname(); // Get current pathname
  const Icon = collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon;

  useEffect(() => {
    // Set selectedIndex based on the current pathname
    const selectedIndex = navItems.findIndex((item) => item.href === pathname);
    setSelectedIndex(selectedIndex !== -1 ? selectedIndex : null);
  }, [pathname, navItems]);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index); // Set the clicked item as selected
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
              // Check if the current item is selected by comparing the pathname
              const isSelected =
                pathname === item.href || selectedIndex === index;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={classNames({
                    flex: true,
                    "text-black hover:bg-regal-blue hover:text-white dark:text-white":
                      true, // colors
                    "transition-colors duration-300": true, // animation
                    "rounded-md p-2 mx-3 gap-4 ": !collapsed,
                    "rounded-full p-2 mx-3 w-10 h-10": collapsed,
                    "bg-blue-500 text-white": isSelected, // Apply background when selected
                  })}
                  onClick={() => handleItemClick(index)} // Handle click event to set the selected item
                >
                  {item.icon}
                  <span>{!collapsed && item.label}</span>
                </Link>
              );
            })}
          </ul>
        </nav>

        <div className="grid place-content-stretch p-4"></div>
      </div>
    </div>
  );
};

export default Sidebar;
