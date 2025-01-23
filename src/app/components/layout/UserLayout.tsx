"use client";

import classNames from "classnames";
import React, { PropsWithChildren, useState } from "react";
import Navbar from "./UserNavbar";
import Sidebar from "./UserSidebar";
import { usePathname } from "next/navigation";

type LayoutProps = {};

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const pathname = usePathname();
  const isHomePage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" ||
    pathname === "/admin/dashboard" ||
    pathname === "/admin/documents" ||
    pathname === "/admin/User" ||
    pathname === "/admin/transaction";

  return !isHomePage ? (
    <div
      className={classNames({
        "grid bg-zinc-100 min-h-screen": true,
        "grid-cols-sidebar": !collapsed,
        "grid-cols-sidebar-collapsed": collapsed,
        "transition-[grid-template-columns] duration-300 ease-in-out": true,
      })}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
      />
      <div className="">
        <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
        {children}
      </div>
    </div>
  ) : (
    children // Directly return children when it's not the home page
  );
};

export default Layout;
