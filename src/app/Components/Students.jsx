"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaSpinner,
  FaSyncAlt,
} from "react-icons/fa";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const Students = () => {
  const router = useRouter();
  const { students, setStudents } = useAppContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      toast.success("تم تحديث الطلاب");
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("فشل في تحميل الطلاب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (students) return;
    fetchStudents();
  }, []);

  return (
    <div>
      <Toaster position="top-center" />
      {/* Title + Refresh Button */}
      <div className="flex justify-between items-center mb-6 mr-10 md:mr-0">
        <h2 className="text-2xl font-bold">الطلاب</h2>

        {/* ✅ Animated Refresh Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={fetchStudents}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 
                     text-[#1998e1] px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* ✅ Loading Spinner */}
      {loading && students === null ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSpinner className="animate-spin text-[#1998e1] text-4xl" />
        </motion.div>
      ) : students?.length === 0 ? (
        <motion.div
          className="flex justify-center items-center h-64 text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          لا يوجد طلاب حتى الآن
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <AnimatePresence>
            {students?.map((student, idx) => (
              <motion.div
                key={student.id || idx}
                onClick={() => router.push(`/Pages/StudentDetails/${student.id}`)}
                className="relative bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg cursor-pointer 
                           hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a]"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-bold text-[#1998e1] mb-4 flex items-center gap-2">
                  <FaUser className="text-[#1998e1]" />
                  {student.name}
                </h3>

                <div className="flex items-center gap-2 text-sm mb-3">
                  {student.status === "active" ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaTimesCircle className="text-red-400" />
                  )}
                  <span
                    className={
                      student.status === "active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {student.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <FaCalendarAlt className="text-[#1998e1]" />
                  {new Date(student.createdAt).toLocaleDateString("ar-EG")}
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaChalkboardTeacher className="text-[#1998e1]" />
                  {student.classes?.length || 0} كلاس
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Students;
