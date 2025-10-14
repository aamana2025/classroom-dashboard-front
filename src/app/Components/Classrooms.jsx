"use client";
import React, { useState, useEffect } from "react";
import ClassroomCard from "../Components/ClassroomCard";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaPlus, FaSpinner, FaTimes, FaSyncAlt } from "react-icons/fa";
import { API_URL } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

const Classrooms = () => {
  const { classrooms, setClassrooms } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false); // form loading
  const [pageLoading, setPageLoading] = useState(false); // page loading
  const [form, setForm] = useState({ name: "", description: "" });

  // Update form state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(res.data);
      toast.success("تم تحديث الكلاسات ");
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("فشل في تحميل الكلاسات ");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!classrooms || classrooms.length === 0) {
      fetchClasses();
    }
  }, []);

  // Add new class
  const handleAddClass = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name || !description) {
      toast.error("الرجاء إدخال جميع البيانات");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${API_URL}/admin/classe/add`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("تم إضافة الكلاس بنجاح ");
      setForm({ name: "", description: "" });
      setIsAdding(false);

      // Refresh classes list
      await fetchClasses();
    } catch (err) {
      console.error(err);
      toast.error("فشل في إضافة الكلاس ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster center />
      {/* العنوان + زر التحديث */}
      <div className="flex justify-between items-center mb-6 mr-10 md:mr-0">
        <h2 className="text-2xl font-bold text-[#1998e1]">الكلاسات</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={fetchClasses}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg shadow transition"
          disabled={pageLoading}
        >
          {pageLoading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* زر إضافة / إلغاء كلاس */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsAdding(!isAdding)}
        className={`mb-6 cursor-pointer px-4 py-2 rounded-xl shadow flex items-center gap-2 transition
          ${
            isAdding
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-[#1998e1] hover:bg-[#157bb8] text-white"
          }`}
      >
        {isAdding ? <FaTimes /> : <FaPlus />}
        {isAdding ? "إلغاء" : "إضافة كلاس"}
      </motion.button>

      {/* فورم الإضافة */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            onSubmit={handleAddClass}
            className="bg-[#1a1a1a] shadow-lg rounded-2xl p-6 mb-8 w-full text-white border border-[#1998e1]/30"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-[#1998e1] mb-2">اسم الكلاس</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#151515] border border-[#1998e1]/40 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1998e1] focus:outline-none text-white"
                placeholder="أدخل اسم الكلاس"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#1998e1] mb-2">الوصف</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-[#151515] border border-[#1998e1]/40 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1998e1] focus:outline-none text-white"
                placeholder="أدخل وصف الكلاس"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1998e1] cursor-pointer text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#157bb8] disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "إضافة"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* شبكة الكروت */}
      {pageLoading && (!classrooms || classrooms?.length === 0) ? (
        <motion.div
          className="flex justify-center items-center py-10 text-[#1998e1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSpinner className="animate-spin text-3xl" />
          <span className="ml-3">جاري تحميل الكلاسات...</span>
        </motion.div>
      ) : classrooms?.length === 0 ? (
        <motion.p
          className="text-gray-400 text-center py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          لا توجد كلاسات حتى الآن
        </motion.p>
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
            {classrooms?.map((classroom, idx) => (
              <motion.div
                key={classroom.id || idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ClassroomCard {...classroom} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Classrooms;
