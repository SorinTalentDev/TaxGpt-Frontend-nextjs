import React, { use, useState } from "react";
import Link from "next/link";
import { LockKeyhole, LockKeyholeOpen, Mail } from "lucide-react";
import axios from "axios";
import Spinner from "./Spinner"; // Assuming you have a Spinner component for loading state
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Firebase methods
import toast from "react-hot-toast";
import { auth } from "./../firebase/firebase";
import VerificationModal from "../modal/verificationmodal";

const RegisterForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const [username, setUsername] = useState(""); // State for username input
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [isEmailValid, setIsEmailValid] = useState(true); // State to track email validity
  const [isPasswordValid, setIsPasswordValid] = useState(true); // State to track password validity
  const [isUsernameValid, setIsUsernameValid] = useState(true); // State to track username validity
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track if the form was submitted
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(""); // State to track error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const router = useRouter(); // For navigation after successful signup
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev); // Toggle password visibility
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsUsernameValid(e.target.value.trim().length > 0); // Check if username is not empty
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setIsEmailValid(emailPattern.test(value)); // Set validity based on regex match
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(value.length >= 8); // Password must be at least 8 characters
  };

  const handleVerificationModalClose = () => {
    setIsVerificationModalOpen(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setErrorMessage("");
    setSuccessMessage("");
    if (
      !username ||
      !email ||
      !password ||
      !isEmailValid ||
      !isPasswordValid ||
      !isUsernameValid
    ) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/signup`,
        {
          username,
          email,
          password,
          type: "mail",
          gmailId: "",
          linkedinId: "",
          profileImg: "",
          membershipId: "",
          expired_date: "",
          create_date: "",
          update_date: "",
          status: "active",
          isDelete: "0",
          verifystate: "false",
        }
      );
      if (response.data.success === 1) {
        toast.success(`Welcome, ${username}! Please login.`);
        router.push("/home");
      } else {
        toast.error("User is already registered! Please log in.");
      }
    } catch (error) {
      // Properly handle the error message
      toast.error("Error signing up with mail");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-Up Function
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      // Sign in with Google (popup)
      const result = await signInWithPopup(auth, provider);

      // Get user info
      const user = result.user;
      const userPayload = {
        username: user.displayName,
        email: user.email,
        password: "", // No password for Google users
        type: "gmail",
        gmailId: user.uid,
        linkedinId: "",
        profileImg: user.photoURL,
        membershipId: "",
        expired_date: "",
        create_date: "",
        update_date: "",
        status: "active",
        isDelete: "0",
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/googleSignup`,
        userPayload
      );
      if (response.data.success === 1) {
        setSuccessMessage("Registration successful!");
        // You can navigate the user to the login page, or keep the success message
        router.push("/login"); // Optional: Navigate to home page
        toast.success(`Welcome, ${user.displayName}! Please login.`);
        setIsGoogleLoading(false);
      } else {
        setIsGoogleLoading(false);
        setErrorMessage("User is already registered! Please log in.");
        toast.error("User is already registered! Please log in.");
      }
      // Optionally, redirect or handle post-signup actions
    } catch (error) {
      toast.error("Error signing up with Google");
      console.log(error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white py-[5%] w-[50%] px-[10%] max-md:w-full max-md:bg-login-second-color dark:bg-[#0a0a0a]">
      <p className="text-left pb-11">
        Already have an account?
        <Link href="/login" className="text-blue-700">
          Sign in
        </Link>
      </p>

      {/* Username Input */}
      <div className="group w-full">
        <label
          htmlFor="username"
          className="inline-block dark:text-white w-full text-xl font-medium text-black transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
        >
          Username
        </label>
        <div className="relative flex items-center dark:text-black">
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="peer relative h-10 w-full border rounded-md bg-gray-50 pl-4 pr-10 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400 focus:drop-shadow-lg"
            placeholder="Enter your username"
          />
        </div>
        {isFormSubmitted && !username && (
          <p className="text-red-500 text-sm mt-1">
            Please enter your username.
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="group w-full pt-4">
        <label
          htmlFor="email"
          className="inline-block dark:text-white w-full text-xl font-medium text-black transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
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
      <div className="group w-full pt-4">
        <label
          htmlFor="password"
          className="inline-block w-full text-xl dark:text-white font-medium text-black transition-all duration-200 ease-in-out group-focus-within:text-blue-400"
        >
          Password
        </label>
        <div className="relative flex items-center dark:text-black">
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
        {!isPasswordValid && password && (
          <p className="text-red-500 text-sm mt-1">
            Password must be at least 8 characters long.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full flex text-center items-center justify-center h-12 transition-all duration-200 bg-indigo-700 text-white rounded-md mt-8 hover:bg-indigo-500"
      >
        {isLoading ? <Spinner /> : "Sign Up"}
      </button>

      {/* Google and LinkedIn Buttons */}
      <div className="flex justify-center mt-5">
        {/* <button
          onClick={handleGoogleSignUp}
          className="text-2xl border p-3 mx-5 rounded-lg bg-indigo-700 text-white transition-all duration-200 hover:bg-indigo-500"
        >
          <FaGoogle />
        </button>
        <button className="text-2xl border p-3 mx-5 rounded-lg bg-indigo-700 text-white transition-all duration-200 hover:bg-indigo-500">
          <FaLinkedinIn />
        </button> */}
        <div className="flex items-center justify-center h-12 bg-gray-100 dark:bg-gray-700 w-full">
          <button
            onClick={handleGoogleSignUp}
            className="flex h-12 justify-center items-center w-full dark:hover:text-black bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
            <span>{isGoogleLoading ? <Spinner /> : "Sign Up with Google"}</span>
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-sm mt-2">{successMessage}</p>
      )}
      {isVerificationModalOpen && (
        <VerificationModal
          email={email}
          onClose={handleVerificationModalClose}
        />
      )}
    </div>
  );
};

export default RegisterForm;
