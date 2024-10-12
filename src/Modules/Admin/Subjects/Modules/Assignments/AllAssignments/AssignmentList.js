import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const AssignmentList = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  const subjectName = useSelector(
    (store) => store.common.user.subjectInfo.selectedSubjectName
  );
  useNavHeading(className, subjectName);
  return (
    <Layout title={`Assignment List | Student Diwan`}>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default AssignmentList;
