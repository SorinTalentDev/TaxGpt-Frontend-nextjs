"use client";

import React from "react";
import Layout from "../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import DataTable from "../../components/transactionDataTable";
import axios from "axios";
import { Column } from "react-table";

interface Transaction {
  transaction_id: string;
  userId: string;
  username: string;
  email: string;
  pay_date: string;
  amount: number;
}
export default function Page() {
  const [data, setData] = useState<Transaction[]>([]);
  const columns: Column<Transaction>[] = React.useMemo(
    () => [
      //   { Id: "id", accessor: "id" },
      { Header: "Transaction Id", accessor: "transaction_id" },
      { Header: "User Id", accessor: "userId" },
      { Header: "Username", accessor: "username" },
      { Header: "email", accessor: "email" },
      { Header: "Payment Date", accessor: "pay_date" },
      { Header: "Amount (USD)", accessor: "amount" },
      //   {
      //     Header: "Actions",
      //     Cell: ({ row }: { row: { original: Transaction } }) => (
      //       <div className="flex space-x-2 items-center justify-center">
      //         <button
      //           onClick={() => handleEdit(row.original)}
      //           className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      //         >
      //           Edit
      //         </button>
      //         <button
      //           onClick={() => handleDelete(row.original.transaction_id)}
      //           className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      //         >
      //           Delete
      //         </button>
      //       </div>
      //     ),
      //   },
    ],
    []
  );

  const handleDelete = (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (confirmDelete) {
      setData((prevData) =>
        prevData.filter((item) => item.transaction_id !== id)
      );
    }
  };

  const handleEdit = (row: Transaction) => {
    alert(`Edit row: ${JSON.stringify(row)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://ltpoc-backend-b90752644b3c.herokuapp.com/users/get_plan"
        );

        console.log(response.data);
        const transformedData =
          Array.isArray(response.data.data) &&
          response.data.data.map((transaction: any) => ({
            transaction_id: transaction.transaction_id,
            userId: transaction.userId,
            username: transaction.username,
            email: transaction.email,
            pay_date: transaction.pay_date.split("T")[0],
            amount: transaction.amount / 100 || "0",
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
              Transaction
            </h1>
            <DataTable columns={columns} data={data || []} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
