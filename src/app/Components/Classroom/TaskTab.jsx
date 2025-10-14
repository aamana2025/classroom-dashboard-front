"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTrash,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaTasks,
  FaClipboardList,
  FaFilePdf,
  FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion"; // ✅

export default function TaskTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  // Add task
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  // Edit task
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (classID) openClass(classID);
  }, [classID]);

  const tasksClass = getClassData(classID)?.tasks;

  const fetchTasks = async (force = false) => {
    if (!classID) return;
    if (tasksClass && !force) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/class/${classID}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassTabData(classID, "tasks", res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks", err);
      toast.error("فشل جلب المهام");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("يجب كتابة عنوان المهمة");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (file) formData.append("task", file);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/class/${classID}/task`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchTasks(true);
      toast.success("تمت إضافة المهمة بنجاح");
      setName("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error("Error adding task", err);
      toast.error("فشل إضافة المهمة");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditName(task.name);
    setEditDescription(task.description);
    setEditFile(null);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
    setEditFile(null);
  };
  const saveEdit = async (e, taskId) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error("يجب كتابة عنوان المهمة");
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    if (editFile) formData.append("task", editFile);

    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/class/${classID}/task/${taskId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تم تحديث المهمة بنجاح");
      cancelEdit();
      fetchTasks(true);
    } catch (err) {
      console.error("Error updating task", err);
      toast.error("فشل تحديث المهمة");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (taskId) => setConfirmDelete(taskId);
  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/admin/class/${classID}/task/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف المهمة بنجاح");
      fetchTasks(true);
      setClosing(true);
      setTimeout(() => {
        setConfirmDelete(null);
        setClosing(false);
      }, 300);
    } catch (err) {
      console.error("Error deleting task", err);
      toast.error("فشل حذف المهمة");
      setClosing(true);
      setTimeout(() => {
        setConfirmDelete(null);
        setClosing(false);
      }, 300);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteAction = () => {
    if (deleting) return;
    setClosing(true);
    setTimeout(() => {
      setConfirmDelete(null);
      setClosing(false);
    }, 300);
  };

  useEffect(() => {
    fetchTasks();
  }, [classID]);

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaTasks /> المهام
        </h2>
        <button
          onClick={() => fetchTasks(true)}
          disabled={loading}
          className="cursor-pointer px-4 py-2 rounded-lg bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] flex items-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaSyncAlt />
              <span className="hidden md:inline">تحديث</span>
            </>
          )}
        </button>
      </div>

      {/* Add task form with animation */}
      <motion.form
        onSubmit={handleAddTask}
        className="bg-[#111] p-5 rounded-2xl shadow-lg space-y-4 border border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          placeholder="عنوان المهمة"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="الوصف"
          rows={3}
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-red-500 transition">
          <FaFilePdf className="text-3xl text-red-500 mb-2" />
          <span className="text-gray-400 text-sm">
            {file ? file.name : "اختر ملف PDF (اختياري)"}
          </span>
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
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaPlus /> إضافة مهمة
            </>
          )}
        </button>
      </motion.form>

      {/* Task list with animation */}
      {loading && (!tasksClass || tasksClass.length === 0) ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-[#1998e1] text-3xl" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {tasksClass?.length > 0 ? (
              tasksClass.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-5 rounded-xl shadow border border-[#2a2a2a] hover:border-[#1998e1] transition flex flex-col gap-3"
                >
                  {editId === task._id ? (
                    <motion.form
                      onSubmit={(e) => saveEdit(e, task._id)}
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                        placeholder="عنوان المهمة"
                      />
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                        placeholder="الوصف"
                      />
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-yellow-400 transition">
                        <FaFilePdf className="text-3xl text-yellow-400 mb-2" />
                        <span className="text-gray-400 text-sm">
                          {editFile ? editFile.name : "اختر ملف جديد (اختياري)"}
                        </span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setEditFile(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-green-600 px-3 py-1 rounded text-white flex items-center gap-2"
                        >
                          <FaSave /> حفظ
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-500 px-3 py-1 rounded text-white flex items-center gap-2"
                        >
                          <FaTimes /> إلغاء
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <>
                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <FaClipboardList className="text-[#1998e1]" />{" "}
                          {task.name}
                        </h3>
                        <div className="flex gap-3">
                          <button
                            className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                            onClick={() => handleEdit(task)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() => handleDeleteClick(task._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                      <motion.p
                        className="text-gray-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {task.description}
                      </motion.p>
                      {task.url && (
                        <motion.a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1998e1] text-sm underline flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <FaFilePdf /> عرض الملف
                        </motion.a>
                      )}
                      <motion.p
                        className="text-xs text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {new Date(task.addedAt).toLocaleDateString("ar-EG")}
                      </motion.p>
                    </>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">لا توجد مهام بعد</p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirm modal with AnimatePresence */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-[#1a1a1a] rounded-2xl p-6 shadow-lg w-[90%] max-w-md border border-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <FaExclamationTriangle className="text-red-500 text-4xl" />
                <h3 className="text-xl font-bold text-white">
                  هل أنت متأكد من حذف المهمة؟
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
                    onClick={cancelDeleteAction}
                    disabled={deleting}
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
    </div>
  );
}
