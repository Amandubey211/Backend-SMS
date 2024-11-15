import React from "react";
// import MainSection from "./MainSection.js";
import MyChildren from "./MyChildrens.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { useTranslation } from "react-i18next";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const ParentDash = () => {
  const { t } = useTranslation('prtChildrens'); // Initialize translation hook

  useNavHeading(t("My Children"));
  return (
    <Layout title="Parents | Children">
      <DashLayout children={<MyChildren />} hideAvatarList={true} />
    </Layout>
  );
};

export default ParentDash;
