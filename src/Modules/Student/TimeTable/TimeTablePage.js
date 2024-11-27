import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentDashLayout from "../../../Components/Student/StudentDashLayout";
import Layout from "../../../Components/Common/Layout";
import TimeTableMainSection from "./TimeTableMainSection";
import TableView from "./Components/TableView";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // Corrected the import path
import { useTranslation } from "react-i18next";

const TimeTablePage = () => {
  const { t } = useTranslation("admTimeTable");
  
  // Set navigation heading
  useNavHeading(t("TimeTable"));

  return (
    <Layout title="TimeTable | Student Diwan">
      <StudentDashLayout>
        <Routes>
          {/* Main timetable section - View list of timetables */}
          <Route path="/" element={<TimeTableMainSection />} />
          
          {/* Detailed view of an individual timetable */}
          <Route path="viewtable/:tablename" element={<TableView />} />
        </Routes>
      </StudentDashLayout>
    </Layout>
  );
};

export default TimeTablePage;
