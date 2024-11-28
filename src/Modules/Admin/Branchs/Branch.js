import React from "react";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useSelector } from "react-redux";
import BranchTable from "./BranchTable.js";

const Branch = () => {
  const role = useSelector((store) => store.common.auth.role);
  useNavHeading(role, `Branch`);
  return (
    <Layout title={` Branch | Student Diwan`}>
      <DashLayout children={<BranchTable />} />
    </Layout>
  );
};

export default Branch;
