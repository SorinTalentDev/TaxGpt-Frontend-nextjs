"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import DataTable from '../../components/DataTable';

export default function Page() {
    const columns = [
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'name',
        },
        {
            id: 'password',
            header: 'password',
            accessorKey: 'password',
        },
        {
            id: 'email',
            header: 'Email',
            accessorKey: 'email',
        },
        {
            id: 'membership',
            header: 'Email',
            accessorKey: 'email',
        },
    ];
    
    const data = [
        { name: 'John Doe', password: 'abc', email: 'john@example.com' },
        { name: 'Jane Smith', password: '123', email: 'jane@example.com' },
        // More data entries as needed
    ];
    const Router = useRouter();

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        if(isAuthenticated !== 'true'){
            Router.push('/admin/login');
        }
    }, [Router]);

    const gotologout = () =>{
        sessionStorage.setItem('isAuthenticated', 'false');
        Router.push('/');
    }

    return(
        <div className="w-full h-screen m-0 p-0 bg-bg-main">
            <div className="w-full m-0 p-5 bg-white flex justify-between items-center shadow-lg">
                <div className="flex items-center">
                    <Image src="/image/footer-logo.png" alt="logo" width={30} height={30} />
                    <p className="font-Ambit font-semibold text-xl text-center ml-3">BotBuzz-Admin</p>
                </div>
                <div className="flex items-center max-md:hidden">
                    <button className="mx-3">User</button>
                    <button className="mx-3">documents</button>
                    <button className="mx-3">Setting</button>
                </div>
                <div>
                    <button className="bg-regal-blue text-white p-2 rounded-md" onClick={gotologout}>Logout</button>
                </div>
            </div>
            <div className="w-full bg-white p-3 hidden max-md:flex">
                <button>User</button>
                <button className="mx-3">documents</button>
                <button className="mx-3">payment</button>
            </div>
            <div className="w-full m-0 p-0">
                <div className="grid grid-cols-1 m-8">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">User</h1>
                        <DataTable columns={columns} data={data} />
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    );
}