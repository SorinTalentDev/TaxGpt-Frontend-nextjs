"use client";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-73px)] w-full bg-bg-main dark:bg-[#1f1f1f]">
      <div className="w-full">
        <div>
          <p className="font-Ambit font-bold text-4xl text-center mt-14 text-slate-950 dark:text-white">
            Oops.....
          </p>
          <p className="font-Ambit font-normal text-sm text-center mt-5 text-gray-600 dark:text-gray-400">
            Page not found
          </p>
          <p className="font-Ambit font-normal text-sm text-center mt-5 text-regal-grey dark:text-gray-500 px-6">
            This page doesn`t exist or was removed! We suggest you back to home
          </p>
          <div className="flex justify-center">
            <Image
              src="/image/Ilustration.png"
              alt="error"
              width={300}
              height={300}
              className="dark:opacity-80"
            />
          </div>
          <div className="flex justify-center">
            <Link
              href="/"
              className="flex bg-regal-blue text-white w-48 h-11 items-center justify-center rounded-lg dark:bg-blue-700 hover:dark:bg-blue-600"
            >
              <MoveLeft />
              <p className="ml-3">back to home</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
