"use client";

import React from "react";
import Layout from "../../components/layout/AdminLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "../../components/documentsDataTable";
import axios from "axios";
import { Column } from "react-table";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

interface Document {
  id: number;
  title: string;
  uploadDate: string;
  purpose: string;
}
export default function Page() {
  const [data, setData] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const Router = useRouter();
  const columns: Column<Document>[] = React.useMemo(
    () => [
      { Header: "File Name", accessor: "title" },
      { Header: "Upload Date", accessor: "uploadDate" },
      { Header: "Purpose", accessor: "purpose" },
      // {
      //   Header: "Actions",
      //   Cell: ({ row }: { row: { original: Document } }) => (
      //     <div className="flex space-x-2 justify-center">
      //       <button
      //         onClick={() => handleEdit(row.original)}
      //         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      //       >
      //         Edit
      //       </button>
      //       <button
      //         onClick={() => handleDelete(row.original.id)}
      //         className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      //       >
      //         Delete
      //       </button>
      //     </div>
      //   ),
      // },
    ],
    []
  );

  const handleDelete = (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (confirmDelete) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (row: Document) => {
    alert(`Edit row: ${JSON.stringify(row)}`);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        "https://ltpoc-backend-b90752644b3c.herokuapp.com/upload-to-openai",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newDocument = {
        id: Date.now(),
        title: selectedFile.name,
        uploadDate: new Date().toLocaleDateString(),
        purpose: "assistants",
      };

      setData((prevData) => [...prevData, newDocument]);
      setIsUploading(false);
      setIsModalOpen(false); // Close modal
      toast.success("Uploaded documents successfully!");
    } catch (error) {
      setIsUploading(false);
      toast.error("Error uploading file");
      console.error("Error uploading file:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://ltpoc-backend-b90752644b3c.herokuapp.com/get-documents"
        );
        console.log("document response: ", response);
        const transformedData = response.data.data.data.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          // uploadDate: new Date(doc.created_at * 1000).toLocaleDateString(),
          uploadDate: doc.uploadDate,
          purpose: doc.purpose,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <div className="w-full m-0 p-0 h-[calc(100vh-73px)] dark:bg-[#1f1f1f]">
        <div className="grid grid-cols-1 p-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-500">
              Documents
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 mb-4 rounded hover:bg-green-600 flex hidden"
            >
              <Upload />
              <p className="pl-2">Upload</p>
            </button>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                Upload Document
              </h2>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
                className="border p-2 w-full mb-4 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleFileUpload}
                  disabled={isUploading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
