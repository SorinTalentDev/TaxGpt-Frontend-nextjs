import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Check } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const PaymentForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!stripe || !elements) {
  //     setErrorMessage("Stripe has not loaded yet.");
  //     return;
  //   }

  //   const cardElement = elements.getElement(CardNumberElement);

  //   if (!cardElement) {
  //     setErrorMessage("Card element not found.");
  //     return;
  //   }

  //   setLoading(true);
  //   setErrorMessage("");

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/create-payment-intent`,
  //       {
  //         amount: 9900,
  //         currency: "usd",
  //       }
  //     );

  //     console.log("payment response: ", response);
  //     const { clientSecret } = response.data;
  //     const { paymentIntent, error } = await stripe.confirmCardPayment(
  //       clientSecret,
  //       {
  //         payment_method: { card: cardElement },
  //       }
  //     );
  //     console.log("payment intent: ", paymentIntent);

  //     const storedData = localStorage.getItem("userdata");
  //     let userId: string | null = null;
  //     if (storedData !== null) {
  //       const parsedData = JSON.parse(storedData);
  //       userId = parsedData._id;
  //     }
  //     const result = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/upgrade_plan`,
  //       {
  //         transactionId: paymentIntent?.id,
  //         userId: userId,
  //       }
  //     );
  //     console.log(result);
  //     if (error) {
  //       console.error(error);
  //       toast.error(error.message || "");
  //     } else if (paymentIntent?.status === "succeeded") {
  //       toast.success("Payment successful!");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "");
  //   } finally {
  //     setLoading(false);
  //     onClose();
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setErrorMessage("Card element not found.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Step 1: Create PaymentIntent
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/create-payment-intent`,
        {
          amount: 9900, // Amount in cents (e.g., $99.00)
          currency: "usd",
        }
      );

      const { clientSecret } = data;
      if (!clientSecret) {
        throw new Error("Payment clientSecret not found in backend response.");
      }

      // Step 2: Confirm Payment with Stripe
      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment confirmation failed.");
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error("Payment did not succeed.");
      }

      // Step 3: Retrieve User Data
      const storedData = localStorage.getItem("userdata");
      if (!storedData) {
        throw new Error("User data not found in localStorage.");
      }

      const parsedData = JSON.parse(storedData);
      const userId = parsedData._id;
      if (!userId) {
        throw new Error("User ID not found in stored user data.");
      }

      // Step 4: Upgrade User Plan
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/upgrade_plan`,
        {
          transactionId: paymentIntent.id,
          userId: userId,
        }
      );

      if (result.data.success !== 1) {
        throw new Error("Failed to upgrade user plan.");
      }
      console.log("result: ", result.data);
      localStorage.setItem("userdata", JSON.stringify(result.data.data));
      // Success Notification
      toast.success("Payment successful! Plan upgraded.");
    } catch (error: any) {
      console.error("Error during payment flow:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);

      // Ensure `onClose` is callable
      if (typeof onClose === "function") {
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Card Number
        </label>
        <div className="border p-3 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="border p-3 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="w-1/2">
          <label className="block font-bold text-gray-700 mb-2">CVC</label>
          <div className="border p-3 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}

      <div className="flex justify-between items-center space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-2 rounded-lg font-bold transition-all`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const StripePaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Upgrade Plan
        </h2>
        <div className="flex items-center justify-center mt-4">
          <p className="text-3xl font-bold text-gray-800">$99</p>
          <span className="text-sm font-medium text-gray-500 ml-2">/month</span>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Get the best of MyAIWiz with full access to all features, unlimited
          usage, and premium support.
        </p>
        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" /> Everything in Plus
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" /> Unlimited access to
            MyAIWiz
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <Elements stripe={stripePromise}>
            <PaymentForm onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
