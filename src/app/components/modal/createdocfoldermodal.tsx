"use client";
import React, { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

interface CreateDocFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  FolderName?: string;
}

const CreateDocFolderModal: React.FC<CreateDocFolderModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  FolderName,
}) => {
  const [folderName, setFolderName] = useState(FolderName || "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName(FolderName || "");
      setSelectedFiles([]);
    }
  }, [isOpen, FolderName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName);
      onClose();
    }
  };

  const addFiles = (files: FileList) => {
    const newFiles = Array.from(files)
      .filter((file) => file.type === "application/pdf")
      .filter(
        (file) =>
          !selectedFiles.some((existingFile) => existingFile.name === file.name)
      );
    if (newFiles.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
          />
          <div
            className={`w-full mt-2 p-4 border-dashed border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <p className="text-center text-gray-500">
              Drag & drop PDF files here, or click to select files
            </p>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="application/pdf"
              multiple
              ref={fileInputRef}
            />
          </div>
          {selectedFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  {file.name}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocFolderModal;
