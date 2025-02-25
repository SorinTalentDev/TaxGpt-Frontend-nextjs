"use client";

import { ShieldCheck } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import LoginSub from "./../../Assets/image/login_sub.png";

interface LoginSidebarProps {
  activeTab: string; // The current active tab state passed as a prop
  onTabChange: (tab: string) => void; // Callback to update the active tab
}

const LoginSidebar: React.FC<LoginSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const router = useRouter();

  const handleTabClick = (tab: string) => {
    onTabChange(tab); // Notify parent about the state change
    if (tab === "signin") {
      router.push("/login"); // Navigate to the Sign In page
    } else if (tab === "signup") {
      router.push("/signup"); // Navigate to the Sign Up page
    }
  };

  return (
    <div className="bg-white shadow-md flex flex-col w-full relative dark:bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex flex-col w-32">
        {/* <div className="grid justify-center items-center justify-items-center h-36 py-8 cursor-pointer">
          <Image
            src={LoginSub}
            layout="fixed"
            alt="sub"
            width={50}
            height={50}
          />
        </div> */}
        {/* Sign In Tab */}
        <div
          className={`grid justify-center items-center justify-items-center h-36 py-8 cursor-pointer ${
            activeTab === "signin"
              ? "text-blue-600 font-bold"
              : "text-gray-600 dark:text-white"
          }`}
          onClick={() => handleTabClick("signin")}
        >
          <ShieldCheck size={50} />
          <span className="text-lg">Sign In</span>
        </div>

        {/* Sign Up Tab */}
        <div
          className={`grid justify-center items-center justify-items-center h-36 py-8 cursor-pointer ${
            activeTab === "signup"
              ? "text-blue-600 font-bold"
              : "text-gray-600 dark:text-white"
          }`}
          onClick={() => handleTabClick("signup")}
        >
          <FaUserPlus size={50} />
          <span className="text-lg">Sign Up</span>
        </div>
      </div>

      {/* Active Border Indicator */}
      <div
        className={`absolute left-0 top-[15px] h-32 w-1 bg-blue-600 transition-transform duration-300 ${
          activeTab === "signin" ? "translate-y-0" : "translate-y-36"
        }`}
      ></div>
    </div>
  );
};

export default LoginSidebar;
