"use client";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import ClassroomCard from "./ClassroomCard";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import { API_URL } from "../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHome = () => {
  const { user, classrooms, setClassrooms, homeReport, setHomeReport } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      // ✅ 1) تحديث الكلاسات
      const resClasses = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(resClasses.data);

      // ✅ 2) تحديث التقارير
      const resReports = await axios.get(`${API_URL}/admin/homeReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomeReport(resReports.data);

      toast.success("تم تحديث البيانات والتقارير");
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      toast.error("فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get home reports
  const handleGetreport = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const res = await axios.get(`${API_URL}/admin/homeReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomeReport(res.data);
      toast.success("تم تحديث التقارير");
    } catch (err) {
      console.error("Error refreshing reports:", err);
      toast.error("فشل تحديث التقارير");
    }
  };

  useEffect(() => {
    if (!homeReport) handleGetreport();
  }, []);

  return (
    <div>
      <p className="text-[#1998e1] text-center">This website is operated by Fares Mohamed (developer of the Aamana Classroom app)</p>

      {/* الشريط العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 mr-10 md:mr-0">
        <h2 className="text-2xl font-semibold self-start">
          مرحباً بعودتك 👋 {user?.name}
        </h2>

        {/* ✅ Refresh Button with animation */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleRefresh}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaIcons.FaSpinner className="animate-spin" /> : <FaIcons.FaSync />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* إحصائيات لوحة التحكم */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <AnimatePresence>
          {homeReport?.reports?.map((report, idx) => {
            const Icon = FaIcons[report.icon] || FaIcons.FaUsers; // fallback icon
            return (
              <motion.div
                key={idx}
                className="bg-[#1a1a1a] p-6 rounded-xl shadow-md flex items-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl">
                  <Icon />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1998e1]">{report.title}</h3>
                  <p className="text-2xl font-bold mt-2">{report.value}</p>
                  <p className="text-sm text-gray-400">{report.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* قائمة الكلاسات */}
      <h2 className="text-xl font-semibold mb-4">الفصول الدراسية</h2>
      {!classrooms || classrooms.length === 0 ? (
        <motion.div
          className="text-center text-gray-400 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          لا توجد فصول دراسية متاحة حالياً
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {classrooms.map((classroom, idx) => (
            <motion.div
              key={classroom.id || idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ClassroomCard {...classroom} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
