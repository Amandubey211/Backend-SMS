import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
const SpeedGrade = () => {
  const selectedAssignmentName = useSelector(
    (store) => store.common.user.subjectInfo.selectedAssignmentName
  );

  useNavHeading(selectedAssignmentName, "Speed Grade");

  return (
    <Layout title={`Speed Grade - ${selectedAssignmentName} | Student Diwan`}>
      
      <DashLayout children={<MainSection />} hideSearchbar={true} />
     
    </Layout>
  );
};

export default SpeedGrade;
