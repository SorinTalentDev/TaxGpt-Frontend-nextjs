"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout/UserLayout";
import WorkspaceModal from "../components/modal/workspacemodal";
import { CirclePlus } from "lucide-react";
import { RxAvatar } from "react-icons/rx";
import { CiClock1 } from "react-icons/ci";
// import { PiLockKeyThin } from "react-icons/pi";
import Link from "next/link";
import toast from "react-hot-toast";
import moment from "moment";

interface Workspace {
  id: string;
  name: string;
  created_date: string;
}

interface responseData {
  _id: string; // Adjust based on your MongoDB ObjectId handling (it could be ObjectId or string)
  workspaceName: string;
  created_date: string; // or Date if it's a Date object
}

export default function Page() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { _id } = JSON.parse(userdata);
      const userId = _id;
      // Call the backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/workspace/getAll`,
        { userId }
      );

      if (response.status === 200 && response.data.success === 1) {
        // Transform and update state
        const workspacesData = response.data.data.map(
          (workspace: responseData) => ({
            id: workspace._id,
            name: workspace.workspaceName,
            created_date: workspace.created_date,
          })
        );
        localStorage.setItem("workspace", JSON.stringify(workspacesData));
        setWorkspaces(workspacesData);
      } else {
        // toast.error("Can't find workspaces.");
      }
    } catch (error) {
      console.log("Error fetching workspaces:", error);
      toast.error("please check your internet connection.");
    }
  };
  // Fetch workspaces on component mount
  useEffect(() => {
    fetchWorkspaces();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleCreateWorkspace = (
    id: string,
    name: string,
    created_date: string
  ) => {
    setWorkspaces([...workspaces, { id, name, created_date }]);
    console.log("ok! workspace: ", workspaces);
  };
  const clearMessages = () => {
    // setMessages([]); // Clears the messages state
  };
  return (
    <div>
      {/* <Layout clearMessages={clearMessages}> */}
      <div className="w-full py-7 max max-md:w-screen pl-20 dark:bg-[#232324] h-[calc(100vh-73px)] max-md:pl-0 max-lg:pl-5">
        {/* Title */}
        <div>
          <p className="text-center font-Ambit text-6xl max-md:text-4xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.indigo.400),theme(colors.indigo.100),theme(colors.sky.400),theme(colors.fuchsia.400),theme(colors.sky.400),theme(colors.indigo.100),theme(colors.indigo.400))] bg-[length:200%_auto] animate-gradient">
            Work Space
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-4 gap-4 mt-6 max-md:grid-cols-1 max-lg:grid-cols-2 max-[820px]:grid-cols-1 max-[1024px]:grid-cols-2 max-[1024px]:mx-auto max-[1024px]:justify-items-center max-lg:pl-0 max-md:gap-2 max-md:mx-auto max-md:justify-items-center">
          {/* Create Space Button */}
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white blue-600 text-gray-700 dark:text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none w-64 h-32 mb-7 dark:bg-[#121212] dark:hover:bg-gray-700"
            >
              <CirclePlus className="my-4" />
              <p className="text-left my-4 mt-8">Create Space</p>
            </button>
          </div>

          {/* Dynamically Render Workspaces */}
          {workspaces
            .sort((a, b) => {
              // Compare created_date in descending order (newest first)
              return (
                new Date(b.created_date).getTime() -
                new Date(a.created_date).getTime()
              );
            })
            .map((workspace) => (
              <Link
                href={{
                  pathname: `/workspace/${workspace.id}`,
                  query: {
                    name: workspace.name,
                  },
                }}
                key={workspace.id}
                className="bg-gray-200 p-4 rounded-lg shadow-lg w-64 h-32 mb-7 dark:bg-[#2b2d30]"
              >
                <div className="flex justify-end text-4xl dark:text-white">
                  <RxAvatar />
                </div>
                <h2 className="text-lg font-bold text-gray-700 dark:text-[#c4cfe3]">
                  {workspace.name}
                </h2>
                <div className="flex text-sm justify-start items-center mt-2 dark:text-white">
                  <CiClock1 className="mx-1" />
                  <p className="mx-1">
                    {moment(workspace.created_date).local().fromNow()}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkspace}
      />
    </div>
    // </Layout>
  );
}
