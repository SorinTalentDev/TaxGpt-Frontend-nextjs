"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const gotoadmin = () =>{
        if(username === 'admin' && password === '123123123'){
            sessionStorage.setItem('isAuthenticated', 'true');
            router.push('/admin/dashboard');
        } else{
            console.log(username);
            console.log(password);
            alert('Wrong!');
            return;
        }
    }

    const gotoback = () => {
        router.push('/');
    }

    return(
        <div className="w-full m-0 p-0 h-screen bg-bg-main">
            <div className="w-full m-0 p-5 bg-white flex justify-between items-center shadow-lg">
                <div className="flex items-center">
                    <Image src="/image/footer-logo.png" alt="logo" width={30} height={30} />
                    <p className="font-Ambit font-semibold text-xl text-center ml-3">BotBuzz-Admin</p>
                </div>
                <div>
                    <button className="bg-regal-blue text-white p-2 rounded-md" onClick={gotoback}>Go to Home</button>
                </div>
            </div>
            <div className="w-full m-0 p-12">
                <div className="flex text-center justify-center">
                    <p className="font-Ambit font-bold text-3xl">Login</p>
                </div>
                <div className="flex justify-center mt-6">
                    <div className="bg-white rounded-xl p-8 font-Ambit shadow-2xl">
                        <p>Username*</p>
                        <input className="bg-gray-200 h-10 rounded-lg p-2 w-60" placeholder="Enter the Username" value={username} onChange={(e) =>setUsername(e.target.value)} />
                        <p className="mt-5">Password*</p>
                        <input type="password" className="bg-gray-200 h-10 rounded-lg p-2 w-60" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="flex justify-between mt-5">
                            <button onClick={gotoback}>back</button>
                            <button className="bg-regal-blue text-white p-2 rounded-md" onClick={gotoadmin} >go to Admin</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}