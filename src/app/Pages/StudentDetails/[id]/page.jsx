"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaCreditCard,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setActivePage, students, isLogin, user } = useAppContext();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (students && id) {
      const found = students.find((s) => String(s.id) === String(id));
      setStudent(found || null);
      console.log(found);

    } else {
      router.back();
    }
  }, [students, id]);

  const handleGoBack = () => {
    setActivePage("students");
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token || !user || !isLogin) {
      router.push("/Pages/Auth/login");
    }
  }, [])


  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        جاري تحميل بيانات الطالب...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#090909] text-white py-8 px-4 md:px-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1998e1]">تفاصيل الطالب</h2>
        <button
          onClick={handleGoBack}
          className="bg-[#1998e1]/20 text-[#1998e1] cursor-pointer p-4 rounded-full hover:bg-[#1998e1]/30 transition"
        >
          <FaArrowLeft className="text-[#1998e1] text-md md:text-lg" />
        </button>
      </div>

      {/* بيانات الطالب */}
      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-4">
        <h3 className="text-lg font-bold text-[#1998e1] mb-2">بيانات الطالب</h3>

        <div className="flex items-center gap-2 text-gray-300">
          <FaIdBadge className="text-[#1998e1]" />
          <span className="text-xs md:text-sm">كود الطالب:</span>
          <span className="font-bold text-xs md:text-sm">{student.id}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FaUser className="text-[#1998e1]" />
          <span className="text-xs md:text-sm">الاسم:</span>
          <span className="font-bold text-xs md:text-sm">{student.name}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FaEnvelope className="text-[#1998e1]" />
          <span className="text-xs md:text-sm">البريد الإلكتروني:</span>
          <span className="font-bold text-xs md:text-sm">{student.email}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FaPhone className="text-[#1998e1]" />
          <span className="text-xs md:text-sm">رقم الهاتف:</span>
          <span className="font-bold text-xs md:text-sm">{student.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          <FaCalendarAlt className="text-[#1998e1]" />
          <span className="text-xs md:text-sm">تاريخ الانضمام:</span>
          <span className="font-bold text-xs md:text-sm">
            {new Date(student.createdAt).toLocaleDateString("ar-EG")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-300">
          {student.status === "active" ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
          <span className="text-xs md:text-sm">الحالة:</span>
          <span
            className={`font-bold text-xs md:text-sm ${student.status === "active" ? "text-green-400" : "text-red-400"
              }`}
          >
            {student.status === "active" ? "نشط" : "غير نشط"}
          </span>
        </div>
      </div>

      {/* الفصول */}
      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h3 className="text-lg font-bold text-[#1998e1] mb-4">الفصول</h3>
        <ul className="list-disc list-inside ml-6 text-xs md:text-sm space-y-1">
          {Array.isArray(student.classes) && student.classes.length > 0 ? (
            student.classes.map((cls, idx) => (
              <li key={idx} className="font-bold text-gray-200">
                {typeof cls === "string" ? cls : cls.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500">لا يوجد فصول مسجلة</li>
          )}
        </ul>
      </div>

      {/* المعاملات */}
      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg border border-[#2a2a2a]">
        <h3 className="text-lg font-bold text-[#1998e1] mb-4">المعاملات</h3>

        {Array.isArray(student.transactions) && student.transactions.length > 0 ? (
          <div className="space-y-4">
            {student.transactions.map((tx, idx) => (
              <div
                key={idx}
                className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <FaMoneyBillWave className="text-green-400" />
                  <span className="text-sm">
                    المبلغ:{" "}
                    <span className="font-bold">{tx.plan.price} {tx.currency}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendarCheck className="text-[#1998e1]" />
                  <span className="text-sm">
                    التاريخ:{" "}
                    <span className="font-bold">
                      {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCreditCard className="text-[#1998e1]" />
                  <span className="text-sm">
                    الحالة:{" "}
                    <span
                      className={`font-bold ${tx.status === "succeeded"
                        ? "text-green-400"
                        : "text-red-400"
                        }`}
                    >
                      {tx.status === "succeeded" ? "ناجحة" : "فاشلة"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">لا يوجد معاملات</p>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsPage;
