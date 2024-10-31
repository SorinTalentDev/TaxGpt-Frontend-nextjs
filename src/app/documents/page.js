'use client';

import { useState } from 'react';
import { Bell, FileText, Info, LogOut, MessageSquare, Moon, Search, Settings, Upload, BellOff} from "lucide-react";
import Image from "next/image";
import Modal from '../components/Modal';
import Link from "next/link"; 

export default function Page() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [bell, setBell] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
      };
      const bellhandler = () => {
        setBell(!bell);
    }
    return(
        <div className="flex h-screen w-full bg-bg-main">
            <div className="bg-white overflow snap-none p-2 w-1/6 max-md:hidden">
                <Link href='/' className="flex items-center w-full mt-6">
                    <Image src="/image/footer-logo.png" alt="logo" width={40} height={40} />
                    <p className="font-Ambit font-semibold text-2xl ml-4">BotBuzz</p>
                </Link>
                <div className="grid mt-7">
                    <a href='/dashboard' className="flex bg-white text-black w-full h-10 items-center rounded-lg p-2"> <MessageSquare /><p className="ml-6">Home</p></a>
                    <a href='/documents' className="flex bg-regal-blue text-white items-center rounded-lg p-2"><FileText /><p className="ml-6"> Documents </p></a>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white overflow p-4 shadow-xl">
                    <div className="flex justify-between items-center">
                        <Link href='/'>
                            <p className="font-Jakarta font-bold text-3xl">Documents</p>
                        </Link>
                        <div className="flex items-center text-regal-grey">
                            <input prefix={<Search />} className="text-black rounded-full bg-input-color h-10 w-52 px-6 max-md:hidden" placeholder="Search" />
                            <button onClick={bellhandler}>
                                { 
                                    bell 
                                    ? <Bell className="mx-3 max-md:hidden" width={15} /> 
                                    : <BellOff className="mx-3 max-md:hidden" width={15} />
                                }
                            </button>
                            <Moon className="mx-3  max-md:hidden" width={15} />
                            <Info className="mx-3  max-md:hidden" width={15} />
                            <div className='relative'>
                                <button onClick={toggleDropdown}>
                                    <Image src='/image/avatar.png' alt="avatar" width={48} height={48} className="rounded-full mx-5" />
                                </button>
                                {isOpen && (
                                    <div className='absolute right-0 mt-2 w-56 shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
                                        <div className='py-1 bg-white'>
                                            <a href='/setting' className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black" ><Settings /><p className='ml-3'>Profile Setting</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Bell /><p className='ml-3'>Notifications</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Moon /><p className='ml-3'>Dark Mode</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Info /><p className='ml-3'>infomation</p></a>
                                            <Link href='/login' className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center" ><LogOut /><p className='ml-3'>Logout</p></Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mt-8 px-8 scroll-my-px bg-bg-main pr-72 max-md:pr-8'>
                        <p className='font-Ambit text-base mt-5'>By you</p>
                        <div className='flex w-full justify-around mt-5 max-md:block'>
                            <div className='text-gray-400'>No data</div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className='flex justify-between items-center mt-5'>
                            <p className='font-Ambit font-semibold text-3xl block max-md:text-xl'>Saved Documents</p>
                            <button className='bg-black text-white rounded-full p-3 font-Ambit' onClick={openModal} ><p className='max-md:hidden'>Upload Documents</p><Upload className='hidden max-md:block' /></button>
                        </div>
                        <p className='font-Ambit text-base mt-5'>By you</p>
                        <div className='flex w-full justify-around mt-5 max-md:block'>
                            <div className='text-gray-400'>No data</div>
                            <div></div>
                            <div></div>
                        </div>
                        <p className='font-Ambit text-base mt-5'>By Tax Preparer</p>
                        <div className='flex w-full justify-around mt-5 max-md:block'>
                            <div className='text-gray-400'>No data</div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}