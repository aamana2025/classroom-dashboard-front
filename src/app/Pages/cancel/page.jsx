"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const CancelPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // ✅ Fetch pending user data
  useEffect(() => {
    if (!id) return;

    const fetchPendingUser = async () => {
      try {
        const res = await axios.get(
          `https://class-room-backend-nodejs.vercel.app/api/auth/pending/${id}`
        );
        setPendingData(res.data);
      } catch (err) {
        console.error("Error fetching pending user:", err);
      }
    };

    fetchPendingUser();
  }, [id]);

  // ✅ Retry payment handler
  const handleRetryPayment = async () => {
    if (!id) return;
    setRetrying(true);
    try {
      const res = await axios.post(
        `https://class-room-backend-nodejs.vercel.app/api/payment/re-payment`,
        { id }
      );
      if (res.data.url) {
        window.location.href = res.data.url; // redirect to Stripe Checkout
      }
    } catch (err) {
      console.error("Retry error:", err);
      setRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Canceled</h1>
      <p className="mt-2 text-gray-700">
        Your payment was not completed. Please review your details and retry.
      </p>

      {/* Show Pending User Info */}
      {pendingData && (
        <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow p-4 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Pending Payment Details
          </h2>
          <p>
            <span className="font-bold">Name:</span> {pendingData.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {pendingData.email}
          </p>
          <p>
            <span className="font-bold">Phone:</span> {pendingData.phone}
          </p>
          <p>
            <span className="font-bold">Status:</span>{" "}
            <span className="text-yellow-600">{pendingData.status}</span>
          </p>
          <p>
            <span className="font-bold">Created:</span>{" "}
            {new Date(pendingData.createdAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Retry Payment Button */}
      <button
        onClick={handleRetryPayment}
        disabled={retrying || !pendingData}
        className={`mt-6 px-6 py-2 rounded-lg shadow text-white transition ${
          retrying
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#1998e1] hover:bg-[#127bbf]"
        }`}
      >
        {retrying ? "Retrying..." : "🔄 Retry Payment"}
      </button>
    </div>
  );
};

export default CancelPage;
