import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import AssignmentList from "../../../Components/Parents/Grade/AssignmentList.js";
import GradeSummary from "../../../Components/Parents/Grade/GradeSummary.js";

const GradeChild = () => {
 
  return (
    <>
      <Layout title="Grades">
        <ParentDashLayout hideAvatarList={true}>
        <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <AssignmentList />
      </div>
      <div>
        <GradeSummary />
      </div>
    </div>
  </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default GradeChild;
