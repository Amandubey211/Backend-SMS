import React from "react";
import DashLayout from "../../../Components/Admin/AdminDashLayout"; // Admin layout with sidebar
import Layout from "../../../Components/Common/Layout";
import TimeTableMainSection from "./TimeTableMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // To set navigation headings

const TimeTablePage = () => {
  useNavHeading("Admin", "TimeTable"); // Set the heading for TimeTable section

  return (
    <Layout title="TimeTable | Student Diwan">
      <DashLayout>
        <TimeTableMainSection /> {/* TimeTable specific content */}
      </DashLayout>
    </Layout>
  );
};

export default TimeTablePage;
