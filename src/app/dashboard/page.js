"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, BellOff, FileText, Info, LogOut, MessageSquare, Moon, Search, SendHorizonal, Settings } from "lucide-react";
import Image from "next/image";
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import Link from "next/link"; 
function toggleDarkMode(){
    document.documentElement.classList.toggle('dark');
}

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);

    const [bell, setBell] = useState(true);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef(null); // Create a reference for the chat view
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const buttonRef = useRef(null);
    const handleSendMessage = async () => {
        if(!input.trim()) return;
        const sessionId = localStorage.getItem('sessionId') || uuidv4();
        localStorage.setItem('sessionId', sessionId);
        //Add user message to the message list
        setMessages([...messages , {role:"user", content:input}]);

        //Send message to backend to interact with openAI assistant
        setLoading(true);
        setInput("");
        try{
            const response = await axios.post("https://ltpoc-backend-b90752644b3c.herokuapp.com/send-message", { messages:input, sessionId: sessionId });
            let assistantMessage = response.data;

            setMessages((prev) => [...prev, {role:"assistant", content:assistantMessage}]);
        } catch (error) {
            console.error('Error occurred:', error);
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault(); // Prevents default behavior like line breaks
        handleSendMessage();
        }
    };

    const bellhandler = () => {
        setBell(!bell);
    }

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    };

    const renderMessage = (message) => {
        let link;
        console.log(message);
        console.log(message);
        // Replaces valid 【4:xx†pXX.pdf】 with Markdown links, removing consecutive duplicates
        let modifiedMessage = message.content
        .replace(/(【\d+:\d+†p(\d+)\.pdf】)(?=.*\2)/g, '')
        .replace(/【\d+:\d+†source】/g, '') // Remove consecutive duplicates
        .replace(/【\d+:\d+†p(\d+)\.pdf】/g, (match, pageNumber) => {
            link = ` [ [p${pageNumber}.pdf](https://www.irs.gov/pub/irs-pdf/p${pageNumber}.pdf) ]`;
            return link; // Return the link
        });
        return(
            <ReactMarkdown
                // children = {modifiedMessage}
                rehypePlugins = {[remarkGfm]}
                components={{
                    a:({children, href}) => (
                        <a href={href} target='_blank' rel='noopener noreferrer' className='text-regal-blue'>
                            {children}
                        </a>
                    ),
                    code({inline, className, children, ...props}){
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
                    table: ({children, ...props}) => (
                        <table className='w-full border-collapse text-center text-xs table-fixed rounded-lg' {...props}>
                            {children}
                        </table>
                    ),
                    th: ({children, ...props}) => (
                        <th className='border-black border-2 p-2 text-center' {...props}>
                           {children} 
                        </th>
                    ),
                    td:({children, ...props}) => (
                        <td className='border-black border-2 p-2 text-center' {...props}>
                            {children}
                        </td>
                    )
                }}
            >
            {modifiedMessage}
            </ReactMarkdown>
        );
    }

    // Scroll to the bottom of chat whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        if (localStorage.getItem('prompt')) {
            const prompt = localStorage.getItem('prompt');
            setInput(prompt);    
            if (buttonRef.current) {
                setTimeout(() => {
                    buttonRef.current.click();  // Trigger the click event with a slight delay
                }, 100);
            }
            localStorage.removeItem('prompt');
        }
    }, []);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }; 

    return(
        <div className="flex h-screen w-full bg-bg-main">
            <div className="bg-white overflow snap-none p-2 w-1/6 max-md:hidden dark:bg-gray-800">
                <Link href='/' className="flex items-center w-full mt-6">
                    <Image src="/image/footer-logo.png" alt="logo" width={40} height={40} />
                    <p className="font-Ambit font-semibold text-2xl ml-4 dark:text-white">BotBuzz</p>
                </Link>
                <div className="grid mt-7">
                    <a href='/dashboard' className="flex bg-regal-blue text-white w-full h-10 items-center rounded-lg p-2"> <MessageSquare /><p className="ml-6">Home</p></a>
                    <a href='/documents' className="flex bg-white text-black items-center rounded-lg p-2"><FileText /><p className="ml-6"> Documents </p></a>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white overflow p-4 shadow-xl fixed fill-available-width">
                    <div className="flex justify-between items-center">
                        <Link href='/'>
                            <p className="font-Jakarta font-bold text-3xl">ChatUI</p>
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
                            <button onClick={toggleDarkMode}><Moon className="mx-3 dark:text-black  max-md:hidden" width={15} /></button>
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
                <div className=' bg-bg-main '>
                    <div ref={scrollRef} className=' my-7 pt-24 h-112 pb-pb-8rem text-xl mx-32 overflow-y-scroll scroll-width-none scroll-smooth font-Ambit font-normal max-md:mx-4 laptop:text-sm'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                            message.role === 'user' ? 'justify-start' : 'justify-start'
                            } mb-2`}
                        >
                            {message.role === 'user' ? (
                                <div className='bg-white text-black w-full p-4 text-base rounded-xl text-right'>
                                    <React.Fragment key={index}>
                                        <div className={`message ${message.role}`}>
                                            {renderMessage(message)}
                                        </div>
                                    </React.Fragment>
                                </div>
                            ) : (
                                <div className='w-full'>
                                    <div className='flex items-center'>
                                        <Image src="/image/footer-logo.png" alt='logo' width={30} height={30} />
                                        <p className='font-semibold font-Ambit text-base text-regal-blue ml-4'>BotBuzz</p>
                                        <p className='font-Ambit font-normal text-xs text-regal-grey ml-2' >{formatDate(new Date())}</p>
                                    </div>
                                    <div className='bg-white text-black w-full p-4 text-base rounded-xl mb-6'>
                                        <React.Fragment key={index}>
                                            <div className={`message ${message.role}`}>
                                                {renderMessage(message)}
                                            </div>
                                        </React.Fragment>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {
                        loading && (
                            <button disabled type="button" className="text-black bg-none font-medium  text-sm px-5 py-2.5 text-center me-2   inline-flex items-center">
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                            </button>
                        )
                    }
                    </div>
                    <div className='fixed bottom-0 z-100 bg-bg-main w-full'>
                        <div className='flex py-9 max-md:justify-center '>
                            <input type='text' value={input} disabled={loading} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className='w-prompit-width h-10 rounded-l-lg p-3 ml-48 2xl:ml-80 max-md:ml-0 max-md:w-80' placeholder='Enter a Prompt here' />
                            <button ref={buttonRef} onClick={handleSendMessage} className='bg-white text-input-gray h-10 w-11 rounded-r-lg flex justify-center items-center ml-px' style={{ color: input ? "black" : "#ccc", }}>
                                {
                                    !loading ? (<SendHorizonal className='w-6' />) : (
                                        <svg aria-hidden="true" role="status" className="inline w-6 h-6 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                        </svg>
                                    )
                                }
                                
                            </button>
                        </div>
                        <div className='flex text-center items-center ml-64 2xl:ml-96 max-md:m-1'>
                            <p className='text-center text-xs font-Ambit text-regal-grey pb-5'>Free Research Preview Bot Buzz may produce inaccurate information about people, places, or facts. <a className='text-regal-blue'>BotBuzz Version2.0</a> </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}