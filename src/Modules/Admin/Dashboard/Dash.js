import React, { useEffect } from "react";
import MainSection from "./MainSection.js";
import Layout from "../../../Components/Common/Layout.js";
import DashLayout from "../../../Components/Admin/AdminDashLayout.js";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading .js";
import { useDispatch, useSelector } from "react-redux";
import { getMyRolePermissionsThunk } from "../../../Store/Slices/Common/RBAC/rbacThunks.js";

const Dash = () => {
  const { role, permissions: mypermission } = useSelector(
    (store) => store.common.auth
  );
  console.log(mypermission, "lllllll");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyRolePermissionsThunk());
  }, []);
  const formattedRole =
    role?.charAt(0)?.toUpperCase() + role?.slice(1)?.toLowerCase();
  useNavHeading(formattedRole);

  return (
    <Layout title={`${formattedRole} Dash | Student Diwan`}>
      <DashLayout children={<MainSection />} hideAvatarList={true} />
    </Layout>
  );
};

export default Dash;
