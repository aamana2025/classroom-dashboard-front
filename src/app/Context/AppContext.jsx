"use client";
import React, { createContext, useContext, useState } from "react";

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  // 🔹 Example global states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [TapssidebarOpen, setTapsSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [plans, setPlans] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [pendingUsers, setpendingUsers] = useState(null);
  const [reports, setReports] = useState(null);
  const [homeReport, setHomeReport] = useState(null);



  // class
  const [classesData, setClassesData] = useState([]);
  // ✅ Find or create a class slot in context
  const openClass = (id) => {
    setClassesData((prev) => {
      if (prev.find((c) => c.id === id)) return prev;
      return [
        ...prev,
        {
          id,
          home: null,
          students: null,
          files: null,
          tasks: null,
          receivedTasks: null,
          notes: null,
          videos: null,
        },
      ];
    });
  };
  // ✅ Save tab data for class
  const setClassTabData = (id, tab, data) => {
    setClassesData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [tab]: data } : c
      )
    );
  };

  // ✅ Get class data
  const getClassData = (id) => {
    return classesData.find((c) => c.id === id) || null;
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen, setSidebarOpen,
        user, setUser,
        isLogin, setIsLogin,
        classrooms, setClassrooms,
        activePage, setActivePage,
        activeTab, setActiveTab,
        TapssidebarOpen, setTapsSidebarOpen,
        students, setStudents,
        plans, setPlans,
        transactions, setTransactions,
        pendingUsers, setpendingUsers,
        setClassesData, classesData,
        openClass, setClassTabData, getClassData,
        reports, setReports,
        homeReport, setHomeReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy usage
export const useAppContext = () => useContext(AppContext);
