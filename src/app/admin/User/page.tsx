"use client";

import React from "react";
import Layout from "../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import DataTable from "../../components/userDataTable";
import axios from "axios";
import { Column } from "react-table";

interface User {
  id: number;
  userId: string;
  username: string;
  email: string;
  createDate: string;
  expiredDate: string;
}
export default function Page() {
  const [data, setData] = useState<User[]>([]);
  const columns: Column<User>[] = React.useMemo(
    () => [
      //   { Id: "id", accessor: "id" },
      { Header: "UserId", accessor: "userId" },
      { Header: "Username", accessor: "username" },
      { Header: "Email", accessor: "email" },
      { Header: "Create Date", accessor: "createDate" },
      { Header: "Expired Date", accessor: "expiredDate" },
      {
        Header: "Actions",
        Cell: ({ row }: { row: { original: User } }) => (
          <div className="flex space-x-2 items-center justify-center">
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

  const handleEdit = (row: User) => {
    alert(`Edit row: ${JSON.stringify(row)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://ltpoc-backend-b90752644b3c.herokuapp.com/users/getAlluser"
        );

        console.log(response.data);
        const transformedData =
          Array.isArray(response.data.data) &&
          response.data.data.map((user: any) => ({
            userId: user._id,
            username: user.username || "N/A",
            email: user.email || "N/A",
            createDate: user.create_date.split("T")[0],
            expiredDate: user.expired_date.split("T")[0],
          }));

        setData(transformedData || []);
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
            <h1 className="text-2xl font-bold pb-4 text-center dark:text-gray-500">
              User
            </h1>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
