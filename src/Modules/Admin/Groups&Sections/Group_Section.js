import React from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import MainSection from "./MainSection";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../../Redux/Slices/Common/SidebarSlice";

const Group_Section = () => {
  const className = useSelector((store) => store.Common.selectedClass);

  useNavHeading(className, "Sections & Groups");

  const dispatch = useDispatch();
  dispatch(toggleSidebar());

  return (
    <Layout title={`${className} | Group & Section | Student diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Group_Section;
