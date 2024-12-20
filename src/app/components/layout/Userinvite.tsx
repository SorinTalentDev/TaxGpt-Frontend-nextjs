"use client";

import { UserPlus } from "lucide-react";
import React from "react";

interface EmailShareProps {
  dynamicContentId: string; // The dynamic content ID
  dynamicContentTitle: string; // The dynamic content title
  dynamicContentSharedUserId: string; // The dynamic content shared user ID
}

const EmailShare: React.FC<EmailShareProps> = ({
  dynamicContentId,
  dynamicContentTitle,
  dynamicContentSharedUserId,
}) => {
  const customShareUrl = `${
    process.env.NEXT_PUBLIC_SOCIAL_URL
  }/share/${dynamicContentId}?title=${encodeURIComponent(
    dynamicContentTitle
  )}&Shared=${encodeURIComponent(dynamicContentSharedUserId)}`;
  const subject = `You're invited from: ${dynamicContentTitle}`;
  const appName = "app.myaiwiz.com";

  const sendEmail = () => {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007BFF;">You're Invited!</h2>
        <p>
          You've been invited to <strong>${appName}</strong>. Click the link below to accept the invitation:
        </p>
        <a
          href="${customShareUrl}"
          style="background-color: #20b8cd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;"
        >
          Click Here
        </a>
        <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
        <p>${customShareUrl}</p>
      </div>
    `;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        htmlBody
      )}`
    );
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Email Share Button */}
      <button
        onClick={sendEmail}
        className="flex items-center mx-5 text-[#20b8cd] max-md:mx-0"
      >
        <UserPlus />
        <p className="text-lg mx-2 max-md:mx-0 max-md:ml-2">Invite</p>
      </button>
    </div>
  );
};

export default EmailShare;
