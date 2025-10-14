"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaFilePdf,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const ReceivedTaskTab = ({ classID }) => {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (classID) openClass(classID);
  }, [classID]);

  const subtasksClass = getClassData(classID)?.submissions?.tasks || [];

  const fetchTasks = async (force = false) => {
    if (!classID) return;
    if (subtasksClass && !force) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/class/${classID}/tasks/submissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClassTabData(classID, "submissions", res.data);
      toast.success("تم تحميل المهام بنجاح");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "فشل تحميل المهام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [classID]);

  return (
    <div className="space-y-6 relative">
      <Toaster position="top-center" />

      {/* Header + Refresh */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaClipboardList /> المهام المستلمة
        </h2>
        <button
          onClick={() => fetchTasks(true)}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 text-[#1998e1]">
          <FaSpinner className="animate-spin text-2xl mr-2" />
        </div>
      )}

      {/* Empty */}
      {!loading && subtasksClass.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-10 text-gray-400"
        >
          <FaExclamationTriangle className="text-3xl mb-2 text-yellow-500" />
          <p>لا توجد مهام لهذا الصف.</p>
        </motion.div>
      )}

      {/* Task List with Card + Submissions Animation */}
      <AnimatePresence>
        {!loading &&
          subtasksClass.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-[#2d2d2d] shadow-md rounded-xl p-5 hover:shadow-2xl transition-all"
            >
              {/* Task Header */}
              <div className="mb-4 border-b border-gray-700 pb-3">
                <h2 className="text-xl font-bold text-[#1998e1] flex items-center gap-2">
                  <FaClipboardList /> {task.name}
                </h2>
                <p className="text-gray-300">{task.description}</p>
                {task.url && (
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-red-500 font-medium hover:underline"
                  >
                    <FaFilePdf className="mr-1" /> عرض ملف المهمة
                  </a>
                )}
              </div>

              {/* Submissions */}
              <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                التسليمات ({task.submissions.length})
              </h3>
              <div className="space-y-3">
                {task.submissions.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 italic"
                  >
                    لا توجد تسليمات بعد.
                  </motion.p>
                ) : (
                  <AnimatePresence>
                    {task.submissions.map((sub, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 border border-gray-700 rounded-lg shadow-sm bg-[#181818] hover:bg-[#202020] transition-all"
                      >
                        <p className="flex items-center gap-2 text-gray-100 font-medium">
                          <FaUser className="text-[#1998e1]" />{" "}
                          {sub.student?.name || "غير معروف"}
                        </p>
                        <p className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaEnvelope className="text-gray-500" />{" "}
                          {sub.student?.email || "بلا بريد"}
                        </p>
                        <p className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaPhone className="text-gray-500" />{" "}
                          {sub.student?.phone || "بلا هاتف"}
                        </p>
                        {sub.solution?.url && (
                          <a
                            href={sub.solution.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-green-400 hover:text-green-500 font-medium hover:underline"
                          >
                            <FaFilePdf className="mr-1" /> عرض الحل
                          </a>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          تاريخ التسليم:{" "}
                          {sub.solution?.submittedAt
                            ? new Date(
                                sub.solution.submittedAt
                              ).toLocaleString()
                            : "غير معروف"}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default ReceivedTaskTab;
