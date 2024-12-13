import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { Edit2Icon, X } from "lucide-react";
import toast, { LoaderIcon } from "react-hot-toast";
import axios from "axios";

type UserProfileModalProps = {
  isOpen: boolean;
  onClose(): void;
  workspace?: {
    count: number;
    names: string[];
  };
  messageHistoryCount?: number;
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState({
    username: "Sample User",
    email: "sample.user@example.com",
    profile_img: "https://via.placeholder.com/150",
  });
  const [workspaces, setWorkspaces] = useState<
    Array<{ name: string; created_date: string }>
  >([]);
  const [activeSection, setActiveSection] = useState("general");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ref for file input
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  // Fetch user data from localStorage on mount
  useEffect(() => {
    console.log(workspaces);
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser({
        username: parsedUserData.username || "unknown User",
        email: parsedUserData.email || "sample.user@example.com",
        profile_img:
          parsedUserData.profile_img || "https://via.placeholder.com/150", // Default avatar if not available
      });
    }

    const storedWorkspaceData = localStorage.getItem("workspace");
    if (storedWorkspaceData !== null) {
      const parsedWorkspaceData = JSON.parse(storedWorkspaceData);
      const workspacesData = parsedWorkspaceData.map(
        (workspace: { name: string; created_date: string }) => ({
          name: workspace.name,
          created_date: workspace.created_date,
        })
      );
      setWorkspaces(workspacesData);
    }
  }, []);

  const toggleChangePasswordModal = () => {
    setIsChangePasswordModalOpen((prev) => !prev);
    setNewPassword(""); // Reset inputs
    setConfirmPassword("");
    setError(""); // Clear errors
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match. Please try again.");
      } else if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long.");
      } else if (parsedUserData.login_type === "gmail") {
        toast.error("You can't change your password.");
      } else {
        setError("");
        const id = parsedUserData._id;
        const password = newPassword;
        console.log(id, password);
        setPasswordLoading(true);
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/update_password`,
            { id, password }
          );
          console.log(response);
          if (response.data.success === 1) {
            toast.success("Password successfully changed!");
            localStorage.setItem(
              "userdata",
              JSON.stringify(response.data.data)
            );
            setPasswordLoading(false);
            toggleChangePasswordModal();
          } else {
            toast.error("Can't change your password.");
            setPasswordLoading(false);
          }
        } catch (error) {
          toast.error("Error during change password.");
          console.log(error);
          setPasswordLoading(false);
        }
      }
    }
  };

  const handleChangeAvatar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUploading(true);
    const file = e.target.files?.[0];
    // alert("ok!");
    if (file) {
      const data = new FormData();
      data.append("files", file);
      const storedUserData = localStorage.getItem("userdata");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        data.append("userId", parsedUserData._id);
      }
      try {
        // Send the image file to the backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/firebase/upload`, // Update with your backend endpoint
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success === 1) {
          const updatedUser = { ...user, profile_img: response.data.data };
          setUser(updatedUser);
          const parsedUserData = JSON.parse(localStorage.getItem("userdata")!); // Reparse userdata from localStorage
          parsedUserData.profile_img = response.data.data; // Update the profile_img field
          // Update the localStorage with the updated userdata
          localStorage.setItem("userdata", JSON.stringify(parsedUserData));
          console.log("response: ", response);
          toast.success("Avatar successfully updated!");
          setAvatarUploading(false);
        } else {
          toast.error("Failed to update avatar.");
          setAvatarUploading(false);
        }
      } catch (error) {
        toast.error("Error uploading avatar.");
        console.log(error);
        setAvatarUploading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Main User Profile Modal */}
        <div className="bg-white dark:bg-[#222222] rounded-lg shadow-lg w-[600px] max-w-full h-[80%] flex overflow-hidden relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-black dark:text-white py-1 px-3 rounded"
            onClick={onClose}
          >
            <X />
          </button>

          {/* Sidebar */}
          <div className="w-2/5 bg-gray-100 dark:bg-[#333333] px-4 py-8 shadow-inner flex flex-col h-full">
            <div className="flex items-center justify-items-center justify-between mb-4">
              {/* <Image
                src="/image/mark.png"
                layout="fixed"
                width={30}
                height={20}
                alt="mark"
              /> */}
              <h3 className="text-xl font-semibold text-black font-Ambit">
                Profile Settings
              </h3>
            </div>
            <ul className="flex-1 overflow-y-auto font-Ambit">
              <li className="mb-4">
                <button
                  className={classNames(
                    "w-full text-left hover:text-blue-500",
                    { "text-blue-500 font-bold": activeSection === "general" }
                  )}
                  onClick={() => setActiveSection("general")}
                >
                  General Setting
                </button>
              </li>
              <li className="mb-4">
                <button
                  className={classNames(
                    "w-full text-left hover:text-blue-500",
                    {
                      "text-blue-500 font-bold":
                        activeSection === "changePassword",
                    }
                  )}
                  onClick={() => setActiveSection("changePassword")}
                >
                  Change Password
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-3/4 px-6 py-10 flex flex-col h-full overflow-y-auto font-Ambit">
            {activeSection === "general" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">General Setting</h2>
                <div className="mb-4 flex items-center justify-center mt-10">
                  <img
                    src={user.profile_img}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border border-gray-300 mr-4"
                  />
                  <button
                    className="text-white dark:text-white bg-blue-300 mt-20 p-1 absolute border rounded-full left-[72%]"
                    onClick={handleChangeAvatar} // Trigger file input
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? <LoaderIcon /> : <Edit2Icon size={15} />}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*" // Accept only image files
                  />
                </div>
                <p className="mb-2 text-center mt-12 text-4xl">
                  {user.username}
                </p>
                <p className="mb-4 text-center mt-10">{user.email}</p>
              </div>
            )}
            {activeSection === "changePassword" && (
              <div>
                {/* <h2 className="text-xl font-semibold mb-4">Workspace</h2>
                <ul className="list-disc list-inside">
                  {workspaces.map((workspace, index) => (
                    <li key={index}>{workspace.name}</li>
                  ))}
                </ul> */}
                {/* <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={toggleChangePasswordModal}
                >
                  Change Password
                </button> */}
                <div className="flex items-center justify-center mt-10">
                  <div onClick={toggleChangePasswordModal}></div>
                  <div className="bg-white dark:bg-[#222222] p-6 w-full">
                    <h2 className="text-xl font-semibold mb-8">
                      Change Password
                    </h2>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="block w-full p-2 border border-gray-300 rounded"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="block w-full p-2 border border-gray-300 rounded"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mx-3"
                        >
                          {passwordLoading ? "Changing...." : "Save"}
                        </button>
                        {/* <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                          onClick={toggleChangePasswordModal}
                        >
                          Cancel
                        </button> */}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed" onClick={toggleChangePasswordModal}></div>
          <div className="bg-white dark:bg-[#222222] p-6 rounded-lg shadow-lg w-[400px] max-w-full">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="block w-full p-2 border border-gray-300 rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="block w-full p-2 border border-gray-300 rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mx-3"
                >
                  {passwordLoading ? "Changing...." : "Save"}
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={toggleChangePasswordModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileModal;
