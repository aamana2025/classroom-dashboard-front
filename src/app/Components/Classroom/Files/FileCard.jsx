"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaFilePdf, FaCalendarAlt } from "react-icons/fa";

export default function FileCard({ file }) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/Pages/ClassRoom/FilesDetails/${file.id}`);
  };

  return (
    <div
      onClick={handleView}
      className="bg-[#111] rounded-xl shadow-md p-4 flex flex-col gap-3 cursor-pointer hover:scale-[1.02] transition"
    >
      {/* أيقونة PDF */}
      <div className="flex items-center justify-center w-full h-32 bg-[#1998e1]/10 rounded-lg hover:bg-[#1998e1]/20 transition">
        <FaFilePdf className="text-[#e11d48] text-4xl" />
      </div>

      {/* بيانات الملف */}
      <div className="flex flex-col">
        <span className="text-white font-semibold flex items-center gap-2">
          <FaFilePdf className="text-[#e11d48]" /> {file.name}
        </span>
        <p className="text-gray-400 text-sm">{file.description}</p>
        <span className="text-gray-500 text-xs mt-1 flex items-center gap-1">
          <FaCalendarAlt className="text-[#1998e1]" /> {file.date}
        </span>
      </div>
    </div>
  );
}
