"use client";
import { Facebook, Instagram, Linkedin, SendHorizonal } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from './sessionContext';

export default function Home() {

  const {resetSessionTimeout } = useSession();
  const [prompt, setPrompt] = useState("");
  const Router = useRouter();

  const gotodashboard = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      Router.push("/dashboard");
    } else {
      Router.push("/login");
    }
  }

  const gotoPricing = () => {
    if(localStorage.getItem('isLoggedIn') === 'true') {
      Router.push('/pricing');
    } else {
      Router.push('/login');
    }
  }

  const sendhandler = (data: string) => {
    localStorage.setItem('prompt', data);
    gotodashboard();
  }
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
  })

  return (
    <div className="w-full m-0 p-0 block">
      <div className="flex justify-between m-5">
        <div className="flex">
          <Link href="/" className="w-full flex items-center h-auto">
            <Image src="/image/logo.png" alt="logo" width={500} height={500} className="w-9 h-10" />
            <p className="font-Ambit text-base font-semibold mt-2 ml-2 text-center">BotBuzz</p>
          </Link>
        </div>
        <div className="flex font-Ambit font-normal text-sm m-2 items-center max-md:hidden">
          <a href='#' className="mx-8"> About us </a>
          <a href="#" className="mx-8"> Features </a>
          <button onClick={gotoPricing} className="mx-8"> Pricing </button>
          <a href='/login' className="ml-8"> Login</a>
          /
          <a href='/register' className="">Signup</a>
        </div>
        <div className="flex">
          <button className="bg-regal-blue w-full text-white font-Ambit font-bold rounded-lg p-4" onClick={gotodashboard} >Start Research</button>
        </div>
      </div>
      <div className="w-full bg-bg-main m-0 p-16 py-48 max-md:p-2">
        <div className="w-full flex justify-center font-Ambit font-semibold items-center">
          <input placeholder="Ask a Tax or Legal Queston...." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-2/3 h-16 text-xl p-4 rounded-lg max-md:text-sm max-md:p-4 max-md:h-10 max-md:w-4/3 max-md:mt-9" />
          <button className="bg-regal-blue rounded-lg text-white w-24 ml-4 h-16  max-md:hidden" onClick={() => sendhandler(prompt)}>Ask now</button>
          <button className="hidden bg-regal-blue rounded-full ml-5 w-8 h-8 items-center justify-center mt-9 max-md:flex"><SendHorizonal className="text-white w-1/2"/></button>
        </div>
        <div className="w-full mt-10">
          <div className="flex items-center justify-center max-md:grid">
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4"  onClick={() => sendhandler("What are the rules for corporate taxations?")} >What are the rules for corporate taxations?</button>
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4 max-md:mt-5" onClick={() => sendhandler("What is the standard deduction?")} >What is the standard deduction?</button>
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4 max-md:mt-5" onClick={() => sendhandler("How Do I Pay Fewer Taxes?")} >How Do I Pay Fewer Taxes?</button>
          </div>
          <div className="flex items-center justify-center mt-10 max-md:grid max-md:mt-5">
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4" onClick={() => sendhandler("What is CTC?")}>What is CTC?</button>
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4 max-md:mt-5" onClick={() => sendhandler("When are taxes due?")}>When are taxes due?</button>
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4 max-md:mt-5" onClick={() => sendhandler("Should I do my own taxes?")}>Should I do my own taxes?</button>
            <button className="bg-white p-4 rounded-full font-Ambit font-semibold mx-4 max-md:mt-5" onClick={() => sendhandler("Can I deduct medical expenses?")}>Can I deduct medical expenses?</button>
          </div>
        </div>
      </div>
      <div className="block w-full bg-bg-second p-5">
        <div className="text-center">
          <p className="font-Ambit text-5xl font-semibold pt-7 max-md:text-3xl">Instant content Generation With AI</p>
          <p className="font-Ambit text-xl text-regal-grey m-2 max-md:text-xs">Provide Descriptions, Get Instant AI Generated Content</p>
        </div>
        <div className="flex p-5 max-md:inline-block max-md:w-full max-md:p-0">
          <div className="w-1/3 bg-white h-56 m-6 rounded-xl max-md:w-11/12 max-md:mx-auto max-md:pt-1">
            <div className="flex items-center justify-center mt-10 pb-1">
              <Image src="/image/vital_signs.png" alt="vital"  width={30} height={30} />
            </div>
            <p className="font-Ambit font-medium text-regal-grey text-center text-xl mt-3">Citation Accuracy</p>
            <div className="flex items-center justify-center mt-4">
              <button className="bg-regal-blue text-white font-Ambit rounded-lg p-4">Learn More</button>
            </div>
          </div>
          <div className="w-1/3 bg-white h-56 m-6 rounded-xl max-md:w-11/12 max-md:mx-auto max-md:pt-1">
            <div className="flex items-center justify-center mt-10 ">
              <Image src="/image/web.png" alt="web"  width={30} height={30} />
            </div>
            <p className="font-Ambit font-medium text-regal-grey text-center text-xl mt-3">Natural Language Queries</p>
            <div className="flex items-center justify-center mt-4">
              <button className="bg-regal-blue text-white font-Ambit rounded-lg p-4">Learn More</button>
            </div>
          </div>
          <div className="w-1/3 bg-white h-56 m-6 rounded-xl max-md:w-11/12 max-md:mx-auto max-md:pt-1">
            <div className="flex items-center justify-center mt-10">
              <Image src="/image/automation.png" alt="automation"  width={30} height={30} />
            </div>
            <p className="font-Ambit font-medium text-regal-grey text-center text-xl mt-3">AI-Powered Insights</p>
            <div className="flex items-center justify-center mt-4">
              <button className="bg-regal-blue text-white font-Ambit rounded-lg p-4">Learn More</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full block">
        <div className="flex w-full bg-white justify-around p-7 max-md:block max-md:text-center">
          <div className="block">
            <div className="flex justify-start text-left items-center max-md:justify-center">
              <Image src="/image/footer-logo.png" alt="footer" width={50} height={50} />
              <p className="font-Ambit font-semibold text-2xl ml-2 ">BotBuzz</p>
            </div>
            <p className="text-regal-grey mt-10">123, S Nowhere St., West Hollywood</p>
            <div className="flex justify-start mt-3 max-md:justify-center">
              <Facebook className="mr-2" />
              <Linkedin className="mx-2" />
              <Instagram className="mx-2" />
            </div>
          </div>
          <div className="block font-Ambit max-md:mt-8">
            <p className="text-2xl font-bold mb-3">Resources</p>
            <p className="text-regal-grey text-base font-normal">Help Center</p>
            <p className="text-regal-grey text-base font-normal" >Blog</p>
            <p className="text-regal-grey text-base font-normal">Pricing</p>
            <p className="text-regal-grey text-base font-normal">Contact</p>
          </div>
          <div className="block font-Ambit max-md:mt-8">
            <p className="text-2xl font-bold mb-3">Pricing</p>
            <p className="text-regal-grey text-base font-normal">Basic Pricing Plan</p>
            <p className="text-regal-grey text-base font-normal" >Plus Pricing Plan</p>
            <p className="text-regal-grey text-base font-normal">Teams Pricing Plan</p>
          </div>
          <div className="block font-Ambit max-md:mt-8">
            <p className="text-2xl font-bold mb-3">Explore</p>
            <p className="text-regal-grey text-base font-normal">AI Personalities</p>
            <p className="text-regal-grey text-base font-normal" >Bot Buzz AI</p>
          </div>
          <div className="block font-Ambit max-md:mt-8">
            <p className="text-2xl font-bold mb-3">Company</p>
            <p className="text-regal-grey text-base font-normal">About us</p>
            <p className="text-regal-grey text-base font-normal" >Privacy Policy</p>
            <p className="text-regal-grey text-base font-normal" >Teams and Conditions</p>
          </div>
          <div className="block font-Ambit max-md:mt-8">
            <p className="text-2xl font-bold mb-3">Others</p>
            <p className="text-regal-grey text-base font-normal">FAQs</p>
            <p className="text-regal-grey text-base font-normal" >Support</p>
          </div>
        </div>
        <div className="border-b-2 border-regal-grey m-2 flex"></div>
      </div>
      <div className="text-center my-5">
        <p className="font-Ambit text-xl  font-semibold text-regal-grey max-md:text-xs">Copyright © 2024 . All rights reserved</p>
      </div>
    </div>
  );
}
