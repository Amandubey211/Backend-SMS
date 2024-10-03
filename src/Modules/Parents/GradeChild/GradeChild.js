import React, { useState } from "react";
import Layout from "../../../Components/Common/Layout";
import ParentDashLayout from "../../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import StudentGradesAccordion from "./StudentGradesAccordion.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useTranslation } from "react-i18next";

const GradeChild = () => {
  const { t } = useTranslation('prtChildrens');
  useNavHeading(t("My Child"), t("Grades"));
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
