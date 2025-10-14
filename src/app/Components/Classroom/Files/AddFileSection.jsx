"use client";
import React, { useState } from "react";
import { FaFilePdf, FaFileAlt, FaUpload } from "react-icons/fa";

export default function AddFileSection({ onAdd }) {
  const [fileData, setFileData] = useState({
    name: "",
    description: "",
    file: null,
  });

  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    setFileData({ ...fileData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileData({ ...fileData, file });
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileData.name || !fileData.description || !fileData.file) return;

    // simulate upload progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);

          const newFile = {
            ...fileData,
            url: URL.createObjectURL(fileData.file),
            date: new Date().toISOString().split("T")[0],
          };

          onAdd(newFile);

          // reset state
          setFileData({ name: "", description: "", file: null });
          setFileName("");
          setProgress(0);
        }
        return p + 10;
      });
    }, 200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111] rounded-xl shadow-md p-4 mb-6 flex flex-col gap-5"
    >
      <h3 className="text-lg font-semibold text-[#1998e1] flex items-center gap-2">
        <FaUpload /> إضافة ملف جديد
      </h3>

      {/* اسم الملف */}
      <div className="flex items-center gap-2">
        <FaFilePdf className="text-[#1998e1]" />
        <input
          type="text"
          name="name"
          value={fileData.name}
          onChange={handleChange}
          placeholder="اسم الملف"
          className="flex-1 p-2 rounded-md bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      {/* الوصف */}
      <div className="flex items-center gap-2">
        <FaFileAlt className="text-[#1998e1]" />
        <input
          type="text"
          name="description"
          value={fileData.description}
          onChange={handleChange}
          placeholder="وصف الملف"
          className="flex-1 p-2 rounded-md bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      {/* رفع الملف (UI محسّن) */}
      <label className="w-full border-2 border-dashed border-[#1998e1]/40 rounded-lg flex flex-col items-center justify-center gap-2 p-6 cursor-pointer hover:border-[#1998e1] transition">
        <FaFilePdf className="text-4xl text-[#1998e1]" />
        {fileName ? (
          <span className="text-sm text-gray-300">{fileName}</span>
        ) : (
          <span className="text-sm text-gray-400">اسحب أو اختر ملف PDF</span>
        )}
        <input type="file" accept="application/pdf" onChange={handleFile} hidden />
      </label>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#1998e1] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* زر الحفظ */}
      <button
        type="submit"
        disabled={progress > 0}
        className={`${
          progress > 0 ? "bg-gray-600 cursor-not-allowed" : "bg-[#1998e1] hover:bg-[#127bbf]"
        } transition p-2 rounded-lg text-white font-medium`}
      >
        {progress > 0 ? "جارٍ الرفع..." : "رفع الملف"}
      </button>
    </form>
  );
}
