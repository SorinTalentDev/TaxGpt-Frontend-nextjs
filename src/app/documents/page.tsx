"use client";

import { FolderPlus } from "lucide-react";
import React, { useState } from "react";
import CreateDocFolderModal from "../components/modal/createdocfoldermodal";

export default function Page() {
  const [docFolder, setDocFolder] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] py-4 max-md:w-screen m-auto relative dark:bg-[#232324]">
      <div className="py-5 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-bl from-blue-500 to-blue-800 bg-clip-text text-transparent leading-normal">
          Upload A Document To Be Indexed
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6 max-md:grid-cols-1 max-lg:grid-cols-2 max-[820px]:grid-cols-1 max-[1024px]:grid-cols-2 max-[1024px]:mx-auto max-[1024px]:justify-items-center max-lg:pl-0 max-md:gap-2 max-md:mx-auto max-md:justify-items-center">
        <div
          className="items-center justify-center text-center flex"
          onClick={() => setIsModalOpen(true)}
        >
          <FolderPlus size={150} absoluteStrokeWidth={true} />
        </div>
      </div>
      <CreateDocFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)}
      />
    </div>
  );
}
