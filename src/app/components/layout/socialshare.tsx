"use client";

import { X, Copy } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  customShareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  id="facebook"
                  width="40"
                  height="40"
                >
                  <path
                    fill="#1877f2"
                    d="M40 20C40 8.954 31.046 0 20 0S0 8.954 0 20c0 9.983 7.314 18.257 16.875 19.757V25.781H11.797V20h5.078v-4.406c0 -5.012 2.986 -7.781 7.554 -7.781 2.188 0 4.477 0.391 4.477 0.391v4.922h-2.522c-2.484 0 -3.259 1.542 -3.259 3.123V20h5.547l-0.887 5.781H23.125v13.976C32.686 38.257 40 29.983 40 20"
                  />
                  <path
                    fill="#fff"
                    d="M27.785 25.781 28.672 20H23.125v-3.752c0 -1.582 0.775 -3.123 3.259 -3.123h2.522V8.203s-2.289 -0.391 -4.477 -0.391c-4.568 0 -7.554 2.769 -7.554 7.781V20H11.797v5.781h5.078v13.976a20.21 20.21 0 0 0 6.25 0V25.781Z"
                  />
                </svg>
              </Link>

              {/* Twitter */}
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  customShareUrl
                )}&text=${encodeURIComponent(customShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 40 40"
                  id="twitter"
                >
                  <g clipPath="url(#clip0_84_15697)">
                    <path
                      width="512"
                      height="512"
                      fill="#000"
                      rx="60"
                      d="M4.688 0H35.313A4.688 4.688 0 0 1 40 4.688V35.313A4.688 4.688 0 0 1 35.313 40H4.688A4.688 4.688 0 0 1 0 35.313V4.688A4.688 4.688 0 0 1 4.688 0z"
                    />
                    <path
                      fill="#fff"
                      d="M27.805 7.813h4.135L22.906 18.137 33.534 32.188H25.213l-6.518 -8.521L11.238 32.188H7.1l9.663 -11.044L6.568 7.813H15.1l5.891 7.789zm-1.451 21.9h2.291L13.855 10.157h-2.459z"
                    />
                  </g>
                </svg>
              </Link>

              {/* WhatsApp */}
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  customShareText + " " + customShareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  id="whatsapp"
                  viewBox="0 0 40 40"
                >
                  <path
                    fill="#25D366"
                    d="M20 40c11.046 0 20 -8.954 20 -20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20"
                  />
                  <path
                    fill="#FDFDFD"
                    fillRule="evenodd"
                    d="M20.659 31.128h-0.005a11.875 11.875 0 0 1 -5.683 -1.448L8.667 31.333l1.688 -6.162a11.875 11.875 0 0 1 -1.588 -5.946c0.003 -6.557 5.338 -11.892 11.892 -11.892a11.817 11.817 0 0 1 8.413 3.487 11.825 11.825 0 0 1 3.48 8.414c-0.003 6.555 -5.335 11.889 -11.892 11.892Zm-5.396 -3.601 0.361 0.214a9.867 9.867 0 0 0 5.031 1.378h0.004c5.448 0 9.883 -4.433 9.885 -9.884a9.833 9.833 0 0 0 -2.893 -6.993 9.817 9.817 0 0 0 -6.988 -2.899c-5.453 0 -9.887 4.434 -9.889 9.884 0 1.868 0.522 3.687 1.512 5.261l0.235 0.373 -0.999 3.648zm10.98 -5.732c0.208 0.1 0.347 0.168 0.408 0.268 0.074 0.124 0.074 0.719 -0.173 1.413s-1.435 1.328 -2.006 1.413c-0.512 0.077 -1.16 0.108 -1.872 -0.117a17.5 17.5 0 0 1 -1.694 -0.627c-2.786 -1.203 -4.668 -3.903 -5.024 -4.413q-0.037 -0.054 -0.053 -0.073l-0.002 -0.003c-0.158 -0.21 -1.211 -1.617 -1.211 -3.071 0 -1.369 0.672 -2.087 0.982 -2.417l0.058 -0.063a1.083 1.083 0 0 1 0.792 -0.372 12.5 12.5 0 0 1 0.637 0.011c0.172 0 0.389 -0.002 0.602 0.51 0.083 0.197 0.202 0.488 0.328 0.797 0.256 0.623 0.538 1.31 0.588 1.409 0.074 0.149 0.123 0.323 0.025 0.521l-0.042 0.085c-0.075 0.152 -0.13 0.263 -0.256 0.411q-0.075 0.087 -0.152 0.183c-0.103 0.124 -0.204 0.248 -0.293 0.338 -0.149 0.147 -0.303 0.308 -0.131 0.606 0.174 0.297 0.77 1.271 1.653 2.058a7.667 7.667 0 0 0 2.193 1.387q0.123 0.053 0.197 0.088c0.297 0.149 0.47 0.125 0.643 -0.074 0.173 -0.198 0.743 -0.867 0.942 -1.165s0.396 -0.247 0.668 -0.149c0.273 0.1 1.733 0.818 2.03 0.967z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              {/* Telegram */}
              <Link
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  customShareUrl
                )}&text=${encodeURIComponent(customShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 40 40"
                  id="telegram"
                >
                  <path
                    width="48"
                    height="48"
                    fill="#419FD9"
                    rx="24"
                    d="M20 0H20A20 20 0 0 1 40 20V20A20 20 0 0 1 20 40H20A20 20 0 0 1 0 20V20A20 20 0 0 1 20 0z"
                  />
                  <path
                    width="48"
                    height="48"
                    fill="url(#paint0_linear)"
                    rx="24"
                    d="M20 0H20A20 20 0 0 1 40 20V20A20 20 0 0 1 20 40H20A20 20 0 0 1 0 20V20A20 20 0 0 1 20 0z"
                  />
                  <path
                    fill="#fff"
                    d="M8.989 19.558q8.725 -3.879 11.635 -5.117c5.541 -2.353 6.692 -2.761 7.442 -2.775 0.165 -0.003 0.533 0.039 0.773 0.237 0.202 0.168 0.258 0.393 0.283 0.552s0.06 0.52 0.033 0.802c-0.3 3.221 -1.599 11.037 -2.26 14.645 -0.28 1.527 -0.83 2.038 -1.363 2.088 -1.158 0.108 -2.038 -0.782 -3.161 -1.533 -1.756 -1.175 -2.748 -1.907 -4.453 -3.053 -1.969 -1.325 -0.693 -2.053 0.43 -3.244 0.294 -0.311 5.398 -5.052 5.498 -5.482 0.013 -0.054 0.023 -0.255 -0.092 -0.361 -0.117 -0.106 -0.289 -0.069 -0.413 -0.041q-0.265 0.062 -8.416 5.679 -1.193 0.837 -2.163 0.817c-0.713 -0.017 -2.083 -0.412 -3.101 -0.75 -1.25 -0.414 -2.243 -0.633 -2.157 -1.338q0.068 -0.55 1.484 -1.126"
                  />
                  <defs>
                    <path
                      id="paint0_linear"
                      x1="24"
                      x2="24"
                      y2="47.644"
                      gradientUnits="userSpaceOnUse"
                      d=""
                    >
                      <stop stopColor="#2AABEE" />
                      <stop offset="1" stopColor="#229ED9" />
                    </path>
                  </defs>
                </svg>
              </Link>
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
