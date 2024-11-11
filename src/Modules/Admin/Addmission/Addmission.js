import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "../Addmission/MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from 'react-i18next';

const Addmission = () => {
  const { t } = useTranslation('admAdmission');

  useNavHeading(t("Admin"), t("Student Admission"));

  return (
    <Layout title="Admission | Student diwan">
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Addmission;
