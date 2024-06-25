import React, { useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import useGetClassDetails from "../../../../Hooks/AuthHooks/Staff/Admin/Class/usegetClassDetails";

const Class = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  useNavHeading(className);
  console.log("Class List Rendered")

  const { fetchClassDetails } = useGetClassDetails();
  const { cid } = useParams();

  useEffect(() => {
    fetchClassDetails(cid);
  }, []);

  return (
    <Layout title={`${className} | Student diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default Class;
