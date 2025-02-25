import React, { useState } from "react";
import Link from "next/link";
import { LockKeyhole, LockKeyholeOpen, Mail } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation"; // For navigation after successful login
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import { auth } from "./../firebase/firebase"; // Firebase authentication methods
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Firebase methods
import { setCookie } from "nookies";
import ForgotPasswordModal from "../modal/forgotpassword";

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  // const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false); // State for modal visibility

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,6}$/;
    setIsEmailValid(emailPattern.test(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    // setIsPasswordValid(value.length >= 8);
  };
  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setErrorMessage("");
    if (!email || !password) {
      setIsEmailValid(email.length > 0);
      // setIsPasswordValid(password.length >= 8);
      return;
    }
    setIsLoading(true);
    console.log(process.env.NEXT_PUBLIC_BACKEND_API_URL);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/signin`,
        { email, password }
      );

      if (response.data.success === 1) {
        //Assuming response contains a token
        const { token } = response.data;
        if (response.data.data.profile_img === "") {
          response.data.data.profile_img = "/image/nouser.png";
        }
        localStorage.setItem("userdata", JSON.stringify(response.data.data));

        //set cookies with 1 hour expiration
        setCookie(null, "authToken", token, {
          maxAge: 3600, //1 hour in seconds
          path: "/",
        });
        router.push("/home");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const gmailId = user.uid;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/googleSignin`,
        { email, gmailId }
      );
      if (response.data.success === 1) {
        //Assuming response contains a token
        const { token } = response.data;
        if (response.data.data.profile_img === "") {
          response.data.data.profile_img = "/image/nouser.png";
        }
        localStorage.setItem("userdata", JSON.stringify(response.data.data));

        //set cookies with 1 hour expiration
        setCookie(null, "authToken", token, {
          maxAge: 3600, //1 hour in seconds
          path: "/",
        });
        router.push("/home");
      } else {
        toast.error("Invalid email or password. Please try again.");
        setIsGoogleLoading(false);
      }
      // Check if the user's email is already registered in Firebase
    } catch (error) {
      console.log("Google login error: ", error);
      setIsGoogleLoading(false);
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white py-[5%] w-[50%] px-[10%] max-md:w-full max-md:bg-login-second-color dark:bg-[#0a0a0a] h-[570px]">
      <p className="text-left pb-11">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-700">
          Sign Up
        </Link>
      </p>

      {/* Email Input */}
      <div className="group w-full">
        <label
          htmlFor="email"
          className="inline-block w-full text-xl font-medium text-black transition-all duration-200 ease-in-out group-focus-within:text-blue-400 dark:text-white"
        >
          E-mail
        </label>
        <div className="relative flex items-center dark:text-black">
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="peer relative h-10 w-full border rounded-md bg-gray-50 pl-4 pr-10 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400 focus:drop-shadow-lg"
            placeholder="Enter your email"
          />
          <span className="absolute right-2 transition-all duration-200 ease-in-out group-focus-within:text-blue-400">
            <Mail />
          </span>
        </div>
        {isFormSubmitted && !email && (
          <p className="text-red-500 text-sm mt-1">
            Please enter your email address.
          </p>
        )}
        {!isEmailValid && email && (
          <p className="text-red-500 text-sm mt-1">
            Please enter a valid email address.
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="group w-full pt-4 dark:text-black">
        <label
          htmlFor="password"
          className="inline-block w-full text-xl font-medium text-black transition-all duration-200 ease-in-out group-focus-within:text-blue-400 dark:text-white"
        >
          Password
        </label>
        <div className="relative flex items-center">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="peer relative h-10 w-full border rounded-md bg-gray-50 pl-4 pr-10 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400 focus:drop-shadow-lg"
            placeholder="Enter your password"
          />
          <span
            onClick={togglePasswordVisibility}
            className="material-symbols-outlined absolute right-2 cursor-pointer transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
          >
            {isPasswordVisible ? <LockKeyholeOpen /> : <LockKeyhole />}
          </span>
        </div>
        {isFormSubmitted && !password && (
          <p className="text-red-500 text-sm mt-1">
            Please enter your password.
          </p>
        )}
      </div>
      <div className="flex justify-end my-3 hidden">
        <button onClick={openForgotPasswordModal}>
          <p className="text-blue-600">Forgot password?</p>
        </button>
      </div>
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full flex text-center items-center justify-center h-12 transition-all duration-200 bg-indigo-700 text-white rounded-md mt-8 hover:bg-indigo-500"
        disabled={!isEmailValid || isLoading}
      >
        {isLoading ? <Spinner /> : "Sign In"}
      </button>

      {/* Google Login Button */}
      <div className="flex justify-center mt-5">
        {/* <button
          className="text-2xl border p-3 mx-5 rounded-lg bg-indigo-700 text-white transition-all duration-200 hover:bg-indigo-500"
          onClick={handleGoogleLogin}
        >
          <FaGoogle />
        </button> */}
        <div className="flex items-center justify-center h-12 bg-gray-100 dark:bg-gray-700 w-full">
          <button
            onClick={handleGoogleLogin}
            className="flex h-12 justify-center items-center w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:hover:text-black"
          >
            <svg
              className="h-6 w-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
              width="800px"
              height="800px"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              {" "}
              <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
              <defs> </defs>{" "}
              <g
                id="Icons"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                {" "}
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  {" "}
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </svg>
            <span>{isGoogleLoading ? <Spinner /> : "Sign In with Google"}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
      )}

      {/* Footer */}
      {/* <p className="mt-4 text-gray-300 max-md:hidden">
        Free Research Preview Bot Buzz may produce inaccurate information about
        people, places, or facts. BotBuzz Version2.0
      </p> */}
      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal onClose={closeForgotPasswordModal} />
      )}
    </div>
  );
};

export default LoginForm;
