"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaStickyNote,
  FaPaperPlane,
  FaSpinner,
  FaSyncAlt,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";

export default function NotesTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ✅ for popup confirm
  const bottomRef = useRef(null);
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    if (classID) openClass(classID);
  }, [classID]);

  const notesClass = getClassData(classID)?.notes;

  // Fetch notes
  const fetchNotes = async (force = false) => {
    if (!classID) return;
    if (notesClass && !force) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/note`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClassTabData(classID, "notes", res.data.notes || []);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل الملاحظات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [classID]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notesClass]);

  // Add note
  const addNote = async () => {
    if (!newNote.trim()) return toast.error("⚠️ لا يمكن إضافة ملاحظة فارغة");
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/admin/classe/${classID}/note`, { msg: newNote },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewNote("");
      fetchNotes(true);
      toast.success("تمت إضافة الملاحظة ✍️");
    } catch (err) {
      console.error(err);
      toast.error("فشل إضافة الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/classe/${classID}/note/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotes(true);
      toast.success("تم حذف الملاحظة");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف الملاحظة");
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null); // close modal
    }
  };

  // Edit note
  const startEdit = (note) => {
    setEditId(note._id);
    setEditText(note.msg);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return toast.error("⚠️ لا يمكن أن تكون الملاحظة فارغة");
    setActionLoading(true);
    try {
      await axios.put(`${API_URL}/admin/classe/${classID}/note/${editId}`, { msg: editText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      setEditText("");
      fetchNotes(true);
      toast.success("تم تعديل الملاحظة");
    } catch (err) {
      console.error(err);
      toast.error("فشل تعديل الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col h-[80vh]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaStickyNote /> الملاحظات
        </h2>
        <button
          onClick={() => fetchNotes(true)}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg shadow transition disabled:opacity-50"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 hidde_scroll">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-[#1998e1] text-3xl" />
          </div>
        ) : (
          <AnimatePresence>
            {notesClass?.map((note) => (
              <motion.div
                key={note._id}
                className="flex justify-end"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="bg-[#1998e1]/20 text-white p-4 rounded-2xl shadow-md flex flex-col max-w-full break-words">
                  {editId === note._id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="p-2 rounded-md bg-[#111] text-white outline-none mb-2"
                      />
                      <div className="flex gap-2 self-end">
                        <button
                          onClick={saveEdit}
                          disabled={actionLoading}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="mb-2 flex items-start gap-2 whitespace-pre-wrap break-words">
                        <FaStickyNote className="text-[#1998e1] shrink-0" />
                        <span className="break-words">{note.msg}</span>
                      </span>
                      <span className="text-xs text-gray-400 mb-2">
                        {new Date(note.createdAt).toLocaleString("ar-EG")}
                      </span>
                      <div className="flex gap-3 self-end text-sm text-gray-300">
                        <button
                          onClick={() => startEdit(note)}
                          className="text-yellow-400 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(note._id)} // ✅ open modal
                          className="text-red-500 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Add new note */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="✍️ أضف ملاحظة جديدة..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#111] focus:border-[#1998e1] focus:outline-none border border-gray-700 text-white transition-all ease-in-out duration-300"
        />
        <button
          onClick={addNote}
          disabled={actionLoading}
          className="bg-[#1998e1]/20 text-[#1998e1] p-3 rounded-lg hover:bg-[#1998e1]/30 transition cursor-pointer disabled:opacity-50"
        >
          {actionLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </div>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1a1a1a] rounded-xl p-6 w-[90%] max-w-md shadow-lg"
            >
              <h3 className="text-xl font-bold text-red-400 mb-4">
                تأكيد الحذف
              </h3>
              <p className="text-gray-300 mb-6">
                هل أنت متأكد أنك تريد حذف هذه الملاحظة؟
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => deleteNote(confirmDeleteId)}
                  disabled={deleteLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "حذف"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
