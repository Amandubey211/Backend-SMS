import React from "react";
import TeacherLoginBanner from "../../../Assets/TeacherAssets/TeacherLoginBanner.jpeg";
import Layout from "../../../Components/Common/Layout";
import StaffLoginForm from "./StaffLoginForm";
const StaffLogin = () => {
  return (
    <Layout title="Staff Login | Student diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        <div className="md:col-span-7  flex items-center justify-center">
          <StaffLoginForm />
        </div>
        <div className="md:col-span-5 relative">
          <div className="max-h-screen overflow-hidden">
            <img
              src={TeacherLoginBanner}
              alt="Placeholder"
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffLogin;
