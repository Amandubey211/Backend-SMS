import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import DashLayout from "../../../Components/Admin/AdminDashLayout"; // Admin layout with sidebar
import Layout from "../../../Components/Common/Layout";
import TimeTableMainSection from "./TimeTableMainSection";
import TableView from "./Components/TableView"; // Import TableView component
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // To set navigation headings
import UpdateTimeTable from "./Components/UpdateTimeTable";
import { useTranslation } from 'react-i18next';

const TimeTablePage = () => {
  const { t } = useTranslation('admTimeTable'); // Initialize i18next hook
  
  useNavHeading(t("Admin"), t("TimeTable")); // Set the heading for TimeTable section
  return (
    <Layout title="TimeTable | Student Diwan">
      <DashLayout>
        <Routes>
          <Route path="/" element={<TimeTableMainSection />} /> {/* Main timetable section */}
          <Route path="viewtable/:tablename" element={<TableView />} /> {/* Detailed table view */}
          <Route path="edit/:id" element={<UpdateTimeTable />}/> {/* Update time table */}
        </Routes>
      </DashLayout>
    </Layout>
  );
};

export default TimeTablePage;
