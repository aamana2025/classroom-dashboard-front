'use client';
import { useAppContext } from "@/app/Context/AppContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaKey, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "@/app/utils/api.js";


const LoginPage = () => {
  const [email, setEmail] = useState("fm883254@gmail.com");
  const [password, setPassword] = useState("fares123");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setIsLogin, setUser } = useAppContext();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password
      });

      const { accessToken, admin } = response.data;

      // Save admin info in context or localStorage
      setIsLogin(true);
      setUser(admin);
      localStorage.setItem("adminToken", accessToken);

      // Redirect to admin dashboard
      router.push("/");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          تسجيل دخول المسؤول
        </h2>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
          <div className="relative">
            <FaUser className="absolute right-3 top-3 text-gray-400" />
            <input
              type="email"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="ادخل البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* كلمة المرور */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">كلمة المرور</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="ادخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute left-3 top-3 text-[#1998e1] focus:outline-none cursor-pointer"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* نسيت كلمة المرور */}
        <div className="flex justify-start mb-6">
          <Link
            href={"/Pages/Auth/forgetPassword"}
            className="flex items-center gap-2 text-[#1998e1] text-sm hover:underline cursor-pointer"
          >
            <FaKey /> نسيت كلمة المرور؟
          </Link>
        </div>

        {/* زر تسجيل الدخول */}
        <button
          className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading && <FaSpinner className="animate-spin" />}
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
