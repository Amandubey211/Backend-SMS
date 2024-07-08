import React from "react";
// import MainSection from "./MainSection.js";
import MyChildren from "./MyChildrens.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const ParentDash = () => {
  useNavHeading("My Child");
  return (
    <Layout title="Parents | Student diwan">
      <DashLayout children={<MyChildren />} hideAvatarList={true} />
    </Layout>
  );
};

export default ParentDash;
