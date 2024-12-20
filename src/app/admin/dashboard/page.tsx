"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "../../components/DataTable";
import axios from "axios";
import React from "react";
import { Column } from "react-table"; // Import the Column type

// Define types for your document data
interface Document {
  id: number;
  title: string;
  uploadDate: string;
  purpose: string;
}

export default function Page() {
  const [data, setData] = useState<Document[]>([]); // Use the Document type for the data

  // Define the columns with proper types and ensure either accessor or Cell is used, not both
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
    // Add your custom edit logic here (e.g., open a modal with form pre-filled with row data)
  };

  const handleAdd = () => {
    const newTitle = prompt("Enter document title:");
    const newPurpose = prompt("Enter document purpose:");
    if (newTitle && newPurpose) {
      const newDocument = {
        id: Date.now(), // Use timestamp for unique ID
        title: newTitle,
        uploadDate: new Date().toLocaleDateString(),
        purpose: newPurpose,
      };
      setData((prevData) => [...prevData, newDocument]);
    }
  };

  const Router = useRouter();

  useEffect(() => {
    // const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    // if (isAuthenticated !== "true") {
    //   Router.push("/admin/login");
    // }
  }, [Router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://ltpoc-backend-b90752644b3c.herokuapp.com/get-documents"
        ); // Replace with your actual backend URL
        // Transform the response if needed (e.g., map fields for your table)
        const transformedData = response.data.data.map((doc: any) => ({
          id: doc.id,
          title: doc.filename,
          uploadDate: new Date(doc.created_at * 1000).toLocaleDateString(),
          purpose: doc.purpose,
        }));
        setData(transformedData);
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
        <div className="flex items-center max-md:hidden">
          <button className="mx-3">User</button>
          <button className="mx-3">Documents</button>
          <button className="mx-3">Settings</button>
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
      <div className="w-full bg-white p-3 hidden max-md:flex">
        <button>User</button>
        <button className="mx-3">Documents</button>
        <button className="mx-3">Payment</button>
      </div>
      <div className="w-full m-0 p-0">
        <div className="grid grid-cols-1 m-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Documents</h1>
            <button
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 py-2 mb-4 rounded hover:bg-green-600"
            >
              Add Row
            </button>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
