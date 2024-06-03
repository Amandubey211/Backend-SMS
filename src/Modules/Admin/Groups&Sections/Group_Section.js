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
  const dispatch = useDispatch();

  useNavHeading(cid, "Sections & Groups");

  useEffect(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);
  return (
    <Layout title="Group & Section | Student diwan">
      <DashLayout>
        <MainSection />
      </DashLayout>
    </Layout>
  );
};

export default Group_Section;
