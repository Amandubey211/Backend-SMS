// src/Modules/Admin/Verification/StudentList.js

import React from "react";
import { useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";
import RejectStudents from "./RejectStudents";
import UnverifiedStudents from "./UnverifiedStudents";
import PendingForms from "./PendingForms";

const StudentList = () => {
  const { activeTab } = useSelector((state) => state.admin.verification);

  return (
    <div className="container mx-auto p-5">
      {/* Top navigation for tabs */}
      <TopNavigation />

      {/* Render based on active tab */}
      {activeTab === "unverified" ? <UnverifiedStudents /> : activeTab === "Pending" ? <PendingForms />: <RejectStudents />}
    </div>
  );
};

export default StudentList;
