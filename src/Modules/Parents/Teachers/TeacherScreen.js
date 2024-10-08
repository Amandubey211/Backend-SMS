import React from "react";
// import MainSection from "./MainSection.js";
import MyTeacher from "./MyTeacher.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { useTranslation } from "react-i18next";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const ParentDash = () => {
  const { t } = useTranslation('prtChildrens');
  useNavHeading(t("My Child"),t("Teachers"));
  return (
    <Layout title="Parents | Instrutors">
      <DashLayout children={<MyTeacher/>} hideAvatarList={false} />
    </Layout>
  );
};

export default ParentDash;
