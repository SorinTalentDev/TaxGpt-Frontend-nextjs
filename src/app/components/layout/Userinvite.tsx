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
  const subject = `You're invited to: ${dynamicContentTitle}`;
  const appName = "app.myaiwiz.com";

  const sendEmail = () => {
    const plainTextBody = `
You're Invited to ${appName}!

You've been invited to join ${dynamicContentTitle}. Please use the link below to access the shared workspace:

Click Here: ${customShareUrl}

If the button above does not work, copy and paste the following URL into your browser:
${customShareUrl}

Thank you,
The ${appName} Team
    `;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        plainTextBody
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
