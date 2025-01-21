import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";

const Quizzes = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  const subjectName = useSelector(
    (store) => store.common.user.subjectInfo.selectedSubjectName
  );
  useNavHeading(className, subjectName);
  return (
    <Layout title="Quiz | student diwan">
      <ProtectedSection requiredPermission={''}>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
      </ProtectedSection>
    </Layout>
  );
};

export default Quizzes;
