"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!id) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `https://class-room-backend-nodejs.vercel.app/api/auth/status/${id}`
        );
        const data = await res.json(); // 👈 read JSON
        setStatus(data.status);        // 👈 use backend status
        console.log("Signup status:", data);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    checkStatus();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      {status === "loading" && (
        <h1 className="text-2xl font-bold text-gray-700">
          ⏳ Checking your payment...
        </h1>
      )}

      {status === "active" && (
        <h1 className="text-2xl font-bold text-green-600">
          ✅ Payment successful! Your account is now active.
        </h1>
      )}

      {status === "pending" && (
        <h1 className="text-2xl font-bold text-yellow-600">
          🔄 Payment received, but still processing. Please refresh in a moment.
        </h1>
      )}

      {status === "not_found" && (
        <h1 className="text-2xl font-bold text-red-600">
          ❌ Something went wrong. Please contact support.
        </h1>
      )}

      {status === "error" && (
        <h1 className="text-2xl font-bold text-red-600">
          ⚠️ Could not check status. Try again later.
        </h1>
      )}
    </div>
  );
};

export default SuccessPage;
