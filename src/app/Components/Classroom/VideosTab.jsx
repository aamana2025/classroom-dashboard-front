"use client";
import React, { useState, useEffect } from "react";
import VideoCard from "./Video/VideoCard";
import AddVideoSection from "./Video/AddVideoSection";
import { FaSearch, FaVideo, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion"; // ✅ import animation tools

export default function VideosTab({ classID }) {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  // ✅ جلب الفيديوهات من الـ backend
  const fetchVideos = async () => {
    if (!classID) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/classe/${classID}/video`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
      toast.error("فشل في تحميل الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحميل الفيديوهات عند فتح التاب أو تغيير classID
  useEffect(() => {
    fetchVideos();
  }, [classID]);

  // ✅ فلترة الفيديوهات بالبحث
  const filteredVideos = videos.filter((video) =>
    video.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // delay between items
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -30, scale: 0.9 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-6"
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-[#1998e1] flex items-center gap-2"
      >
        <FaVideo className="text-[#1998e1]" /> الفيديوهات
      </motion.h2>

      {/* شريط البحث */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative w-full md:w-1/2"
      >
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن فيديو بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] text-white outline-none border border-gray-700 focus:border-[#1998e1] transition"
        />
      </motion.div>

      {/* إضافة الفيديو */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AddVideoSection classID={classID} onAdd={fetchVideos} />
      </motion.div>

      {/* عرض الفيديوهات */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400"
          >
            ⏳ جاري تحميل الفيديوهات...
          </motion.p>
        ) : filteredVideos.length > 0 ? (
          <AnimatePresence>
            {filteredVideos.map((video) => (
              <motion.div
                key={video._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <VideoCard
                  classID={classID}
                  onDelete={fetchVideos}
                  video={video}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 flex items-center gap-2"
          >
            <FaExclamationTriangle className="text-yellow-500" /> لا يوجد نتائج
            فيديوهات.
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
