import React from "react";
import DashLayout from "../../../Components/Admin/AdminDashLayout"; // Admin layout with sidebar
import Layout from "../../../Components/Common/Layout";
import GraduationMainSection from "./GraduationMainSection"; // Main section to display graduates
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading "; // Used for navigation headings
import { useTranslation } from 'react-i18next';

const GraduationPage = () => {
  const { t } = useTranslation('admDashboard');

  useNavHeading(t("Admin"), t("Graduation"));
  return (
    <Layout title="Graduation | Student Diwan">
      <DashLayout>
        <GraduationMainSection /> {/* Graduation specific content */}
      </DashLayout>
    </Layout>
  );
};

export default GraduationPage;
