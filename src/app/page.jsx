"use client";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaChartBar,
  FaBars,
  FaTimes,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
  FaMoneyBillWave,
  FaSpinner,
  FaUserClock,
  FaUserShield,
  FaRegCreditCard,
} from "react-icons/fa";
import Classrooms from "./Components/Classrooms";
import DashboardHome from "./Components/DashboardHome";
import Plans from "./Components/Plans";
import Profile from "./Components/Profile";
import Reports from "./Components/Reports";
import Students from "./Components/Students";
import { useAppContext } from "./Context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "./utils/api.js";
import Transactions from "./Components/Transactions";
import toast from "react-hot-toast";
import PendingUsers from "./Components/PendingUsers";
import Subscripe from "./Components/Subscripe";

// ✅ Loader Component
const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <FaSpinner className="animate-spin text-3xl text-[#1998e1]" />
    </div>
  );
};

export default function Home() {
  const {
    sidebarOpen,
    setSidebarOpen,
    isLogin,
    setIsLogin,
    user,
    setUser,
    activePage,
    setActivePage,
    classrooms,
    setClassrooms,
    setStudents,
    setPlans,
    setTransactions,
    setActiveTab,
    setpendingUsers,
    setReports,
    setHomeReport,
    setClassesData
  } = useAppContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false); // ✅ Loader عام
  const [errorClasses, setErrorClasses] = useState(null);

  const handleLogout = () => {
    setLoading(true);
    setIsLogin(false);
    setUser(null);
    setClassrooms(null);
    setStudents(null);
    setPlans(null);
    setTransactions(null);
    setpendingUsers(null);
    setActivePage('home');
    setActiveTab('home');
    localStorage.removeItem("adminToken");
    setReports(null);
    setHomeReport(null);
    setClassesData([]);
    setLoading(false);
    router.push("/Pages/Auth/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "students":
        return <Students />;
      case "reports":
        return <Reports />;
      case "plans":
        return <Plans />;
      case "profile":
        return <Profile />;
      case "transactions":
        return <Transactions />;
      case "pending":
        return <PendingUsers />;
      case "classrooms":
        return <Classrooms />;
      case "subscripe":
        return <Subscripe />;
      default:
        return <DashboardHome />;
    }
  };

  const handleRouting = (path) => {
    setSidebarOpen(false);
    setActivePage(path);
  };

  // ✅ Fetch Classes
  const fetchClasses = async () => {
    if (classrooms) return
    setLoading(true); // ⏳ Start loader
    setErrorClasses(null);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setErrorClasses("تعذر الاتصال بالخادم");
      toast.error("فشل في تحميل الكلاسات");
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [setClassrooms]);

  // ✅ Protect route
  useEffect(() => {
    const checkAdminToken = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/Pages/Auth/login");
        return;
      }

      try {
        setLoading(true); // ⏳ Start loader
        const res = await axios.get(`${API_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsLogin(true);
        setUser(res.data.admin);
      } catch (err) {
        console.error(err);
        toast.error("جلسة المسؤول انتهت، يرجى تسجيل الدخول مرة أخرى");
        localStorage.removeItem("adminToken");
        setIsLogin(false);
        setUser(null);
        router.push("/Pages/Auth/login");
      } finally {
        setLoading(false); // ✅ Stop loader
      }
    };

    if (!isLogin || !user) {
      checkAdminToken();
    }
  }, [isLogin, user, setIsLogin, setUser, router]);

  if (!isLogin || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#090909] text-white" dir='rtl'>
        <FaSpinner className="animate-spin text-3xl text-[#1998e1]" />
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-[#090909] text-white" dir="rtl">
      {/* ✅ Loader Overlay */}
      {loading && <Loader />}

      {/* الشريط الجانبي */}
      <aside
        className={`fixed md:static top-0 right-0 h-screen w-64 bg-[#1a1a1a] p-6 flex flex-col transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 text-[#1998e1] text-xl self-end cursor-pointer mb-4"
        >
          <FaTimes />
        </button>

        <h1 className="text-2xl font-bold text-[#1998e1] mb-8">لوحة التحكم</h1>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li
              onClick={() => handleRouting("home")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 ${activePage === "home"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaHome className="text-[#1998e1]" /> الرئيسية
            </li>
            <li
              onClick={() => handleRouting("students")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "students"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaUserGraduate className="text-[#1998e1]" /> الطلاب
            </li>
            <li
              onClick={() => handleRouting("classrooms")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "classrooms"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaChalkboardTeacher className="text-[#1998e1]" /> الكلاسات
            </li>
            <li
              onClick={() => handleRouting("reports")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "reports"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaChartBar className="text-[#1998e1]" /> التقارير
            </li>
            <li
              onClick={() => handleRouting("plans")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "plans"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaClipboardList className="text-[#1998e1]" /> الخطط
            </li>
            <li
              onClick={() => handleRouting("profile")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "profile"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaUser className="text-[#1998e1]" /> الملف الشخصي
            </li>
            <li
              onClick={() => handleRouting("transactions")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "transactions"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaMoneyBillWave className="text-[#1998e1]" /> التحويلات
            </li>
            <li
              onClick={() => handleRouting("subscripe")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "subscripe"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaRegCreditCard className="text-[#1998e1]" />الاشتراكات
            </li>
            <li
              onClick={() => handleRouting("pending")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "pending"
                ? "bg-[#1998e1]/20"
                : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaUserClock className="text-[#1998e1]" /> حسابات معلقه
            </li>
            <li
              onClick={() => router.push("/Pages/privacy-policy")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 hover:bg-[#2c2c2c]`}
            >
              <FaUserShield className="text-[#1998e1]" />Privacy Policy
            </li>
          </ul>
        </nav>

        <button
          className=" flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-500/10  transition-all ease-in-out duration-300  mt-auto cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> تسجيل الخروج
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 md:ml-0 hidde_scroll">
        {/* menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="cursor-pointer md:hidden p-2 text-[#1998e1] text-2xl fixed top-3 right-3 z-10 bg-[#111] rounded-xl"
        >
          <FaBars />
        </button>

        {/* المحتوى الديناميكي */}
        {renderContent()}
      </main>
    </div>
  );
}
