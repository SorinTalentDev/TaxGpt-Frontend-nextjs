import React from "react";
import Image from "next/image";
import markImg from "./../../Assets/image/mark.png";

const Mark = () => {
  return (
    <div className="bg-white flex justify-start items-center p-2 text-right dark:bg-[#111111]">
      <div className="w-14">
        <Image
          src={markImg}
          alt="logo"
          layout="responsive"
          width={100}
          height={100}
          objectFit="contain"
        />
      </div>
      <div className="text-right items-center ml-3">
        <p className="font-black text-2xl dark:text-white">MY AI WIZ</p>
        <p className="border-indigo-700 border text-indigo-700 rounded-sm text-center text-sm inline-block px-2 tracking-widest">
          AI FOR PROS
        </p>
      </div>
    </div>
  );
};

export default Mark;
