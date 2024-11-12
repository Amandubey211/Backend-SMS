import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashLayout from "../../../Components/Admin/AdminDashLayout";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout";
import Layout from "../../../Components/Common/Layout";
import TimeTableMainSection from "./TimeTableMainSection";
import TableView from "./Components/TableView";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // Corrected the import path
import UpdateTimeTable from "./Components/UpdateTimeTable";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const TimeTablePage = () => {
  const { t } = useTranslation("admTimeTable");
  
  useNavHeading(t("Admin"), t("TimeTable"));

  // Get role from Redux store
  const role = useSelector((store) => store.common.auth.role);

  // Determine the layout component based on the role
  const DashLayout = 
    role === "admin" ? AdminDashLayout :
    role === "student" ? StudentDashLayout :
    ParentDashLayout; // Default to ParentDashLayout if role doesn't match

  return (
    <Layout title="TimeTable | Student Diwan">
      <DashLayout>
        <Routes>
          <Route path="/" element={<TimeTableMainSection />} /> {/* Main timetable section */}
          <Route path="viewtable/:tablename" element={<TableView />} /> {/* Detailed table view */}
          <Route path="edit/:id" element={<UpdateTimeTable />} /> {/* Update timetable */}
        </Routes>
      </DashLayout>
    </Layout>
  );
};

export default TimeTablePage;
