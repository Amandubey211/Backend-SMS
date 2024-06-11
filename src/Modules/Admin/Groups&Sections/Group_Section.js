import React, { useEffect } from "react";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import MainSection from "./MainSection";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../../Redux/Slices/SidebarSlice";

const Group_Section = () => {
  const { cid } = useParams();
  useNavHeading(cid, "Sections & Groups");
  const dispatch = useDispatch();
  dispatch(toggleSidebar());
 
  

  return (
    <Layout title={ `${cid} | Group & Section | Student diwan`}>
      <DashLayout children={  <MainSection />} hideAvatarList={true}/>
      
  
    </Layout>
  );
};

export default Group_Section;
