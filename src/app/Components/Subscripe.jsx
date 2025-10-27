import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCheckCircle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaSync,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api";

const Subscripe = () => {
  const [mode, setMode] = useState("new"); // 'new' or 'renew'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    selectedPlan: null,
  });
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Fetch Plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await axios.get(`${API_URL}/plans`);
        setPlans(res.data.plans || []);
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل الخطط ❌");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // 🔹 Fetch Students for renewal
  useEffect(() => {
    if (mode === "renew") fetchStudents();
  }, [mode]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/students-sub`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.users || []);
      setFilteredStudents(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل الطلاب ❌");
    } finally {
      setLoadingStudents(false);
    }
  };

  // 🔹 Handle Input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Handle Plan Select
  const handleSelectPlan = (planId) =>
    setFormData({ ...formData, selectedPlan: planId });

  // 🔹 Handle Student Search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredStudents(
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, students]);

  // 🔹 Submit (depends on mode)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("غير مصرح لك بالوصول ⚠️");

    if (!formData.selectedPlan)
      return toast.error("يرجى اختيار خطة الاشتراك ⚠️");

    setLoadingSubmit(true);

    try {
      if (mode === "new") {
        // Create new subscription
        const res = await axios.post(
          `${API_URL}/admin/subscripe`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            planId: formData.selectedPlan,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 201) {
          toast.success("تم إنشاء الاشتراك بنجاح ✅");
          setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            selectedPlan: null,
          });
        }
      } else {
        // Re-subscribe
        if (!selectedUser) return toast.error("اختر المستخدم أولاً ⚠️");
        const res = await axios.post(
          `${API_URL}/admin/reSubscripe`,
          {
            userId: selectedUser._id,
            planId: formData.selectedPlan,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          toast.success("تم تجديد الاشتراك بنجاح ✅");
          setSelectedUser(null);
          setFormData({ ...formData, selectedPlan: null });
          fetchStudents();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء العملية ❌");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      selectedPlan: null,
    });
    setSelectedUser(null);
    toast("تم إلغاء العملية", { icon: "⚙️" });
  };
  
  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col gap-8">
      <Toaster position="top-center" />

      {/* 🔹 Switch Mode */}
      <div className="flex justify-center flex-col md:flex-row gap-4 mb-4">
        <button
          onClick={() => setMode("new")}
          className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${mode === "new"
            ? "bg-[#1998e1] text-white"
            : "bg-[#2c2c2c] text-gray-400 hover:bg-[#1998e1]/10"
            }`}
        >
          <FaPlus /> تسجيل جديد
        </button>
        <button
          onClick={() => setMode("renew")}
          className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${mode === "renew"
            ? "bg-[#1998e1] text-white"
            : "bg-[#2c2c2c] text-gray-400 hover:bg-[#1998e1]/10"
            }`}
        >
          <FaSync /> تجديد الاشتراك
        </button>
      </div>

      {/* 🔹 NEW SUBSCRIPTION FORM */}
      {mode === "new" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-[#1998e1] text-center">
            طلب اشتراك جديد
          </h2>

          {/* Name */}
          <div className="flex items-center gap-3 bg-[#2c2c2c] rounded-xl p-3">
            <FaUser className="text-[#1998e1]" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="الاسم الكامل"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-[#2c2c2c] rounded-xl p-3">
            <FaEnvelope className="text-[#1998e1]" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="البريد الإلكتروني"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-[#2c2c2c] rounded-xl p-3 relative">
            <FaLock className="text-[#1998e1]" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="كلمة المرور"
              className="bg-transparent outline-none text-white w-full"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 cursor-pointer text-[#1998e1]"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 bg-[#2c2c2c] rounded-xl p-3">
            <FaPhone className="text-[#1998e1]" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="رقم الهاتف"
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {/* Plans */}
          <PlansSection
            plans={plans}
            loadingPlans={loadingPlans}
            selectedPlan={formData.selectedPlan}
            handleSelectPlan={handleSelectPlan}
          />

          <SubmitButtons loadingSubmit={loadingSubmit} handleReset={handleReset} />
        </form>
      ) : (
        // 🔹 RENEW SUBSCRIPTION SECTION
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-[#1998e1] text-center">
            تجديد اشتراك طالب
          </h2>

          {/* Search */}
          <div className="flex items-center gap-3 bg-[#2c2c2c] rounded-xl p-3">
            <FaSearch className="text-[#1998e1]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <button className="text-[#1998e1] cursor-pointer bg-[#1998e1]/20 w-fit p-2 rounded-lg self-end" type="button" onClick={fetchStudents}><FaSync /></button>

          {/* Students List */}
          <div className="max-h-64 overflow-y-auto space-y-3 hidde_scroll">
            {loadingStudents ? (
              <div className="flex justify-center py-5">
                <FaSpinner className="animate-spin text-[#1998e1] text-3xl" />
              </div>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${selectedUser?._id === user._id
                    ? "bg-[#1998e1]/20 border border-[#1998e1]"
                    : "bg-[#2c2c2c] hover:bg-[#1998e1]/10"
                    }`}
                >
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-3">
                لا يوجد طلاب متاحون.
              </p>
            )}
          </div>

          {/* Plans */}
          <PlansSection
            plans={plans}
            loadingPlans={loadingPlans}
            selectedPlan={formData.selectedPlan}
            handleSelectPlan={handleSelectPlan}
          />

          <SubmitButtons loadingSubmit={loadingSubmit} handleReset={handleReset} />
        </form>
      )}
    </div>
  );
};

