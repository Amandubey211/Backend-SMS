import React, { useEffect } from "react";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import DashLayout from "../../../../../../Components/Admin/AdminDashLayout";
import Layout from "../../../../../../Components/Common/Layout";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const ViewPage = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );
  const subjectName = useSelector(
    (store) => store.common.user.subjectInfo.selectedSubjectName
  );
  useNavHeading(className, subjectName);

  return (
    <div>
      <Layout title={`Page View | Student Diwan`}>
        <DashLayout hideSearchbar={true}>
          <MainSection />
        </DashLayout>
      </Layout>
    </div>
  );
};

export default ViewPage;
