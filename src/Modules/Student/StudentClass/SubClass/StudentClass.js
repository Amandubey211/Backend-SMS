import React from "react";
import Layout from "../../../../Components/Common/Layout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import StudentDashLayout from "../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const StudentClass = () => {
  const className = useSelector((store) => store.Common.selectedClassName);
  console.log(className)
  useNavHeading(className);

  return (
    <Layout title={`My Class | Student diwan`}>
       {/* hideAvatarList={true} */}
      <StudentDashLayout children={<MainSection />} />;
    </Layout>
  );
};

export default StudentClass;
