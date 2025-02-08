import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../Components/Common/Layout";
import TimeTableMainSection from "./TimeTableMainSection";
import TableView from "./Components/TableView";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const TimeTablePage = () => {
  const { t } = useTranslation("admTimeTable");

  useNavHeading(t("TimeTable"));

  // Get role from Redux store
  const role = useSelector((store) => store.common.auth.role);

  // Determine the layout component based on the role
  const DashLayout = AdminDashLayout;

  return (
    <Layout title="TimeTable | Student Diwan">
      <DashLayout>
        <Routes>
          <Route index element={<TimeTableMainSection />} />
          <Route path="viewtable/:tablename" element={<TableView />} />
        </Routes>
      </DashLayout>
    </Layout>
  );
};

export default TimeTablePage;
