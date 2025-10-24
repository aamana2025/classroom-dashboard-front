"use client";
import React, { useEffect, useState } from "react";
import ReportCard from "../Components/ReportCard";
import * as FaIcons from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../utils/api";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Reports = () => {
  const { reports, setReports } = useAppContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/reportes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل تحميل البيانات");
      const data = await res.json();

      const mappedReports = data.reports.map((report) => ({
        ...report,
        icon: FaIcons[report.icon] || FaIcons.FaClipboardList,
      }));
      setReports(mappedReports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      toast.error(err.message || "حدث خطأ أثناء تحميل التقارير");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reports !== null) return;
    fetchReports();
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6 mr-10 md:mr-0">
        <h2 className="text-2xl font-bold mb-6 mr-10 md:mr-0">التقارير</h2>
        {/* ✅ Refresh Button */}
        <button
          onClick={fetchReports}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaIcons.FaSpinner className="animate-spin" /> : <FaIcons.FaSync />}
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaIcons.FaSpinner className="animate-spin text-4xl text-[#1998e1]" />
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports?.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ReportCard
                  title={report.title}
                  description={report.description}
                  icon={report.icon}
                  value={report.value}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Reports;
