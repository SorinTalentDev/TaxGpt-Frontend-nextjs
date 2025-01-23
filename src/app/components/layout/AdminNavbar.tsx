import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
type Props = {
  /**
   * Allows the parent component to modify the state when the
   * menu button is clicked.
   */
  onMenuButtonClick(): void;
};

const Navbar = (props: Props) => {
  const router = useRouter();
  const gotologout = () => {
    router.push("/home");
  };
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500 dark:bg-[#1a1a1a]": true, // colors
        "flex items-center": true, // layout
        "w-screen md:w-full sticky z-10 px-4 shadow-sm h-[73px] top-0 ": true, //positioning & styling
      })}
    >
      <div className="font-bold text-lg dark:text-gray-500">Admin Panel</div>
      <div className="flex-grow"></div>
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>
      <div
        className="cursor-pointer dark:text-gray-500"
        onClick={() => gotologout()}
      >
        <LogOutIcon />
      </div>
    </nav>
  );
};

export default Navbar;
