"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  FaCopy,
  FaUsers,
  FaCalendarAlt,
  FaIdBadge,
  FaVideo,
  FaFileAlt,
  FaFilePdf
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ClassroomCard({ id, name, studentsCount, videosCount, pdfsCount, tasksCount, createdAt }) {
  const router = useRouter();

  // نسخ الـ ID
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("تم نسخ الكود");
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        onClick={() => router.push(`/Pages/ClassRoom/${id}`)}
        className="relative bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg cursor-pointer 
                 hover:shadow-xl hover:scale-[1.01] transition-all ease-in-out duration-200 border border-[#2a2a2a] space-y-3"
      >
        {/* زر نسخ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-[#1998e1]/10 text-[#1998e1] 
                     hover:bg-[#1998e1] hover:text-white transition cursor-pointer"
          title="نسخ الكود"
        >
          <FaCopy />
        </button>

        {/* اسم الكلاس */}
        <h3 className="text-xl font-bold text-[#1998e1] mb-4">{name}</h3>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {/* ID */}
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaIdBadge className="text-[#1998e1]" />
            <span title={id}>
              {id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id}
            </span>
          </div>

          {/* عدد الطلاب */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaUsers className="text-[#1998e1]" /> {studentsCount} طالب
          </div>

          {/* الفيديوهات */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaVideo className="text-[#1998e1]" /> {videosCount} فيديو
          </div>

          {/* الملفات */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaFilePdf className="text-[#1998e1]" /> {pdfsCount} ملف
          </div>

          {/* المهام */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaFileAlt className="text-[#1998e1]" /> {tasksCount} مهمة
          </div>

          {/* تاريخ الإنشاء */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaCalendarAlt className="text-[#1998e1]" /> {formatDate(createdAt)}
          </div>
        </div>
      </div>
    </>
  );
}
