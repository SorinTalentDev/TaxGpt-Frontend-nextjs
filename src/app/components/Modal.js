// components/Modal.js
import { useEffect, useState } from "react";
import axios from "axios";
import { CircleHelp, X } from "lucide-react";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadState, setUploadstate] = useState(0);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    source: "",
    Docdate: "",
    tag: "",
    categories: [],
  });

  const validateDate = (date) => {
    // Regex pattern to validate date in DD/MM/YYYY format
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    // Test if the date matches the pattern
    return datePattern.test(date);
  };

  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "application/pdf",
  ];
  // UseEffect with dependency array to reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      // console.log(progress);
      setFiles([]); // Reset file list
      setProgress({}); // Reset individual file progress
      setOverallProgress(0); // Reset overall progress
      setFormData({
        // Reset form data fields
        url: "",
        title: "",
        source: "",
        Docdate: "",
        tag: "",
        categories: [],
      });
    }
  }, [isOpen]); // Ensure the dependency array is always present to prevent type mismatch errors

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      allowedTypes.includes(file.type)
    );
    startUpload(droppedFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      allowedTypes.includes(file.type)
    );
    startUpload(selectedFiles);
  };

  const startUpload = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      setProgress((prevProgress) => ({ ...prevProgress, [file.name]: 0 }));
    });
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const categories = checked
        ? [...prevData.categories, value]
        : prevData.categories.filter((category) => category !== value);
      return { ...prevData, categories };
    });
  };
  const deleteFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setProgress((prevProgress) => {
      const updatedProgress = { ...prevProgress };
      delete updatedProgress[fileName];
      return updatedProgress;
    });
  };
  // Submit form data and files
  const handleSubmit = async () => {
    if (!validateDate(formData.Docdate)) {
      alert("Invalid date format. Please use DD/MM/YYYY.");
      return; // Stop form submission
    }
    const data = new FormData();
    console.log(progress);
    // Append files
    files.forEach((file) => data.append("files", file));

    // Append other form fields
    data.append("url", formData.url);
    data.append("title", formData.title);
    data.append("source", formData.source);
    data.append("Docdate", formData.Docdate);
    data.append("tag", formData.tag);
    data.append("userId", localStorage.getItem("userId"));
    // Append categories
    formData.categories.forEach((category) =>
      data.append("categories", category)
    );
    console.log(localStorage.getItem("userId"));
    setUploadstate(1);
    try {
      const response = await axios.post(
        "https://ltpoc-backend-b90752644b3c.herokuapp.com/firebase/upload",
        data,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.round((loaded * 100) / total);
            setOverallProgress(percentage); // Update progress bar
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      onClose(); // Close the modal after successful upload
      setUploadstate(0);
      toast.success("Uploaded documents successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    }
  };

  const renderFiles = () => (
    <ul className="mt-4 space-y-2">
      {files.map((file) => (
        <li
          key={file.name}
          className="text-sm text-gray-600 flex items-center justify-between"
        >
          <p>
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
          <button
            className="text-red-500 hover:text-red-700 ml-2"
            onClick={() => deleteFile(file.name)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-auto scroll-width-none">
      {uploadState === 0 ? (
        <div className="bg-white rounded-xl p-6 w-2/3 max-md:w-full relative max-h-[80vh] overflow-y-auto scroll-width-none">
          <div className="flex justify-between items-center mb-4">
            <p className="font-Ambit font-medium text-base">Upload Photos</p>
            <button className="text-black" onClick={onClose}>
              <X />
            </button>
          </div>

          <div
            id="file_upload"
            className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-gray-600">Drag & Drop your files here</p>
            <p className="text-gray-500">or</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg, .webp, .pdf"
              className="block w-full text-sm text-gray-600
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100 mt-2"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-right">
                {overallProgress.toFixed(0)}%
              </p>
              {renderFiles()}
            </div>
          )}
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-full h-px my-8 bg-gray-200 border-0" />
            <span className="absolute px-3 font-medium text-gray-200 -translate-x-1/2 bg-white left-1/2">
              or
            </span>
          </div>
          <div className="w-full mt-3">
            <p className="font-Ambit font-normal text-xs">Import from URL</p>
            <input
              name="url"
              value={formData.url}
              onChange={handleFormDataChange}
              className="w-full h-9 rounded-md bg-gray-200 text-xs p-3"
              placeholder="Add file URL"
            />
          </div>
          <div className="w-full mt-3">
            <p className="font-Ambit font-normal text-xs">Title</p>
            <input
              name="title"
              value={formData.title}
              onChange={handleFormDataChange}
              className="w-full h-9 rounded-md bg-gray-200 text-xs p-3"
              placeholder="Write a title"
            />
          </div>
          <div className="w-full mt-3">
            <p className="font-Ambit font-normal text-xs">Source</p>
            <input
              name="source"
              value={formData.source}
              onChange={handleFormDataChange}
              className="w-full h-9 rounded-md bg-gray-200 text-xs p-3"
              placeholder="Write a source"
            />
          </div>
          <div className="w-full mt-3">
            <p className="font-Ambit font-normal text-xs">Date</p>
            <input
              name="Docdate"
              value={formData.Docdate}
              onChange={handleFormDataChange}
              className="w-full h-9 rounded-md bg-gray-200 text-xs p-3"
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div className="w-full mt-3">
            <p className="font-Ambit font-normal text-xs">Tag</p>
            <input
              name="tag"
              value={formData.tag}
              onChange={handleFormDataChange}
              className="w-full h-9 rounded-md bg-gray-200 text-xs p-3"
              placeholder="Write a tag"
            />
          </div>
          <div className="inline-grid grid-cols-5 max-md:grid-cols-2 mt-7 w-full justify-between">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                value="Corporate Tax"
                onChange={handleCategoryChange}
                className="w-4 h-4"
              />
              <label className="ms-2 text-sm">Corporate Tax</label>
            </div>
            {/* Add other categories similarly */}
          </div>
          <div className="flex justify-between w-full">
            <div className="flex items-center text-gray-400 font-Ambit text-xs">
              <CircleHelp />
              <p>Help Centre</p>
            </div>
            <div className="flex items-center font-Ambit">
              <button
                className="rounded-lg h-9 px-4 text-sm mr-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-lg h-9 px-4 text-white text-sm bg-black"
                onClick={handleSubmit}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-12 h-12 border-4 border-t-white border-r-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Modal;
