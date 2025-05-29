import React from "react";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import Layout from "../../../Components/Common/Layout";
import MainSection from "../Verification/MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from "react-i18next";
const VerificationPage = () => {
  const { t } = useTranslation("admVerification"); // Initialize useTranslation hook

  useNavHeading(t("Admin"), t("Verification"));
  return (
    <Layout title="Student Verification | Student Diwan">
      <DashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default VerificationPage;
