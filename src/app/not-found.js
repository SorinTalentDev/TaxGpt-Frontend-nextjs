'use client';
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 

export default function NotFound() {
    return(
        <div className="flex h-screen w-full bg-bg-main">
            <div className="bg-white overflow snap-none p-2 w-1/6 max-md:hidden">
                <div className="flex items-center w-full mt-6">
                    <Image src="/image/footer-logo.png" alt="logo" width={40} height={40} />
                    <p className="font-Ambit font-semibold text-2xl ml-4">BotBuzz</p>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white overflow p-8 shadow-xl">
                </div>
                <div>
                    <p className="font-Ambit font-bold text-4xl text-center mt-14 text-slate-950">Oops.....</p>
                    <p className="font-Ambit font-normal text-sm text-center mt-5">Page not found</p>
                    <p className="font-Ambit font-normal text-sm text-center mt-5 text-regal-grey px-6">This page doesn`t exist or was removed! We suggest you back to home</p>
                    <div className="flex justify-center">
                        <Image src="/image/Ilustration.png" alt="error" width={300} height={300} />
                    </div>
                    <div className="flex justify-center">
                        <Link href="/" className="flex bg-regal-blue text-white w-48 h-11 items-center justify-center rounded-lg"><MoveLeft /> <p className="ml-3">back to home</p> </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}