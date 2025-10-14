"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaEdit,
  FaSave,
  FaUndo,
  FaLock,
  FaSpinner,
  FaSyncAlt,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user, setUser } = useAppContext(); 
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "" });
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("adminToken");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ حفظ التحديث
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updateData = {
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
      };

      if (passwords.newPassword) {
        updateData.password = passwords.newPassword;
      }

      const res = await axios.put(`${API_URL}/admin/auth/${user._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.admin);
      toast.success("تم تحديث البيانات بنجاح ✅");
      setEditing(false);
      setPasswords({ newPassword: "" });
    } catch (err) {
      toast.error("فشل التحديث ❌");
    } finally {
      setSaving(false);
    }
  };

  // ✅ إعادة تحميل بيانات الأدمن
  const handleRefresh = async () => {
    if (!user?._id) return;
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_URL}/admin/auth/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.admin);
      toast.success("تم تحديث البيانات ✅");
    } catch (err) {
      console.error("Error refreshing profile:", err);
      toast.error("فشل في تحديث البيانات ❌");
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ شاشة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-[#1998e1] text-4xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        لا توجد بيانات لعرضها ❌
      </div>
    );
  }

  return (
    <motion.div
      className="px-0 sm:px-6 lg:px-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-center sm:text-right"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          الملف الشخصي
        </motion.h2>

        {/* زر تحديث البيانات */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-end flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
        >
          {refreshing ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSyncAlt />
          )}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      <motion.div
        className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* البيانات الشخصية */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-[#2a2a2a] pb-2">
            البيانات الشخصية
          </h3>

          {/* الاسم */}
          <motion.div layout className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaUser /> الاسم
            </label>
            {editing ? (
              <motion.input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ) : (
              <p className="text-white">{user.name}</p>
            )}
          </motion.div>

          {/* البريد الإلكتروني */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaEnvelope /> البريد الإلكتروني
            </label>
            <p className="text-white">{user.email}</p>
          </div>

          {/* الهاتف */}
          <motion.div layout className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaPhone /> الهاتف
            </label>
            {editing ? (
              <motion.input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ) : (
              <p className="text-white">{user.phone}</p>
            )}
          </motion.div>

          {/* الدور */}
          <motion.div layout className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaIdBadge /> الدور
            </label>
            {editing ? (
              <motion.select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="bg-[#222] text-white rounded px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <option value="admin">مدير</option>
                <option value="super-admin">سوبر مدير</option>
              </motion.select>
            ) : (
              <p className="text-white">{user.role}</p>
            )}
          </motion.div>

          {/* الحالة */}
          <motion.div layout className="flex flex-col gap-2">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              الحالة
            </label>
            {editing ? (
              <motion.select
                name="status"
                value={user.status}
                onChange={handleChange}
                className="bg-[#222] text-white rounded px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </motion.select>
            ) : (
              <p
                className={`${
                  user.status === "active" ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.status === "active" ? "نشط" : "غير نشط"}
              </p>
            )}
          </motion.div>
        </div>

        {/* كلمة المرور */}
        <AnimatePresence>
          {editing && (
            <motion.div
              key="password-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4 border-b border-[#2a2a2a] pb-2">
                الأمان
              </h3>
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm text-[#1998e1] flex items-center gap-2">
                  <FaLock /> كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* الأزرار */}
        <motion.div
          layout
          className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2a2a2a]"
        >
          {editing ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaSave /> حفظ
                  </>
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(false)}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full sm:w-auto cursor-pointer"
              >
                <FaUndo /> إلغاء
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bb5] transition w-full sm:w-auto cursor-pointer"
            >
              <FaEdit /> تعديل البيانات
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
