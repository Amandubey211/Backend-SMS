import React, { useEffect } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Student/StudentDashLayout";

import StudentMainSection from "./StudentMainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useDispatch } from "react-redux";
import { studentNotice } from "../../../Store/Slices/Student/Noticeboard/notice.action";
const StudentDash = () => {
  useNavHeading("Students");
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(studentNotice())
  // }, [dispatch]);
  return (
    <Layout title="Student Dashboard">
      <DashLayout children={<StudentMainSection />} />
    </Layout>
  );
};

export default StudentDash;
