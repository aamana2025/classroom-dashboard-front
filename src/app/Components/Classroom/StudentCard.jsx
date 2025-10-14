"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaUserSlash,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion"; // ✅ import motion

export default function StudentCard({ classID, student }) {
  const { getClassData, setClassTabData } = useAppContext();
  const [kicking, setKicking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [closing, setClosing] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleKick = async () => {
    setKicking(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(
        `${API_URL}/admin/classe/${classID}/student/${student._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const currentStudents = getClassData(classID)?.students || [];
        const updatedStudents = currentStudents.filter(
          (s) => s._id !== student._id
        );
        setClassTabData(classID, "students", updatedStudents);

        toast.success("✅ تم طرد الطالب بنجاح");

        // ✅ تشغيل أنيميشن خروج الكرت
        setRemoved(true);
      } else {
        toast.error(res.data.message || "❌ فشل في طرد الطالب");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء طرد الطالب ❌");
    } finally {
      setKicking(false);
      setClosing(true);
      setTimeout(() => {
        setShowConfirm(false);
        setClosing(false);
      }, 300);
    }
  };

  const handleCancel = () => {
    setClosing(true);
    setTimeout(() => {
      setShowConfirm(false);
      setClosing(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {!removed && (
        <motion.div
          key={student._id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#111] rounded-xl shadow-md p-4 flex flex-col md:flex-row items-start gap-4 hover:bg-[#222] transition relative"
        >
          {/* أيقونة الطالب */}
          <div className="w-12 h-12 rounded-full bg-[#1998e1]/20 flex-shrink-0 flex items-center justify-center text-[#1998e1] text-xl">
            <FaUser />
          </div>

          {/* بيانات الطالب */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-white font-semibold flex items-center gap-2">
              <FaUser className="text-[#1998e1]" /> {student.name}
            </span>

            <span className="text-gray-400 text-sm flex items-center gap-2">
              <FaEnvelope className="text-[#1998e1]" /> {student.email}
            </span>

            <span className="text-gray-400 text-sm flex items-center gap-2">
              <FaPhone className="text-[#1998e1]" /> {student.phone}
            </span>

            <span
              className={`text-sm font-medium flex items-center gap-2 ${
                student.status === "active"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {student.status === "active" ? (
                <>
                  <FaCheckCircle /> نشط
                </>
              ) : (
                <>
                  <FaHourglassHalf /> غير نشط
                </>
              )}
            </span>

            <span className="text-gray-500 text-xs flex items-center gap-2">
              <FaCalendarAlt className="text-[#1998e1]" /> انضم:{" "}
              {new Date(student.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* زر الطرد */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={kicking}
            className="cursor-pointer absolute top-3 left-3 flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
          >
            <FaUserSlash className={kicking ? "animate-spin" : ""} />
            {kicking ? "جاري الطرد..." : "طرد"}
          </button>

          {/* Delete Confirmation Modal */}
          {showConfirm && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
                closing ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className={`bg-[#1a1a1a] rounded-2xl p-6 shadow-lg w-[90%] max-w-md border border-gray-700 transform transition-all duration-300 ${
                  closing ? "scale-90 opacity-0" : "scale-100 opacity-100"
                }`}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <FaExclamationTriangle className="text-red-500 text-4xl" />
                  <h3 className="text-xl font-bold text-white">
                    هل أنت متأكد؟
                  </h3>
                  <div className="flex gap-4 mt-4">
                    <button
                      disabled={kicking}
                      onClick={handleKick}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                    >
                      <FaUserSlash /> {kicking ? "جاري الطرد..." : "نعم"}
                    </button>
                    <button
                      disabled={kicking}
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                    >
                      <FaTimes /> إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
