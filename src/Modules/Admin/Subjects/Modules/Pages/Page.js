import React from "react";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";

const Page = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  const subjectName = useSelector(
    (store) => store.common.user.subjectInfo.selectedSubjectName
  );
  useNavHeading(className, subjectName);
  return (
    <div>
      <Layout title={`Pages | Student Diwan`}>
        <DashLayout children={<MainSection />} hideSearchbar={true} />
      </Layout>
    </div>
  );
};

export default Page;
