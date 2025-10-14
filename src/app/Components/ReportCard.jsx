"use client";
import React from "react";

export default function ReportCard({ title, description, icon: Icon, value }) {
  return (
    <div
      className="relative bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg
                 hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a] flex flex-col gap-4"
    >
      {/* الأيقونة */}
      <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl w-fit">
        <Icon />
      </div>

      {/* العنوان */}
      <h3 className="text-lg font-bold text-[#1998e1]">{title}</h3>

      {/* الوصف */}
      <p className="text-sm text-gray-300">{description}</p>

      {/* القيمة (الرقم) */}
      <div className="text-2xl font-extrabold text-white mt-2">{value}</div>
    </div>
  );
}
