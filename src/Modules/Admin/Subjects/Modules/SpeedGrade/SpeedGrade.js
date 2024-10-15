import React from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
const SpeedGrade = () => {
  const selectedAssignmentName = useSelector(
    (store) => store.common.user.selectedSectionName
  );

  useNavHeading(selectedAssignmentName, "Speed Grade");

  return (
    <Layout title={`Speed Grade - ${selectedAssignmentName} | Student Diwan`}>
      <DashLayout children={<MainSection />} hideSearchbar={true} />
      {/* <div className="flex w-full h-full">
      <SideMenubar />
      </div> */}
    </Layout>
  );
};

export default SpeedGrade;
