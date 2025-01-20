"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "../../components/DataTable";
import axios from "axios";
import React from "react";
import { Column } from "react-table";
import { Upload } from "lucide-react";

// Define types for your document data
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

  const columns: Column<Document>[] = React.useMemo(
    () => [
      { Header: "File Name", accessor: "title" },
      { Header: "Upload Date", accessor: "uploadDate" },
      { Header: "Purpose", accessor: "purpose" },
      {
        Header: "Actions",
        Cell: ({ row }: { row: { original: Document } }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ),
      },
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
      alert("Please select a file.");
      return;
    }

    try {
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

      console.log("response: ", response.data);

      const newDocument = {
        id: Date.now(),
        title: selectedFile.name,
        uploadDate: new Date().toLocaleDateString(),
        purpose: "Uploaded via modal",
      };

      setData((prevData) => [...prevData, newDocument]);
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const Router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://ltpoc-backend-b90752644b3c.herokuapp.com/get-documents"
        );
        const transformedData = response.data.data.map((doc: any) => ({
          id: doc.id,
          title: doc.filename,
          uploadDate: new Date(doc.created_at * 1000).toLocaleDateString(),
          purpose: doc.purpose,
        }));
        setData(transformedData);
        console.log("data: ", transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const gotologout = () => {
    sessionStorage.setItem("isAuthenticated", "false");
    Router.push("/");
  };

  return (
    <div className="w-full h-screen m-0 p-0">
      <div className="w-full m-0 p-5 bg-white flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <Image
            src="/image/footer-logo.png"
            alt="logo"
            width={30}
            height={30}
          />
          <p className="font-Ambit font-semibold text-xl text-center ml-3">
            BotBuzz-Admin
          </p>
        </div>
        <div>
          <button
            className="bg-regal-blue text-white p-2 rounded-md"
            onClick={gotologout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 m-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Documents</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 mb-4 rounded hover:bg-green-600 flex"
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
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Upload Document</h2>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleFileUpload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Upload
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
