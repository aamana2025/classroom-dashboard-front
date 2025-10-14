"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaLink,
  FaHourglass,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSync,
  FaSpinner,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../Context/AppContext";
import { API_URL } from "../utils/api";

// 🔹 Helper: format time left
const formatTimeLeft = (ms) => {
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}س ${minutes}د ${seconds}ث`;
};

// 🔹 Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
};

export default function PendingUsers() {
  const { pendingUsers, setpendingUsers } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [sending, setSending] = useState({});
  const token = localStorage.getItem("adminToken");

  // 🔹 Initialize countdowns
  const initTimers = (users) => {
    const timers = {};
    users.forEach((user) => {
      if (user.expireAt) {
        timers[user.id] = new Date(user.expireAt).getTime() - Date.now();
      }
    });
    setTimeLeft(timers);
  };

  // 🔹 Fetch function
  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/pendingUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setpendingUsers(res.data.data);
        initTimers(res.data.data);
        toast.success("✅ تم جلب المستخدمين بنجاح");
      } else {
        toast.error(res.data.message || "فشل في جلب المستخدمين ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء جلب المستخدمين ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Initial load
  useEffect(() => {
    if (pendingUsers === null) {
      fetchPendingUsers();
    } else {
      initTimers(pendingUsers);
    }
  }, []);

  // 🔹 Countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = {};
        Object.keys(prev).forEach((id) => {
          const newTime = prev[id] - 1000;
          if (newTime > 0) {
            updated[id] = newTime;
          } else {
            setpendingUsers((users) =>
              users.filter((user) => String(user.id) !== String(id))
            );
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setpendingUsers]);

  // 🔹 Send payment link
  const handleResendLink = async (user, remaining) => {
    if (!user.email || !user.checkoutUrl || !remaining) {
      toast.error("❌ لا يوجد بيانات كافية لإرسال الرابط");
      return;
    }

    setSending((prev) => ({ ...prev, [user.id]: true }));

    try {
      const res = await axios.post(
        `${API_URL}/admin/resend-payment-link`,
        {
          email: user.email,
          url: user.checkoutUrl,
          time: remaining,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("✅ تم إرسال رابط الدفع إلى البريد الإلكتروني");
      } else {
        toast.error(res.data.message || "فشل إرسال الرابط ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الرابط ❌");
    } finally {
      setSending((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-2xl shadow-xl space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#1998e1]">
          المستخدمون المعلقون
        </h2>

        {/* Refresh Button */}
        <button
          onClick={fetchPendingUsers}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {/* Full page loading */}
      {loading && pendingUsers?.length === 0 ? (
        <p className="text-gray-300 animate-pulse text-center">
          ⏳ جاري التحميل...
        </p>
      ) : pendingUsers?.length === 0 ? (
        <p className="text-gray-300 text-center">
          📌 لا يوجد مستخدمين معلقين حالياً.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {pendingUsers?.map((user) => {
              const msLeft = timeLeft[user.id] || 0;
              const remaining = formatTimeLeft(msLeft);

              return (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="bg-[#111] rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Header */}
                  <motion.div
                    className="flex flex-col gap-2 border-b border-gray-700 pb-3"
                    variants={containerVariants}
                  >
                    <motion.h3
                      className="text-xl font-semibold text-white flex items-center gap-2"
                      variants={itemVariants}
                    >
                      <FaUser className="text-[#1998e1]" />
                      {user.name}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-gray-300 flex items-center gap-2"
                      variants={itemVariants}
                    >
                      <FaEnvelope className="text-[#1998e1]" /> {user.email}
                    </motion.p>
                    <motion.p
                      className="text-sm text-gray-300 flex items-center gap-2"
                      variants={itemVariants}
                    >
                      <FaPhone className="text-[#1998e1]" /> {user.phone}
                    </motion.p>

                    <motion.div
                      className="flex items-center gap-2 mt-2"
                      variants={itemVariants}
                    >
                      {remaining ? (
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <FaHourglass />
                          ينتهي خلال: {remaining}
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                          منتهية الصلاحية
                        </span>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Plan Section */}
                  {user.plan && (
                    <motion.div
                      className="bg-[#1a1a1a] border border-gray-700 mt-3 p-3 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-[#1998e1] mb-2">
                        تفاصيل الخطة
                      </h4>
                      <p className="text-sm text-gray-300">
                        <FaMoneyBillWave className="inline ml-2 text-[#1998e1]" />
                        {user.plan.title} - ${user.plan.price} /{" "}
                        {user.plan.durationValue} {user.plan.durationType}
                      </p>
                    </motion.div>
                  )}

                  {/* Transaction Section */}
                  {user.transaction && (
                    <motion.div
                      className="bg-[#1a1a1a] border border-gray-700 mt-3 p-3 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-[#1998e1] mb-2">
                        تفاصيل المعاملة
                      </h4>
                      <p className="text-sm text-gray-300">
                        💵 مبلغ: ${user.transaction.amount}{" "}
                        {user.transaction.currency}
                      </p>
                      <p className="text-sm text-gray-300">
                        📝 الحالة: {user.transaction.status}
                      </p>
                      <p className="text-sm text-gray-300 flex items-center gap-1">
                        <FaCalendarAlt className="text-[#1998e1]" />
                        {new Date(
                          user.transaction.createdAt
                        ).toLocaleString("ar-EG")}
                      </p>
                      {user.transaction.checkoutUrl && (
                        <a
                          href={user.transaction.checkoutUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline text-sm mt-1 inline-block"
                        >
                          <FaLink className="inline ml-1" />
                          رابط الدفع
                        </a>
                      )}
                    </motion.div>
                  )}

                  {/* Checkout URL */}
                  {user.checkoutUrl && (
                    <motion.a
                      href={user.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-400 hover:underline mt-3 text-sm text-center"
                      variants={itemVariants}
                    >
                      <FaLink className="inline ml-1" />
                      رابط التفعيل
                    </motion.a>
                  )}

                  {/* Resend link button */}
                  <motion.button
                    onClick={() => handleResendLink(user, remaining)}
                    disabled={sending[user.id]}
                    className="w-full cursor-pointer mt-3 bg-[#1998e1] hover:bg-[#157bb8] text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    variants={itemVariants}
                  >
                    {sending[user.id] ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <SiGmail className="text-xl" />
                    )}
                    {sending[user.id]
                      ? "جاري الإرسال..."
                      : "إعادة إرسال الرابط"}
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
