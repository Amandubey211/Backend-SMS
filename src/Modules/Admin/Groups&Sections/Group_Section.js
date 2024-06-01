import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";

const Group_Section = () => {
  return (
    <Layout>
      <DashLayout
        children={
          <div className="flex justify-center bg-purple-200 items-center h-screen">
            <h1>Group and Section Page</h1>
          </div>
        }
      />
    </Layout>
  );
};

export default Group_Section;
