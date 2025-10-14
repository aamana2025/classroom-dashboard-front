"use client";
import React, { useState } from "react";
import { FaVideo, FaFileAlt, FaUpload } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/app/utils/api";

export default function AddVideoSection({ classID, onAdd }) {
  const [videoData, setVideoData] = useState({
    name: "",
    description: "",
    videoFile: null,
  });
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  const handleChange = (e) =>
    setVideoData({ ...videoData, [e.target.name]: e.target.value });

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoData({ ...videoData, videoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const getFreshToken = () =>
    new Promise((resolve) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          "481144476045-q2joha7klhtqh8n80a8ce87a8et826r2.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/youtube.upload",
        callback: (tokenResponse) => {
          setAuthToken(tokenResponse.access_token);
          resolve(tokenResponse.access_token);
        },
      });
      client.requestAccessToken({ prompt: "consent" });
    });

  const saveVideoMetadata = async (classID, video) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${API_URL}/admin/classe/${classID}/video`,
        {
          videoId: video.videoId,
          name: video.name,
          description: video.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error saving video metadata:", err);
      toast.error("⚠️ فشل حفظ بيانات الفيديو");
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoData.videoFile) {
      toast.error("⚠️ من فضلك اختر فيديو");
      return;
    }

    try {
      const accessToken = authToken || (await getFreshToken());

      const metadata = {
        snippet: {
          title: videoData.name || "Untitled Video",
          description: videoData.description || "No description",
          tags: ["classroom"],
          categoryId: "22",
        },
        status: { privacyStatus: "unlisted" },
      };

      const startRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": videoData.videoFile.size,
            "X-Upload-Content-Type": videoData.videoFile.type,
          },
          body: JSON.stringify(metadata),
        }
      );
      if (!startRes.ok) throw new Error("❌ Failed to start upload session");

      const uploadUrl = startRes.headers.get("location");

      const uploadRes = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", videoData.videoFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve(xhr.responseText)
            : reject(xhr.responseText);

        xhr.onerror = () => reject("❌ Upload failed due to network error");
        xhr.send(videoData.videoFile);
      });

      const videoDataRes = JSON.parse(uploadRes);
      toast.success("🎉 تم رفع الفيديو بنجاح");

      await saveVideoMetadata(classID, {
        videoId: videoDataRes.id,
        name: videoData.name,
        description: videoData.description,
      });

      if (onAdd) onAdd();
      setVideoData({ name: "", description: "", videoFile: null });
      setPreview(null);
      setProgress(0);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.message || "⚠️ فشل رفع الفيديو");
      setProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111] rounded-xl shadow-md p-4 sm:p-6 mb-6 flex flex-col gap-5"
    >
      <h3 className="text-lg sm:text-xl font-bold text-[#1998e1] flex items-center gap-2">
        <FaUpload /> إضافة فيديو جديد
      </h3>

      <div className="flex items-center gap-2">
        <FaVideo className="text-[#1998e1]" />
        <input
          type="text"
          name="name"
          value={videoData.name}
          onChange={handleChange}
          placeholder="اسم الفيديو"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <FaFileAlt className="text-[#1998e1]" />
        <input
          type="text"
          name="description"
          value={videoData.description}
          onChange={handleChange}
          placeholder="وصف الفيديو"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      <label className="max-w-full w-[400px] aspect-video border-2 border-dashed border-[#1998e1]/40 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1998e1] transition">
        {preview ? (
          <video
            src={preview}
            className="w-full h-full object-cover rounded-lg"
            controls
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FaVideo className="text-4xl text-[#1998e1] mb-2" />
            <span>إرفع الفيديو هنا</span>
          </div>
        )}
        <input type="file" accept="video/*" onChange={handleVideoFile} hidden />
      </label>

      {progress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
          <div
            className="bg-[#1998e1] h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
            {progress}%
          </span>
        </div>
      )}

      <button
        type="submit"
        className="bg-[#1998e1] cursor-pointer hover:bg-[#127bbf] transition p-2 rounded-lg text-white font-medium"
      >
        رفع الفيديو
      </button>
    </form>
  );
}
