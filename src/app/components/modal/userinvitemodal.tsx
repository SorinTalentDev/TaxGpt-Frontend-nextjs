import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  dynamicContentId: string;
  dynamicContentTitle: string;
  dynamicContentSharedUserId: string;
}

const UserInviteModal: React.FC<UserInviteModalProps> = ({
  isOpen,
  onClose,
  dynamicContentId,
  dynamicContentTitle,
  dynamicContentSharedUserId,
}) => {
  const [revEmail, setRevEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!revEmail) {
      toast.error("Please enter an email.");
      return;
    }

    setLoading(true);

    try {
      // Retrieve user data from localStorage
      const userdata = localStorage.getItem("userdata");
      if (!userdata) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const { email } = JSON.parse(userdata);
      const appName = "My AI Wiz"; // Replace with your app name
      const customShareUrl = `${
        process.env.NEXT_PUBLIC_SOCIAL_URL
      }/share/${dynamicContentId}?title=${encodeURIComponent(
        dynamicContentTitle
      )}&Shared=${encodeURIComponent(dynamicContentSharedUserId)}`;
      const msg = {
        to: revEmail,
        from: "support@myaiwiz.com",
        subject: `You're Invited to ${appName}!`,
        text: `You received an invitation from ${email}. Please use the link below to access the shared workspace:\n\n${customShareUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1a73e8;">You're Invited to ${appName}!</h2>
            <p>You received an invitation from <strong>${email}</strong>. Please use the link below to access the shared workspace:</p>
            <p><a href="${customShareUrl}" style="display: inline-block; padding: 10px 15px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px;">Click Here</a></p>
            <p>If the button above does not work, copy and paste the following URL into your browser:</p>
            <p><a href="${customShareUrl}">${customShareUrl}</a></p>
            <p>Thank you,</p>
            <p>The ${appName} Team</p>
          </div> 
        `,
      };

      // Call the API to send the email
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send invite.");
      }

      toast.success("Invite sent successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the invite."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative dark:bg-[#1a1a1a]">
        <h2 className="text-lg font-bold mb-4">Invite a User</h2>
        <p className="mb-4">Enter the email to send an invitation.</p>

        <form onSubmit={handleInvite}>
          <input
            type="email"
            placeholder="Enter email..."
            value={revEmail}
            onChange={(e) => setRevEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-blue-500 dark:text-black"
            disabled={loading}
          />

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default UserInviteModal;
