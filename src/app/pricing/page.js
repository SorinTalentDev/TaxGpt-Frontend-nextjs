'use client';

import { useEffect, useState } from 'react';
import { Bell, CircleCheck, CircleX, FileText, Info, LogOut, MessageSquare, Moon, Search, Settings, BellOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { useSession } from './../sessionContext';
import { useRouter } from "next/navigation";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const {resetSessionTimeout } = useSession();
    const [basicPlan, setBasicPlan] = useState(19);
    const [proPlan, setProPlan] = useState(49);
    const [bell, setBell] = useState(true);
    const [advanPlan, setAdvanPlan] = useState(99);
    const router = useRouter();
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
      };
    const [isMonthly, setIsMonthly] = useState(true);

    const handleToggle = (isMonthlySelected) => {
        setIsMonthly(isMonthlySelected);
        if(isMonthlySelected){
            setBasicPlan(19);
            setProPlan(49);
            setAdvanPlan(99);
        }
        else{
            setBasicPlan(182);
            setProPlan(470);
            setAdvanPlan(950);
        }
      };
    const bellhandler = () => {
        setBell(!bell);
    }
    const gotoLogout = () => {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('userId', '');
        router.push('/');
    };
    const handleUserInteraction  = () => {
        resetSessionTimeout(Date.now()); // Update last activity time
      };
    useEffect(() => {
    window.addEventListener('mousemove', handleUserInteraction );
    window.addEventListener('keydown', handleUserInteraction );

    return () => {
        window.removeEventListener('mousemove', handleUserInteraction );
        window.removeEventListener('keydown', handleUserInteraction );
    };
    });
    
    useEffect(() => {
        if(localStorage.getItem('isLoggedIn') === 'false') {
            gotoLogout();
        }
    });

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
                            <p className="font-Jakarta font-bold text-3xl">Pricing</p>
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
                                            <button href='/login' className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center w-full" onClick={gotoLogout} ><LogOut /><p className='ml-3'>Logout</p></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full m-0 p-0 bg-bg-main'>
                    <div className='w-full text-center'>
                        <p className='m-10 font-Ambit font-bold text-4xl max-md:text-2xl'>Pick a plan that`s right for you</p>
                        <p className='text-black font-Ambit font-normal text-base max-md:text-sm'>Pricing plans for businesses at every stage of growth. Try our risk-free for 14 days. No credit card required.</p>
                    </div>
                    <div className="flex rounded-md justify-center text-center mt-5" role="group">
                        {/* Monthly Button */}
                        <button
                            type="button"
                            onClick={() => handleToggle(true)}
                            className={`w-52 flex items-center justify-center font-normal text-xl p-3 
                            ${isMonthly ? 'bg-regal-blue text-white' : 'bg-white text-gray-900'} 
                            border border-gray-200 rounded-l-lg  
                             max-md:focus:bg-regal-blue max-md:focus:text-white focus:outline-none dark:bg-gray-800 
                            dark:border-gray-700 dark:hover:bg-gray-700 max-md:w-48`}
                        >
                            Monthly
                        </button>

                        {/* Yearly Button */}
                        <button
                            type="button"
                            onClick={() => handleToggle(false)}
                            className={`w-52 flex items-center justify-center font-normal text-xl p-3 
                            ${!isMonthly ? 'bg-regal-blue text-white' : 'bg-white text-gray-900'} 
                            border border-gray-200 rounded-r-lg 
                             max-md:focus:bg-regal-blue max-md:focus:text-white focus:outline-none dark:bg-gray-800 
                            dark:border-gray-700 dark:hover:bg-gray-700 max-md:w-48`}
                        >
                            Yearly
                            <span className="bg-blue-200 text-regal-blue p-1 text-xs rounded-md ml-3">
                            Save 20%
                            </span>
                        </button>
                    </div>
                    <div className='flex mt-5 mx-36 px-8 justify-around max-md:block max-md:mx-0'>
                        <div className='bg-white m-22 w-1/3 rounded-xl mx-2 hover:bg-regal-blue hover:text-white max-md:w-full max-md:my-6'>
                            <div className='p-7'>
                                <p className='font-Ambit  bg-gray-300 p-2 rounded-lg font-semibold text-sm inline-block mt-8'>BASIC</p>
                                <p className='font-Ambit font-light text-sm mt-3'>for all individuals and starts who want start with domaining.</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='font-Ambit font-bold  text-6xl'>${basicPlan}</p>
                                <p className='font-Ambit font-semibold text-sm'>Per member, per Month</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='flex font-normal text-sm items-center font-Ambit'><CircleCheck className='mr-2' /> Access to limited Features</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleCheck className='mr-2' /> 2 Document uploads</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleX className='mr-2' /> No API Credits</p>
                                <button className='w-full bg-black text-white mt-8 p-3 rounded-lg'>Start free 14-day trial</button>
                                <p className='text-center font-normal font-Ambit text-xs text-gray-400 mt-2 mb-28'>Subscribe Now</p>
                            </div>
                        </div>
                        <div className='bg-white m-22 w-1/3 rounded-xl mx-2 max-md:w-full max-md:my-6 hover:bg-regal-blue hover:text-white'>
                            <div className='p-7'>
                                <p className='font-Ambit  bg-gray-300 p-1 rounded-lg font-semibold text-sm inline-block mt-1'>Popular</p>
                                <p className='font-Ambit bg-gray-300 font-semibold text-sm table p-2 rounded-md mt-3 '>PROFESSIONAL</p>
                                <p className='font-Ambit font-light text-sm mt-3'>For professional domain names investors with a big portfolio</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='font-Ambit font-bold text-6xl'>${proPlan}</p>
                                <p className='font-Ambit font-semibold text-sm'>Per member, per Month</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='flex font-normal text-sm items-center font-Ambit'><CircleCheck className='mr-2' /> Access to limited Features</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleCheck className='mr-2' /> 5 Document uploads</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleCheck className='mr-2' /> 10K API Credits / Month</p>
                                <button className='w-full bg-black text-white mt-8 p-3 rounded-lg'>Start free 14-day trial</button>
                                <p className='text-center font-normal font-Ambit text-xs text-gray-400 mt-2 mb-28'>Subscribe Now</p>
                            </div>
                        </div>
                        <div className='bg-white m-22 w-1/3 rounded-xl mx-2 max-md:w-full max-md:my-6 hover:bg-regal-blue hover:text-white'>
                            <div className='p-7'>
                                <p className='font-Ambit  bg-gray-300 p-2 rounded-lg font-semibold text-sm inline-block mt-8'>ADVANCED</p>
                                <p className='font-Ambit font-light text-sm mt-3'>For all indiciduals and starters who want to start with domaining.</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='font-Ambit font-bold  text-6xl'>${advanPlan}</p>
                                <p className='font-Ambit font-semibold text-sm'>Per member, per Month</p>
                                <p className='border-gray-200 border-b-2 my-5'></p>
                                <p className='flex font-normal text-sm items-center font-Ambit'><CircleCheck className='mr-2' /> Access to all Features</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleCheck className='mr-2' />Unlimited document Uploads</p>
                                <p className='flex font-normal text-sm items-center font-Ambit mt-3'><CircleCheck className='mr-2' /> 30K API Credits / Month</p>
                                <button className='w-full bg-black text-white mt-8 p-3 rounded-lg'>Start free 14-day trial</button>
                                <p className='text-center font-normal font-Ambit text-xs text-gray-400 mt-2 mb-28'>Subscribe Now</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='text-center mt-9'>Payment Methods</p>
                        <div className='flex justify-center items-center h-10'>
                            <Image src="/image/card.png" alt='card' width={220} height={220} />
                            <Image src="/image/crypto.png" alt='card' width={80} height={80} className='ml-1' />
                        </div>
                        <p className='text-center mt-1 font-Ambit font-normal text-base text-regal-grey'>We accept Visa, American Express, Mastercard, Paypal and Crypto</p>
                    </div>
                </div>
            </div>
        </div>
    );
}