"use client";
import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaTrash,
  FaEdit,
  FaSave,
  FaUndo,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api.js";



export default function PlanCard({ title, duration, price, description, id, onDeleted, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const token = localStorage.getItem("adminToken");

  const [planData, setPlanData] = useState({
    title,
    price,
    durationValue: duration.split(" ")[0],
    durationType: duration.split(" ")[1],
    description: description || "",
  });

  // Update Plan
  const handleSave = async () => {
    if (!planData.title || !planData.price || !planData.durationValue || !planData.durationType) {
      toast.error("⚠️ جميع الحقول مطلوبة");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: planData.title,
        price: Number(planData.price),
        durationValue: Number(planData.durationValue),
        durationType: planData.durationType,
        description: planData.description,
      };
      const res = await axios.put(`${API_URL}/plans/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ تم تحديث الخطة بنجاح");
      setEditMode(false);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ خطأ أثناء تحديث الخطة");
    } finally {
      setSaving(false);
    }
  };

  // Delete Plan
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`${API_URL}/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ تم حذف الخطة بنجاح");
      if (onDeleted) onDeleted(id);
      setConfirmDelete(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ خطأ أثناء حذف الخطة");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a] flex flex-col gap-4 relative">
      {/* Actions */}
      <div className="flex gap-2 w-full items-center justify-between">
        {editMode ? (
          <>
            <button onClick={handleSave} disabled={saving} className={`cursor-pointer text-green-400 hover:text-green-600 flex items-center gap-1 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}>
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            </button>
            <button onClick={() => setEditMode(false)} disabled={saving} className={`cursor-pointer text-yellow-400 hover:text-yellow-600 flex items-center gap-1 ${saving ? "opacity-70 cursor-not-allowed" : ""}`}>
              <FaUndo />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditMode(true)} disabled={deleting} className="text-blue-400 hover:text-blue-600 cursor-pointer">
              <FaEdit />
            </button>
            <button onClick={() => setConfirmDelete(true)} disabled={deleting} className={`text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer ${deleting ? "opacity-70 cursor-not-allowed" : ""}`}>
              {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            </button>
          </>
        )}
      </div>

      {/* Title */}
      {editMode ? (
        <input type="text" value={planData.title} onChange={(e) => setPlanData({ ...planData, title: e.target.value })} disabled={saving} className="p-2 bg-[#111] text-white rounded border border-gray-700 outline-none focus:border-[#1998e1] transition" />
      ) : (
        <h3 className="text-lg font-bold text-[#1998e1]">{planData.title}</h3>
      )}

      {/* Duration */}
      <div className="flex items-center gap-2 text-gray-300 text-sm">
        <FaCalendarAlt className="text-[#1998e1]" />
        {editMode ? (
          <div className="flex gap-2">
            <input type="number" value={planData.durationValue} onChange={(e) => setPlanData({ ...planData, durationValue: e.target.value })} disabled={saving} className="p-1 w-16 bg-[#111] text-white rounded border border-gray-700 outline-none focus:border-[#1998e1] transition" />
            <select value={planData.durationType} onChange={(e) => setPlanData({ ...planData, durationType: e.target.value })} disabled={saving} className="p-1 bg-[#111] text-white rounded border border-gray-700 focus:border-[#1998e1] transition">
              <option value="day">يوم</option>
              <option value="week">أسبوع</option>
              <option value="month">شهر</option>
              <option value="year">سنة</option>
            </select>
          </div>
        ) : (
          <span>{`${planData.durationValue} ${planData.durationType}`}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 text-white text-xl font-bold mt-2">
        <FaMoneyBillWave className="text-green-400" />
        {editMode ? (
          <input type="number" value={planData.price} onChange={(e) => setPlanData({ ...planData, price: e.target.value })} disabled={saving} className="p-1 w-24 bg-[#111] text-white rounded border border-gray-700 outline-none focus:border-[#1998e1] transition" />
        ) : (
          planData.price
        )}
      </div>

      {/* Description */}
      {editMode ? (
        <textarea value={planData.description} onChange={(e) => setPlanData({ ...planData, description: e.target.value })} disabled={saving} className="p-2 w-full bg-[#111] text-white rounded border border-gray-700 outline-none focus:border-[#1998e1] transition" rows={3} placeholder="الوصف" />
      ) : (
        description && (
          <div className="flex items-start gap-2 text-gray-400 text-sm mt-2 leading-relaxed">
            <FaInfoCircle className="text-[#1998e1] mt-0.5" />
            <span>{planData.description}</span>
          </div>
        )
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center rounded-2xl p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 w-full max-w-xs text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl animate-pulse" />
            <p className="text-white font-semibold">هل أنت متأكد من حذف هذه الخطة؟</p>
            <div className="flex gap-4 mt-2">
              <button onClick={handleDelete} disabled={deleting} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer">
                {deleting ? <FaSpinner className="animate-spin" /> : "حذف"}
              </button>
              <button onClick={() => setConfirmDelete(false)} disabled={deleting} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition cursor-pointer">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
