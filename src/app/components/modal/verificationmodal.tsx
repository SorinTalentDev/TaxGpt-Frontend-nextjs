import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

interface VerificationModalProps {
  email: string;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  email,
  onClose,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);

      // Move focus to the next input
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const updatedCode = [...code];
      updatedCode[index - 1] = "";
      setCode(updatedCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      //   const response = await axios.post(
      //     `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/verifyCode`,
      //     { email, code: code.join("") }
      //   );

      //   if (response.data.success) {
      //     setSuccessMessage("Verification successful!");
      //     setTimeout(() => {
      //       onClose();
      //     }, 1500);
      //   } else {
      //     setErrorMessage("Invalid or expired verification code.");
      //   }
      if (code.join("") === "123456") {
        setSuccessMessage("Verification successful!");
        setTimeout(() => {
          onClose();
          window.location.href = "/home";
        }, 1500);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
        >
          ✕
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            We've sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="mt-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={setInputRef(index)}
                className="w-12 h-12 text-center text-lg border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:focus:ring-blue-400"
              />
            ))}
          </div>

          {errorMessage && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-4">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 dark:text-green-400 text-sm mt-4">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.some((digit) => digit === "")}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition disabled:bg-gray-300 dark:disabled:bg-gray-600"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