// 🔹 Reusable Plan Selection
const PlansSection = ({ plans, loadingPlans, selectedPlan, handleSelectPlan }) => (
  <div className="flex flex-col gap-3 mt-6">
    <h3 className="text-xl text-[#1998e1] text-center">اختر خطة الاشتراك</h3>
    {loadingPlans ? (
      <div className="flex justify-center items-center h-32 text-[#1998e1]">
        <FaSpinner className="animate-spin text-3xl" />
      </div>
    ) : plans.length > 0 ? (
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            onClick={() => handleSelectPlan(plan._id)}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${selectedPlan === plan._id
              ? "border-[#1998e1] bg-[#1998e1]/10"
              : "border-[#2c2c2c] hover:border-[#1998e1]/50"
              }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg text-white font-medium">{plan.title}</h4>
              {selectedPlan === plan._id && (
                <FaCheckCircle className="text-[#1998e1]" />
              )}
            </div>
            <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
            <p className="text-[#1998e1] font-semibold" dir="ltr">
              {plan.price} KWD /{" "}
              {plan.durationType === "month"
                ? "شهر"
                : plan.durationType === "year"
                  ? "سنة"
                  : plan.durationType === "week"
                    ? "أسبوع"
                    : "يوم"}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-center">
        لا توجد خطط اشتراك متاحة حالياً.
      </p>
    )}
  </div>
);

// 🔹 Reusable Submit Buttons
const SubmitButtons = ({ loadingSubmit, handleReset }) => (
  <div className="flex items-center justify-center gap-5">
    <button
      type="submit"
      disabled={loadingSubmit}
      className={`mt-6 bg-[#1998e1] cursor-pointer text-white font-semibold py-3 px-5 rounded-xl hover:bg-[#147bb5] transition-all flex items-center gap-2 ${
        loadingSubmit && "opacity-75"
      }`}
    >
      {loadingSubmit && (
        <FaSpinner className="animate-spin text-white text-lg" />
      )}
      حفظ
    </button>

    <button
      type="button"
      onClick={handleReset}
      className="cursor-pointer mt-6 bg-gray-600 text-white font-semibold py-3 px-5 rounded-xl hover:bg-[#147bb5] transition-all"
    >
      إلغاء
    </button>
  </div>
);

export default Subscripe;
