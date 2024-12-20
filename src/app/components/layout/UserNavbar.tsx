import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Bell, BellOff, Info, MessageSquareDiff, Moon } from "lucide-react";
import { destroyCookie } from "nookies";
import UserProfileModal from "../modal/userprofilemodal";

type Props = {
  onMenuButtonClick(): void;
  clearMessages: () => void; // Accept clearMessages function as a prop
};

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}

const Navbar = ({ onMenuButtonClick, clearMessages }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBellActive, setIsBellActive] = useState(true);
  const [newsCount, setNewsCount] = useState(3);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileUrl, SetProfileUrl] = useState<string | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setNewsCount(3);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const parsedUserData = JSON.parse(localStorage.getItem("userdata")!);
    SetProfileUrl(parsedUserData.profile_img);
  }, []);

  useEffect(() => {
    // Check if running in the browser environment
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      setCurrentUrl(fullUrl);
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleBell = () => {
    setIsBellActive((prev) => !prev);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false); // Close the dropdown when opening the modal
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const newChathandler = () => {
    clearMessages(); // Call the function to clear messages
  };

  const gotologout = () => {
    destroyCookie(null, "authToken", { path: "/" });
    setTimeout(() => {
      window.location.href = "/login?logout=true";
    }, 100);
  };

  return (
    <nav
      className={classNames({
        "bg-white dark:bg-[#111111] text-zinc-500": true,
        "flex items-center": true,
        "w-screen md:w-full sticky z-10 px-4 shadow-sm h-[73px] top-0 ": true,
      })}
    >
      <div className="flex-grow relative group">
        {currentUrl === "http://localhost:3000/home" && (
          <button
            onClick={newChathandler}
            className="relative ml-5 items-center flex"
          >
            <MessageSquareDiff />
            {/* Tooltip */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded-md whitespace-nowrap z-50">
              <p className="text-sm">New chat</p>
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center">
        <form className="max-w-md mx-3">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none hidden">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 hidden"
              placeholder="Search"
              required
            />
          </div>
        </form>

        <button
          onClick={toggleBell}
          className="relative mx-3 hover:text-black hidden"
        >
          {isBellActive ? <Bell /> : <BellOff />}
          {newsCount > 0 && isBellActive && (
            <span className="absolute top-[-8px] right-[-5px] inline-block w-5 h-5 text-sm font-semibold text-white bg-red-500 rounded-full text-center">
              {newsCount}
            </span>
          )}
        </button>

        <button className="mx-3 hover:text-black hidden">
          <Info />
        </button>
        <button
          onClick={toggleDarkMode}
          className="mx-6 hover:text-black dark:text-white hidden"
        >
          <Moon />
        </button>
        <button onClick={toggleDropdown}>
          <img
            src={profileUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-300 mr-4"
          />
        </button>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-8 mt-32 w-48 bg-white rounded-lg shadow-lg z-50 dark:bg-[#1a1a1a]"
          >
            <button
              className="flex items-center w-full text-left px-4 py-2 rounded-lg text-black hover:bg-gray-100 dark:text-white dark:hover:bg-black"
              onClick={openProfileModal}
            >
              <span className="mx-1">Profile Settings</span>
            </button>
            <button
              className="flex items-center w-full text-left px-4 py-2 rounded-lg text-black hover:bg-gray-100 dark:text-white dark:hover:bg-black"
              onClick={gotologout}
            >
              <span className="mx-1">Logout</span>
            </button>
          </div>
        )}
      </div>
      <button className="md:hidden" onClick={onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </nav>
  );
};

export default Navbar;
