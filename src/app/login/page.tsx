"use client";

import Mark from "../components/layout/Mark";
import Loginsidebar from "../components/layout/LoginSidebar";
import LoginForm from "../components/layout/LoginForm";
import { useState } from "react";
import Image from "next/image";
import authImg from "./../Assets/image/authImg.png";

export default function Page() {
  const [activeTab, setActiveTab] = useState<string>("signin");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-login-color m-0 p-0 w-full h-screen overflow-y-hidden dark:bg-[#1c1c1c]">
      <div className="fixed left-6 top-8 z-10 max-md:left-0">
        <Mark />
      </div>
      <div className="pt-12 px-16 h-full max-md:px-0">
        <hr className="h-1 bg-black border-0" />
        <div className="bg-login-second-color pt-28 flex px-2 justify-left h-full items-center max-md:pt-0 dark:bg-[#1a1a1a]">
          <div className="h-full flex justify-center items-center justify-items-center ml-20 max-md:hidden">
            <Loginsidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
          <div className="inline-block w-[40%] max-md:hidden">
            {/* Updated Image Component */}
            <Image
              src={authImg}
              alt="login"
              width={400} // specify the width
              height={400} // specify the height
              className="w-full"
              layout="responsive"
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
