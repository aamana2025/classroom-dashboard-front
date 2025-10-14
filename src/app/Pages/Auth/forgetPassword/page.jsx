'use client';
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/utils/api.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/admin/forgot-password`, { email });
      toast.success(data.message || "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني");
      setEmail(""); // clear input
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          نسيت كلمة المرور
        </h2>
        <p className="text-gray-400 text-center mb-6">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.
        </p>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
          <div className="relative">
            <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
            <input
              type="email"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {/* زر الإرسال */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
        </button>

        {/* الرجوع لتسجيل الدخول */}
        <div className="mt-6 text-center">
          <a
            href="/Pages/Auth/login"
            className="text-[#1998e1] text-sm hover:underline cursor-pointer"
          >
            الرجوع إلى تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
