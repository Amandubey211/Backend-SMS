import React from "react";
import DashLayout from "../../../Components/Admin/AdminDashLayout"; // Admin layout with sidebar
import Layout from "../../../Components/Common/Layout";
import GraduationMainSection from "./GraduationMainSection"; // Main section to display graduates
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // Used for navigation headings

const GraduationPage = () => {
  useNavHeading("Admin", "Graduation"); // Update the heading for Graduation section
  return (
    <Layout title="Graduation | Student Diwan">
      <DashLayout>
        <GraduationMainSection /> {/* Graduation specific content */}
      </DashLayout>
    </Layout>
  );
};

export default GraduationPage;
