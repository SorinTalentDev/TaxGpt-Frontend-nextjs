"use client";

import { X, Copy } from "lucide-react";
import React, { useState } from "react";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
} from "react-share";

// Define the props to accept dynamic data
interface SocialShareProps {
  dynamicContentId: string; // The dynamic content ID
  dynamicContentTitle: string; // The dynamic content title or text
  dynamicContentSharedUserId: string; // The dynamic content shared User Id
}

const SocialShare: React.FC<SocialShareProps> = ({
  dynamicContentId,
  dynamicContentTitle,
  dynamicContentSharedUserId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const customShareUrl = `${
    process.env.NEXT_PUBLIC_SOCIAL_URL
  }/share/${dynamicContentId}?title=${encodeURIComponent(
    dynamicContentTitle
  )}&Shared=${encodeURIComponent(dynamicContentSharedUserId)}`;
  const customShareText = `Check out this Workspace: ${dynamicContentTitle}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customShareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="hover:bg-gray-400 flex p-3 ml-3 bg-gray-300 rounded-full items-center max-md:hidden dark:bg-[#1a1a1a]"
      >
        <img
          width="20"
          height="20"
          src="https://img.icons8.com/ios-glyphs/50/228BE6/share.png"
          alt="share"
        />
      </button>

      {isModalOpen && (
        <div
          role="dialog"
          aria-labelledby="share-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-[#1a1a1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="share-modal-title"
                className="font-bold text-lg text-gray-800 dark:text-white"
              >
                Share this Workspace
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 dark:text-white"
              >
                <X />
              </button>
            </div>

            <div className="flex justify-around mb-6">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  customShareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon
                  className="rounded-full hover:opacity-80"
                  size={40}
                />
              </a>

              {/* Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  customShareUrl
                )}&text=${encodeURIComponent(customShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon
                  className="rounded-full hover:opacity-80"
                  size={40}
                />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  customShareText + " " + customShareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon
                  className="rounded-full hover:opacity-80"
                  size={40}
                />
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  customShareUrl
                )}&text=${encodeURIComponent(customShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramIcon
                  className="rounded-full hover:opacity-80"
                  size={40}
                />
              </a>
            </div>

            {/* Copy Link */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <span className="truncate text-sm text-gray-700">
                {customShareUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="text-blue-600 flex items-center"
              >
                <Copy className="mr-1" size={18} />
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
