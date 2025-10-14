"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/utils/api.js";

export default function ResetPasswordPage() {
  const { email: encodedEmail, otp } = useParams();
  const email = decodeURIComponent(encodedEmail);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("ادخل كلمة المرور وكلمة التأكيد");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل وتحتوي على حرف ورقم");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/admin/reset-password`, {
        email,
        otp,
        newPassword,
      });
      toast.success(data.message);
      setSuccess(true);
      router.push("/Pages/Auth/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]" dir="rtl">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">تم إعادة تعيين كلمة المرور بنجاح</h2>
          <p className="text-gray-400 mb-6">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-gray-400 text-center mb-6">
          أدخل كلمة مرور جديدة لحسابك وتأكيدها.
        </p>

        <div className="mb-4 relative">
          <label className="block text-gray-300 mb-2">كلمة المرور الجديدة</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أدخل كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3 text-gray-400 cursor-pointer"
            >
              {showPassword ? <FaEye /> :  <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-300 mb-2">تأكيد كلمة المرور</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أعد إدخال كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3 text-gray-400 cursor-pointer"
            >
              {showPassword ? <FaEye />: <FaEyeSlash /> }
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
        </button>
      </div>
    </div>
  );
}
