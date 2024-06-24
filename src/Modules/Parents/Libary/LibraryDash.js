import React from "react";

import Layout from "../../../Components/Common/Layout.js";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout.js";

import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import ParentSection from "./MainSection.js";
const LibraryDash = () => {
  useNavHeading("Class 9");
  return (
    <Layout title="Parents | Student diwan">
      <ParentDashLayout children={<ParentSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default LibraryDash;
