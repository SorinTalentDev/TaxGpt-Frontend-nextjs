'use client';

import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, ExternalLink, FileText, Info, LogOut, MessageSquare, Moon, Search, Settings, Upload, BellOff } from "lucide-react";
import Image from "next/image";
import Modal from '../components/Modal';
import ProfileModal from '../components/ProfileModal';
import Link from "next/link"; 
import { useSession } from './../sessionContext';
import { useRouter } from "next/navigation";
import remarkGfm from 'remark-gfm';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import axios from 'axios';

export default function Page() {
    const router = useRouter();
    const {resetSessionTimeout } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);
    const [bell, setBell] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [threadMessages, setThreadMessages] = useState({});

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
      };
    const bellhandler = () => {
        setBell(!bell);
    }
    const handleUserInteraction  = () => {
        resetSessionTimeout(Date.now()); // Update last activity time
    };
    
    const gotoLogout = () => {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('userId', '');
        router.push('/');
    };

    // Corrected getThreadId function
    const getThreadId = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found in localStorage.");
            return;
        }
    
        try {
            console.log("Fetching thread IDs...");
            const response = await axios.post("https://ltpoc-backend-b90752644b3c.herokuapp.com/thread/get", { userId });
    
            if (response?.data?.data?.length > 0) {
                const threads = response.data.data;
                const groupedMessages = {};
    
                for (const thread of threads) {
                    const threadId = thread.threadId;
                    console.log("Processing thread ID:", threadId);
    
                    try {
                        const messageHistoryResponse = await axios.post("https://ltpoc-backend-b90752644b3c.herokuapp.com/read-messageHistory", { threadId });
                        console.log('start');
                        console.log(messageHistoryResponse);
                        console.log('end');
                        if (messageHistoryResponse?.data?.message) {
                            console.log(`Message history for thread ID ${threadId}:`, messageHistoryResponse.data.message);
    
                            // Save messages for the current threadId
                            groupedMessages[threadId] = messageHistoryResponse.data.message;
                        } else {
                            console.warn(`No message history found for thread ID ${threadId}.`);
                        }
                    } catch (error) {
                        console.error(`Error fetching message history for thread ID ${threadId}:`, error);
                    }
                }
    
                setThreadMessages(groupedMessages); // Update state with grouped messages
                console.log("Finished fetching message history for all threads.");
            } else {
                console.warn("No threads found for this user.");
            }
        } catch (error) {
            console.error("Error fetching thread IDs:", error);
        }
    };
    
    const renderMessage = (message) => {
        console.log(message);
    
        // Replace valid 【4:xx†pXX.pdf】 with Markdown links, removing consecutive duplicates
        const modifiedMessage = message.content
            .replace(/(【\d+:\d+†p\w+\.pdf】)(?=.*\1)/g, '') // Remove consecutive duplicates
            .replace(/【\d+:\d+†source】/g, '') // Remove specific source markers
            .replace(/【\d+:\d+†(p\w+)\.pdf】/g, (match, fileName) => {
                return `[ [${fileName}.pdf](https://www.irs.gov/pub/irs-pdf/${fileName}.pdf) ]`;
            });
    
        return (
            <ReactMarkdown
                rehypePlugins={[remarkGfm]}
                components={{
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-regal-blue"
                        >
                            {children}
                        </a>
                    ),
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={coy}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    table: ({ children, ...props }) => (
                        <table
                            className="w-full border-collapse text-center text-xs table-fixed rounded-lg"
                            {...props}
                        >
                            {children}
                        </table>
                    ),
                    th: ({ children, ...props }) => (
                        <th
                            className="border-black border-2 p-2 text-center"
                            {...props}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }) => (
                        <td
                            className="border-black border-2 p-2 text-center"
                            {...props}
                        >
                            {children}
                        </td>
                    ),
                    ul: ({ children, ...props }) => (
                        <ul className="list-disc pl-5" {...props}>
                            {children}
                        </ul>
                    ),
                    li: ({ children, ...props }) => (
                        <li className="mb-1" {...props}>
                            {children}
                        </li>
                    ),
                }}
            >
                {modifiedMessage}
            </ReactMarkdown>
        );
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
    useEffect(() => {
        getThreadId();
    }, []);
    return(
        <div className="flex h-screen w-full bg-bg-main">
            <div className="bg-white overflow snap-none p-2 w-1/6 max-md:hidden">
                <Link href='/' className="flex items-center w-full mt-6">
                    <Image src="/image/footer-logo.png" alt="logo" width={40} height={40} />
                    <p className="font-Ambit font-semibold text-2xl ml-4">BotBuzz</p>
                </Link>
                <div className="grid mt-7">
                    <a href='/dashboard' className="flex bg-regal-blue text-white w-full h-10 items-center rounded-lg p-2"> <MessageSquare /><p className="ml-6">Home</p></a>
                    <a href='/documents' className="flex bg-white text-black items-center rounded-lg p-2"><FileText /><p className="ml-6"> Documents </p></a>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white overflow p-4 shadow-xl">
                    <div className="flex justify-between items-center">
                        <Link href='/'>
                            <p className="font-Jakarta font-bold text-3xl">Setting</p>
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
                                    <Image src='https://firebasestorage.googleapis.com/v0/b/myaiwiz-storage.firebasestorage.app/o/uploads%2FElipse%205.png?alt=media&token=003b4bdc-e982-4bb7-8d5f-03c9f7d88236' alt="avatar" width={48} height={48} className="rounded-full mx-5" />
                                </button>
                                {isOpen && (
                                    <div className='absolute right-0 mt-2 w-56 shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
                                        <div className='py-1 bg-white'>
                                            <a href='#' className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black" ><Settings /><p className='ml-3'>Profile Setting</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Bell /><p className='ml-3'>Notifications</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Moon /><p className='ml-3'>Dark Mode</p></a>
                                            <a href='#' className="hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center border-b-2 border-black max-md:flex" ><Info /><p className='ml-3'>infomation</p></a>
                                            <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center w-full" onClick={gotoLogout} ><LogOut /><p className='ml-3'>Logout</p></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='mt-8 px-8 scroll-my-px bg-bg-main'>
                        <div>
                            <p className='font-Ambit font-semibold text-3xl max-md:text-xl'>Profile</p>
                        </div>
                        <div className='flex bg-white w-full justify-between mt-5 p-4 rounded-2xl items-center'>
                            <p className='font-Ambit font-semibold text-2xl max-md:text-xl'>Profile Photo</p>
                            <button onClick={openProfileModal}><Image src='https://firebasestorage.googleapis.com/v0/b/myaiwiz-storage.firebasestorage.app/o/uploads%2FElipse%205.png?alt=media&token=003b4bdc-e982-4bb7-8d5f-03c9f7d88236' alt="avatar" width={48} height={48} className="rounded-full mx-5 cursor-pointer" /></button>
                        </div>
                        <div className='flex bg-white w-full justify-between mt-5 p-4 rounded-2xl items-center'>
                            <p className='font-Ambit font-semibold text-2xl max-md:text-xl'>Account Settings</p>
                            <button className='flex text-regal-grey w-36 justify-between border-regal-grey border-2 p-2 rounded-xl'><p>Select</p><ChevronDown /></button>
                        </div>
                        <p className='font-Ambit font-semibold text-3xl mt-5 max-md:text-xl'>History</p>
                        <div>
                            {Object.keys(threadMessages).length > 0 ? (
                                Object.entries(threadMessages).map(([threadId, messages]) => (
                                <div key={threadId} className='w-full bg-white mt-5 p-3 rounded-lg font-Ambit font-normal'>
                                    {/* <p className="font-bold text-lg mb-2">Thread ID: {threadId}</p> */}
                                    {messages.length > 0 ? (
                                    // Reverse the messages for display without modifying the original array
                                    [...messages].reverse().map((message, index) => (
                                        <div
                                        key={index}
                                        className={message.role === 'user' ? 'text-black' : 'text-gray-500'}
                                        >
                                            <React.Fragment key={index}>
                                                {renderMessage(message)}
                                            </React.Fragment>
                                        </div>
                                    ))
                                    ) : (
                                    <p className="text-gray-400">No messages</p>
                                    )}
                                </div>
                                ))
                            ) : (
                                <div className="w-full bg-white mt-5 p-3 rounded-lg text-gray-400">No messages</div>
                            )}
                        </div>
                        <div className='w-full flex justify-between items-center  mt-5'>
                            <p className='font-Ambit font-semibold text-3xl max-md:text-xl'>Saved Documents</p>
                            <button className='bg-black text-white rounded-full p-3 font-Ambit' onClick={openModal} ><p className='max-md:hidden'>Upload Documents</p><Upload className='hidden max-md:block' /></button>
                        </div>
                        <p className='font-Ambit text-base mt-5'>By you</p>
                        <div className='flex w-full justify-around pr-64 mt-5'>
                            <div className='text-gray-400'>No data</div>
                            <div></div>
                            <div></div>
                        </div>
                        <p className='font-Ambit text-base mt-5'>By Tax</p>
                        <div className='flex w-full justify-around pr-64 mt-5'>
                            <div className='text-gray-400'>No data</div>
                            <div></div>
                            <div></div>
                        </div>
                        <p className='font-Ambit font-semibold text-3xl mt-5 block max-md:text-xl'>Subscription</p>
                        <div className='flex w-full bg-white justify-between items-center p-3 mt-5 mb-5 rounded-xl'>
                            <div>
                                <p className='font-Ambit font-semibold text-base'>Basic Plan</p>
                                <p className='font-Ambit font-normal text-regal-grey'>auto renewal:02/18</p>
                            </div>
                            <div>
                                <a href='/pricing' className='flex text-regal-grey items-center justify-between w-48  border-regal-grey border-2 p-2 rounded-md'><p>Upgrade</p><ExternalLink /></a>
                            </div>
                        </div>
                        <p className='text-center text-regal-grey pb-6 font-Ambit max-md:text-sm'>Free Research Preview. Bot Buzz may Produce inaccurate information about people, places, or facts.<a className='text-regal-blue font-Ambit'>ButBuzz Version2.0</a></p>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
        </div>
    );
}