import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useParams } from "react-router-dom";

const Attendance = () => {
  const { cid } = useParams();

  useNavHeading(cid, "Attendance");
  return (
    <div>
      <Layout>
        <DashLayout children={<MainSection />} hideAvatarList={true} />
      </Layout>
    </div>
  );
};

export default Attendance;
