import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import StudentGradesAccordion from "./StudentGradesAccordion.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
const GradeChild = () => {
  useNavHeading("My Child", "Grades");
  return (
    <>
      <Layout title="Grades">
        <ParentDashLayout hideAvatarList={true}>
          <StudentGradesAccordion />
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default GradeChild;
