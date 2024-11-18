'use client';
 

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import axios from "axios";

export default function Page(){

    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [showEmailtip, setShowEmailtip] = useState("");
    const [validEmail, setValidemail] = useState("Please enter your email");
    const [showPasswordtip, setShowPasswordtip] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [shakeText, setShakeText] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    // const { setIsLoggedIn } = useSession();
    const LoginRef = useRef(null);
    const router = useRouter();

    const handleEmailchange = (e) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmailValue(e.target.value);
        if(e.target.value === ""){
            setValidemail("Please enter your emai");
            setShowEmailtip(true);
        }
        if(!regex.test(e.target.value)){
            setValidemail("Email is not valid!");
            setShowEmailtip(true);
        }
         else{
            setShowEmailtip(false);
        }
    }

    const handlePasswordchange = (e) => {
        setPasswordValue(e.target.value);
        if(e.target.value === ""){
            setShowPasswordtip(true);
        } else {
            setShowPasswordtip(false);
        }
    }

    const handleCheckboxChange = () => {
        setShakeText(!shakeText);
        setIsChecked(!isChecked);
    }

    const handleSignin = async() => {
        try{
            setIsButtonVisible(false); 
            console.log(process.env.NEXT_PUBLIC_API_URL); // Check if the correct URL is logged
            // const response = await axios.post(`${process.env.API_URL}/users/signin`, {
            const response = await axios.post("https://ltpoc-backend-b90752644b3c.herokuapp.com/users/signin", {
                email:emailValue,
                password:passwordValue
            });
            if(response.data.success === 1){
                // setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', response.data.data._id);
                console.log(localStorage.getItem('userId'));
                router.push('/dashboard');
            } else{
                setIsButtonVisible(true);
                alert(response.data.message);
                
            }
        } catch(error){
            setIsButtonVisible(true);
            console.log(error);
        }
    }

    useEffect(() => {
        // alert(isButtonVisible);
        if (!emailValue || !passwordValue || !isChecked){
            setIsButtonVisible(false); 
        }
        else {
            setIsButtonVisible(true);
        }
    }, [emailValue, passwordValue, isChecked]);

    return(
        <div className="w-full justify-between flex">
            <div className="m-8 block  w-1/2 max-md:w-full">
                <Link href="/" className="flex items-center">
                    <div className="w-12">
                        <Image src="/image/logo.png" alt="logo" layout="responsive" width={100} height={100}/>
                    </div>
                    <div className="text-center">
                        <p className="font-Ambit font-semibold text-center ml-3 2xl:text-3xl xl:text-3xl lg:text-2xl md:text-1xl sm:text-1xl">BotBuzz</p>
                    </div>
                </Link>
                <div className="block mt-10">
                    <p className="font-Ambit font-bold text-regal-blue 2xl:text-3xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-1xl">Login</p>
                    <p className="font-Ambit font-bold text-regal-grey 2xl:text-1xl xl:text-1xl lg:text-1xl md:text-1xl sm:text-1xl ">Add your credentials to log in</p>
                </div>
                <div className="block w-2/3 mt-12 2xl:mt-16 max-md:w-full relative">
                    <p className="font-Ambit font-bold text-lg text-regal-grey">Your email*</p>
                    <input placeholder="Enter your email" value={emailValue} onChange={handleEmailchange} className="font-Ambit font-bold w-full rounded-lg border-regal-grey border-2 h-10 p-2" />
                    {
                        showEmailtip && (
                            <div className="absolute left-0 mt-1 text-xs text-red-500 bg-none w-max font-Ambit">
                                {validEmail}
                            </div>
                        )
                    }
                </div>
                <div className="block w-2/3 mt-6 2xl:mt-6 max-md:w-full relative">
                    <p className="font-Ambit font-bold text-lg text-regal-grey">Password*</p>
                    <input type="password" placeholder="Enter your password" value={passwordValue} onChange={handlePasswordchange} className="font-Ambit font-bold w-full rounded-lg border-regal-grey border-2 h-10 p-2" />
                    {
                        showPasswordtip && (
                            <div className="absolute left-0 mt-1 text-xs text-red-500 bg-none w-max font-Ambit">
                                Please enter your password
                            </div>
                        )
                    }
                </div>
                <div className="flex mt-6">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <p
                        className={`ml-2 font-Ambit text-sm font-bold transition-colors duration-300 
                        ${shakeText ? 'text-regal-grey' : 'text-red-500'}`}
                    >
                        I agree to terms & conditions
                    </p>
                </div>
                <div className="block mt-4 w-2/3 2xl:mt-6 max-md:w-full">
                    <button ref={LoginRef} 
                        className={`rounded-lg text-white font-Ambit font-bold w-full h-11 shadow-xl ${isButtonVisible ? 'bg-regal-blue' : 'bg-gray-400'}`}
                        onClick={handleSignin}
                        disabled={!isButtonVisible} 
                    >
                        Login
                    </button>
                </div>
                <div className="flex mt-4 justify-center items-center w-2/3 max-md:w-full">
                    <hr className="h-px bg-gray-200 border-0 w-1/2" />
                    <p className="font-Ambit text-gray-300 text-sm pt-1 px-2">Or</p>
                    <hr className="h-px bg-gray-200 border-0 w-1/2" />
                </div>
                <div className="block mt-10 w-2/3 max-md:w-full">
                    <Link href="/" className="flex w-full shadow-xl h-11 justify-center text-center align-middle rounded-lg items-center">
                        <div className="w-6 mr-5">
                            <Image src="/image/google.png" alt="google" layout="responsive" width={100} height={100} />
                        </div>
                        <p className="font-Ambit text-black font-bold">Login with Google</p>
                    </Link>
                </div>
                <div className="block mt-10 w-2/3 max-md:w-full">
                    <Link href="/" className="flex w-full shadow-xl h-11 justify-center text-center align-middle rounded-lg items-center">
                        <div className="w-6 mr-5">
                            <Image src="/image/linkedin.png" alt="google" layout="responsive" width={100} height={100} />
                        </div>
                        <p className="font-Ambit text-black font-bold">Login with linkdin</p>
                    </Link>
                </div>
                <div className="flex w-2/3 text-center mt-8 items-center justify-center max-md:w-full">
                    <p className="font-Ambit font-bold text-regal-grey"> Dont have an Account?</p>
                    <a href="/register" className="text-regal-blue"> Sign up</a>
                </div>
            </div>
            <div className="m-8 block w-1/2  max-md:hidden">
                <Image src="/image/robot.png" alt="robot" width={500} height={500} className="w-full"/>
            </div>
        </div>
    );
}