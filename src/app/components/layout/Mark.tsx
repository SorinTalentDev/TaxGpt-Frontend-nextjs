import React, { useState, useEffect } from "react";
import Image from "next/image";
import markImg from "./../../Assets/image/logo_new.png";
import darkImg from "./../../Assets/image/dark_logo.png";

const Mark = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if dark mode is enabled
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listen for changes in color scheme
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Prevent hydration mismatch by only rendering the image after mounting
  if (!isMounted) {
    return (
      <div className="bg-white flex justify-start items-center p-2 text-right dark:bg-[#111111]">
        <div className="w-48">
          <Image
            src={markImg}
            alt="logo"
            layout="responsive"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-start items-center p-2 text-right dark:bg-[#111111]">
      <div className="w-48">
        <Image
          src={isDarkMode ? darkImg : markImg}
          alt="logo"
          layout="responsive"
          width={100}
          height={100}
          objectFit="contain"
        />
      </div>
      {/* <div className="text-right items-center ml-3">
        <p className="font-black text-2xl dark:text-white">MY AI WIZ</p>
        <p className="border-indigo-700 border text-indigo-700 rounded-sm text-center text-sm inline-block px-2 tracking-widest">
          AI FOR PROS
        </p>
      </div> */}
    </div>
  );
};

export default Mark;
