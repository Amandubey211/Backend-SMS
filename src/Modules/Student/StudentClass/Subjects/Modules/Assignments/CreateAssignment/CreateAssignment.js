import React from "react";
// import Layout from "../../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import SideMenubar from "../../../../../../../Components/Student/SideMenubar";
import Layout from "../../../../../../../Components/Common/Layout";
// import SideMenubar from "../../../../../../Components/Admin/SideMenubar";

const CreateAssignment = () => {
  return (
    <Layout>
      <div className="flex ">
        <SideMenubar />
        <div className="w-full">
          <MainSection />
        </div>
      </div>
    </Layout>
  );
};

export default CreateAssignment;
