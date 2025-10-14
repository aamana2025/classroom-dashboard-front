"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaFilePdf,
  FaPlus,
  FaSpinner,
  FaFileAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion"; // ✅ animations

export default function FilesTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);

  // Local states
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Ensure class slot exists
  useEffect(() => {
    if (classID) openClass(classID);
  }, [classID]);

  // PDFs from context
  const pdfsClass = getClassData(classID)?.files;

  const token = localStorage.getItem("adminToken");

  // ✅ Fetch files
  const fetchFiles = async (force = false) => {
    if (!classID) return;
    if (pdfsClass && !force) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/Allfiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassTabData(classID, "files", res.data.pdfs || []);
    } catch (err) {
      console.error("Error fetching files", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("name", name);
    formData.append("description", description);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/classe/${classID}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      await fetchFiles(true);

      setFile(null);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/admin/classe/${classID}/file/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFiles(true);
      setClosing(true);
      setTimeout(() => {
        setConfirmDelete(null);
        setClosing(false);
      }, 300);
    } catch (err) {
      console.error("Error deleting file", err);
      setClosing(true);
      setTimeout(() => {
        setConfirmDelete(null);
        setClosing(false);
      }, 300);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Edit handlers
  const handleEdit = (pdf) => {
    setEditId(pdf._id);
    setEditName(pdf.name);
    setEditDescription(pdf.description);
    setEditFile(null);
  };
  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
    setEditFile(null);
  };

  const handleUpdate = async (e, pdfId) => {
    e.preventDefault();
    const formData = new FormData();
    if (editFile) formData.append("pdf", editFile);
    formData.append("name", editName);
    formData.append("description", editDescription);

    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/classe/${classID}/file/${pdfId}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      await fetchFiles(true);
      handleCancelEdit();
    } catch (err) {
      console.error("Error updating file", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchFiles();
  }, [classID]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header + Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaFilePdf /> ملفات PDF
        </h2>
        <button
          onClick={() => fetchFiles(true)}
          disabled={loading}
          className="cursor-pointer bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <><FaSyncAlt /><span className="hidden md:inline">تحديث</span></>}
        </button>
      </div>

      {/* Upload form */}
      <motion.form
        onSubmit={handleUpload}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-[#111] p-5 rounded-2xl shadow-lg space-y-4 border border-gray-800"
      >
        <input
          type="text"
          placeholder="اسم الملف"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="الوصف"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-red-500 transition">
          <FaFilePdf className="text-3xl text-red-500 mb-2" />
          <span className="text-gray-400">{file ? file.name : "اختر ملف PDF"}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1998e1] cursor-pointer text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-[#147ab9] transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <><FaPlus /> رفع ملف</>}
        </button>
      </motion.form>

      {/* Files list */}
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence>
          {pdfsClass?.length > 0 ? (
            pdfsClass.map((pdf) => (
              <motion.div
                key={pdf._id}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                exit="exit"
                className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-5 rounded-xl shadow border border-[#2a2a2a] hover:border-[#1998e1] transition flex flex-col gap-3"
              >
                {editId === pdf._id ? (
                  <form onSubmit={(e) => handleUpdate(e, pdf._id)} className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                      placeholder="اسم الملف"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                      placeholder="الوصف"
                    />
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-yellow-400 transition">
                      <FaFilePdf className="text-3xl text-yellow-400 mb-2" />
                      <span className="text-gray-400 text-sm">
                        {editFile ? editFile.name : "اختر ملف PDF جديد (اختياري)"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setEditFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 px-3 py-1 rounded text-white flex items-center gap-2">
                        <FaSave /> حفظ
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="bg-gray-500 px-3 py-1 rounded text-white flex items-center gap-2">
                        <FaTimes /> إلغاء
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaFileAlt className="text-[#1998e1]" /> {pdf.name}
                      </h3>
                      <div className="flex gap-3">
                        <button className="text-yellow-400 hover:text-yellow-600 cursor-pointer" onClick={() => handleEdit(pdf)}>
                          <FaEdit />
                        </button>
                        <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setConfirmDelete(pdf._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{pdf.description}</p>
                    <p className="text-xs text-gray-500">{new Date(pdf.addedAt).toLocaleDateString("ar-EG")}</p>
                    {pdf.url && (
                      <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-[#1998e1] text-sm underline flex items-center gap-1">
                        <FaFilePdf /> عرض الملف
                      </a>
                    )}
                  </>
                )}
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              لا توجد ملفات بعد
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] rounded-2xl p-6 shadow-lg w-[90%] max-w-md border border-gray-700"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <FaExclamationTriangle className="text-red-500 text-4xl" />
                <h3 className="text-xl font-bold text-white">
                  هل أنت متأكد من حذف الملف؟
                </h3>
                <p className="text-gray-400 text-sm">
                  لا يمكن التراجع عن هذه العملية بعد الحذف.
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={confirmDeleteAction}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <FaSpinner className="animate-spin" /> جاري الحذف...
                      </>
                    ) : (
                      <>
                        <FaTrash /> حذف
                      </>
                    )}
                  </button>
                  <button
                    disabled={deleting}
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                  >
                    <FaTimes /> إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
