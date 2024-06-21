import React from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const QuizzList = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  const subjectName = useSelector((store) => store.Common.selectedSubject);

  useNavHeading(className, subjectName);
  return (
  <Layout title={`Quiz List | Student Diwan`}>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
    </Layout>
  );
};

export default QuizzList;
