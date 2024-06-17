import React from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const Dash = () => {
  useNavHeading("Students");
  return (
    <Layout title="Admin Dash | Student diwan">
      <DashLayout children={<MainSection />}  hideAvatarList={true}/>
    </Layout>
  );
};

export default Dash;
