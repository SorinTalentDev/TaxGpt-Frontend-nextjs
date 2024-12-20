"use client";

import classNames from "classnames";
import React, { PropsWithChildren, useState } from "react";
import Navbar from "./UserNavbar";
import Sidebar from "./UserSidebar";

type LayoutProps = {
  clearMessages: () => void; // Accept clearMessages function as a prop
};

const Layout = ({
  clearMessages,
  children,
}: PropsWithChildren<LayoutProps>) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
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
        clearMessages={clearMessages} // Pass the function here
      />
      <div className="">
        <Navbar
          onMenuButtonClick={() => setShowSidebar((prev) => !prev)}
          clearMessages={clearMessages}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;
