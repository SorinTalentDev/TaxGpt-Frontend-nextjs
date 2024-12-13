import React from "react";

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Closes modal when clicking outside
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        <button
          className="text-gray-500 hover:text-gray-700 font-semibold float-right"
          onClick={onClose}
        >
          &times; {/* Close button */}
        </button>
        <h2 className="text-2xl font-semibold mb-4">Upload Avatar</h2>
      </div>
    </div>
  );
};

export default ProfileModal;
