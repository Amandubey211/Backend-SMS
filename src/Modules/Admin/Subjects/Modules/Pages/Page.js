import React from "react";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Page = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  const subjectName = useSelector((store) => store.Common.selectedSubject);

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
