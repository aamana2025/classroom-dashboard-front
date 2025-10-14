"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaSync,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeTab({ classID }) {
  const router = useRouter();
  const { openClass, getClassData, setClassTabData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("pending");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    openClass(classID);
  }, [classID]);

  const classData = getClassData(classID)?.home;

  const fetchClass = async (force = false) => {
    if (classData && !force) {
      setClassName(classData.name || "");
      setStatus(classData.status || "pending");
      setDescription(classData.description || "");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassTabData(classID, "home", res.data);
      setClassName(res.data.name);
      setStatus(res.data.status);
      setDescription(res.data.description);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل بيانات الكلاس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClass();
  }, [classID]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/admin/classe/${classID}`,
        { name: className, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تعديل بيانات الكلاس بنجاح ✅");
      setIsEditing(false);
      await fetchClass(true);
    } catch (err) {
      console.error(err);
      toast.error("فشل تعديل الكلاس");
    } finally {
      setLoading(false);
    }
  };

  const getFreshToken = () =>
    new Promise((resolve) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "481144476045-q2joha7klhtqh8n80a8ce87a8et826r2.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl",
        callback: (tokenResponse) => resolve(tokenResponse.access_token),
      });
      client.requestAccessToken({ prompt: "consent" });
    });

  const onDelete = async () => {
    setLoading(true);
    try {
      const yt_token = await getFreshToken();
      await axios.delete(`${API_URL}/admin/classe/${classID}`, {
        headers: { Authorization: `Bearer ${yt_token}` },
      });
      toast.success("تم حذف الكلاس بنجاح 🗑️");
      setShowDeleteModal(false);
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف الكلاس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ✅ Loading Overlay with animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 rounded-2xl"
          >
            <FaSpinner className="animate-spin text-3xl text-[#1998e1]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 relative"
      >
        {/* زر الحذف */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDeleteModal(true)}
          className="absolute top-4 left-4 text-red-500 hover:text-red-600 bg-red-600/20 p-3 rounded-full transition cursor-pointer"
        >
          <FaTrash className="text-md" />
        </motion.button>

        {/* زر التعديل */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 text-[#1998e1] hover:text-blue-400 bg-[#1998e1]/20 p-3 rounded-full transition cursor-pointer"
        >
          <FaEdit className="text-md" />
        </motion.button>

        {/* زر تحديث البيانات */}
        <motion.button
          whileTap={{ rotate: 90 }}
          onClick={() => fetchClass(true)}
          className="absolute top-4 right-16 text-green-500 hover:text-green-400 bg-green-600/20 p-3 rounded-full transition cursor-pointer"
        >
          <FaSync className={`text-md ${loading ? "animate-spin" : ""}`} />
        </motion.button>

        {/* المحتوى */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 mb-6 mt-10"
            >
              {/* تعديل الاسم */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="text-sm text-gray-400 block mb-2">
                  اسم الكلاس
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 text-white focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
                />
              </motion.div>

              {/* تعديل الحالة */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-sm text-gray-400 block mb-2">
                  حالة الكلاس
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 pr-10 rounded-lg bg-[#111] border border-gray-700 text-white appearance-none focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
                  >
                    <option value="active">✅ نشط</option>
                    <option value="pending">⏳ معلق</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1998e1]">
                    {status === "active" ? <FaCheckCircle /> : <FaClock />}
                  </span>
                </div>
              </motion.div>

              {/* تعديل الوصف */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-sm text-gray-400 block mb-2">الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 text-white focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
                />
              </motion.div>

              {/* أزرار */}
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSave}
                  className="flex-1 bg-green-600/20 text-green-500 p-3 rounded-lg hover:bg-green-600/30 transition cursor-pointer"
                >
                  حفظ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-600/20 text-gray-300 p-3 rounded-lg hover:bg-gray-600/30 transition cursor-pointer"
                >
                  إلغاء
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewData"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-[#1998e1] mb-2 mt-10">
                {classData?.name}
              </h1>
              <p
                className={`flex items-center gap-2 text-sm mb-6 ${
                  classData?.status === "active"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {classData?.status === "active" ? (
                  <>
                    <FaCheckCircle /> الكلاس نشط
                  </>
                ) : (
                  <>
                    <FaClock /> الكلاس معلق
                  </>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* باقي التفاصيل */}
        <div className="space-y-4 text-gray-300">
          <p className="flex items-center gap-2">
            <FaUsers className="text-[#1998e1]" />
            <span className="font-semibold text-white">عدد الطلاب:</span>{" "}
            {classData?.studentsCount || 0}
          </p>

          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#1998e1]" />
            <span className="font-semibold text-white">تاريخ الإنشاء:</span>{" "}
            {new Date(classData?.createdAt).toLocaleDateString("ar-EG")}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1998e1] mb-2">
            وصف الكلاس
          </h2>
          <p className="text-gray-400">
            {classData?.description || "لا يوجد وصف"}
          </p>
        </div>
      </motion.div>

      {/* ✅ Modal Animation */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg w-96 text-center"
            >
              <h2 className="text-xl text-white font-bold mb-4">
                هل أنت متأكد من الحذف؟
              </h2>
              <p className="text-gray-400 mb-6">
                سيتم حذف الكلاس بشكل نهائي ولا يمكن التراجع عن العملية.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                >
                  <FaTrash /> حذف
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                >
                  <FaTimes /> إلغاء
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
