"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  FaPlay,
  FaCalendarAlt,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { API_URL } from "@/app/utils/api";

export default function VideoCard({ video, classID, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getFreshToken = () =>
    new Promise((resolve) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "481144476045-q2joha7klhtqh8n80a8ce87a8et826r2.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl",
        callback: (tokenResponse) => resolve(tokenResponse.access_token),
      });
      client.requestAccessToken({ prompt: "consent" });
    });

  const confirmDeleteAction = async () => {
    try {
      setLoading(true);
      const yt_token = await getFreshToken();

      await axios.delete(
        `${API_URL}/admin/classe/${classID}/video/${video._id}`,
        {
          headers: { Authorization: `Bearer ${yt_token}` },
        }
      );

      toast.success("✅ تم حذف الفيديو بنجاح");
      if (onDelete) onDelete();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("⚠️ فشل حذف الفيديو");
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <div className="bg-[#111] rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg hover:bg-[#1a1a1a] transition">
        <div className="relative w-full rounded-lg overflow-hidden">
          <iframe
            className="w-full h-48 rounded-lg"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0&modestbranding=1&controls=1`}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col">
          <span className="text-white font-semibold flex items-center gap-2">
            <FaPlay className="text-[#1998e1]" /> {video.name}
          </span>
          <p className="text-gray-400 text-sm">{video.description}</p>
          <span className="text-gray-500 text-xs mt-1 flex items-center gap-1">
            <FaCalendarAlt className="text-[#1998e1]" />{" "}
            {new Date(video.uploadedAt).toLocaleDateString("ar-EG")}
          </span>
        </div>

        <button
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className="mt-3 cursor-pointer bg-red-600 hover:bg-red-700 transition p-2 rounded-lg text-white font-medium flex items-center justify-center gap-2"
        >
          <FaTrash /> {loading ? "جارٍ الحذف..." : "حذف الفيديو"}
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 shadow-lg w-[90%] max-w-md border border-gray-700">
            <div className="flex flex-col items-center gap-3 text-center">
              <FaExclamationTriangle className="text-red-500 text-4xl" />
              <h3 className="text-xl font-bold text-white">
                هل أنت متأكد من حذف الفيديو؟
              </h3>
              <p className="text-gray-400 text-sm">
                لا يمكن التراجع عن هذه العملية بعد الحذف.
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={confirmDeleteAction}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                  disabled={loading}
                >
                  <FaTrash /> {loading ? "جارٍ الحذف..." : "حذف"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
                >
                  <FaTimes /> إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
