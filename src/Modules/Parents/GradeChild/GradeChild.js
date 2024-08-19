import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import StudentGradesAccordion from "./StudentGradesAccordion.js";

const GradeChild = () => {
 
  return (
    <>
      <Layout title="Grades">
        <ParentDashLayout hideAvatarList={true}>
  <StudentGradesAccordion/>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default GradeChild;
