import React from "react";

import MainSection from "./MainSection";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";

const Page = () => {

  const { subjectName } = useSelector((store) => store?.student?.studentSubject?.subject);
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className=classData?.className;

  // useNavHeading(cid, sid);
  useNavHeading(className, subjectName);

  return (
    <div>
      <Layout title={`Pages | Student Diwan`}>
        <StudentDashLayout children={<MainSection />} hideSearchbar={true} />
      </Layout>
    </div>
  );
};

export default Page;
