import React from "react";
import {
  ChatBubbleLeftRightIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};
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
