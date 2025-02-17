import React, { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
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

const PaymentForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        { amount: 9900, currency: "usd" }
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
      const upgradeResult = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/upgrade_plan`,
        {
          transactionId: paymentIntent.id,
          userId,
          amount: paymentIntent.amount,
        }
      );

      if (upgradeResult.data.success !== 1) {
        throw new Error("Failed to upgrade user plan.");
      }

      console.log("Upgrade Result:", upgradeResult.data);
      localStorage.setItem("userdata", JSON.stringify(upgradeResult.data.data));

      // Success Notification
      window.location.href = "/home";
      toast.success("Payment successful! Plan upgraded.");
    } catch (error: any) {
      console.error("Error during payment flow:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
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
        <div className="border p-3 rounded-lg bg-gray-50">
          <CardNumberElement />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="border p-3 rounded-lg bg-gray-50">
            <CardExpiryElement />
          </div>
        </div>

        <div className="w-1/2">
          <label className="block font-bold text-gray-700 mb-2">CVC</label>
          <div className="border p-3 rounded-lg bg-gray-50">
            <CardCvcElement />
          </div>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}

      <div className="flex justify-between items-center space-x-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-2 rounded-lg font-bold`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const StripePaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchStripeKey = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/get-stripe-settings`
          );

          const stripeKey = data.mode === "live" ? data.livePubKey : data.testPubKey;
          setStripePromise(loadStripe(stripeKey));
        } catch (error) {
          console.error("Error fetching Stripe key:", error);
          toast.error("Failed to load payment details.");
        } finally {
          setLoading(false);
        }
      };

      fetchStripeKey();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-gray-800 text-center">Upgrade Plan</h2>
        <div className="flex items-center justify-center mt-4">
          <p className="text-3xl font-bold text-gray-800">$99</p>
          <span className="text-sm font-medium text-gray-500 ml-2">/month</span>
        </div>
        <p className="text-sm text-gray-500 text-center mt-2">
          Get the best of MyAIWiz with full access to all features, unlimited usage, and premium support.
        </p>

        <div className="border-t pt-4 mt-4">
          {loading || !stripePromise ? (
            <p className="text-center text-gray-500">Loading payment details...</p>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentForm onClose={onClose} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
