import React from "react";
import { DocumentCheckIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { BadgeDollarSign, Settings } from "lucide-react";
// define a NavItem prop
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};
export const defaultNavItems: NavItem[] = [
  {
    label: "User",
    href: "/admin/User",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    label: "Documents",
    href: "/admin/documents",
    icon: <DocumentCheckIcon className="w-6 h-6" />,
  },
  {
    label: "Transaction",
    href: "/admin/transaction",
    icon: <BadgeDollarSign className="w-6 h-6" />,
  },
  {
    label: "Setting",
    href: "/admin/setting",
    icon: <Settings className="w-6 h-6" />,
  },
];
