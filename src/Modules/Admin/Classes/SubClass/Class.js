import React, { useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import MainSection from "./MainSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetClassDetails from "../../../../Hooks/AuthHooks/Staff/Admin/usegetClassDetails";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";

const Class = () => {
  const className = useSelector((store) => store.Common.selectedClass);
  useNavHeading(className);

  const { fetchClassDetails } = useGetClassDetails();
  const { cid } = useParams(); // Destructure to get the class ID

  useEffect(() => {
    fetchClassDetails(cid);
  }, [cid, fetchClassDetails]); // Add fetchClassDetails to the dependency array

  return (
    <Layout title={`${className} | Student diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />;
    </Layout>
  );
};

export default Class;
