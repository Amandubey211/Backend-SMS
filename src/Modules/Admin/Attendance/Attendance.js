import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";

const Attendance = () => {
  const className = useSelector((store) => store.Common.selectedClass);

  useNavHeading(className, "Attendance");
  return (
    <div>
      <Layout title={`${className}  Attendance | Student diwan  `}>
        <DashLayout children={<MainSection />} hideAvatarList={true} />
      </Layout>
    </div>
  );
};

export default Attendance;
