import React from "react";
// import MainSection from "./MainSection.js";
import MyTeacher from "./MyTeacher.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Parents/ParentDashLayout.js";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const ParentDash = () => {
  useNavHeading("My Child","Teachers");
  return (
    <Layout title="Parents | Student diwan">
      <DashLayout children={<MyTeacher/>} hideAvatarList={false} />
    </Layout>
  );
};

export default ParentDash;
