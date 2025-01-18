import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useSelector } from "react-redux";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";

const Attendance = () => {
  const className = useSelector(
    (store) => store.common.user.classInfo.selectedClassName
  );

  useNavHeading(className, "Attendance");
  return (
    <div>
      <Layout title={`${className}  Attendance | Student diwan  `}>
        <ProtectedSection requiredPermission="viewAttendence">
        <DashLayout children={<MainSection />} hideAvatarList={true} />
        </ProtectedSection>
      </Layout>
    </div>
  );
};

export default Attendance;
