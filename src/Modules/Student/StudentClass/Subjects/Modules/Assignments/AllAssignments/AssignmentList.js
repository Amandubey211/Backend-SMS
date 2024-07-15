import React from "react";
// import Layout from "../../../../../../Components/Common/Layout";
// import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../../../../Components/Student/StudentDashLayout";
import Layout from "../../../../../../../Components/Common/Layout";
import { useSelector } from "react-redux";

const AssignmentList = () => {
    const {cid,sid}  = useParams()
    const subjectName = useSelector((store) => store.Common.selectedSubjectName);
    const className = useSelector((store) => store.Common.selectedClassName);

    // useNavHeading(cid,sid)
    useNavHeading(className, subjectName);

  return (
    <Layout title={`Assignment List | Student Diwan`}>
      <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default AssignmentList;
