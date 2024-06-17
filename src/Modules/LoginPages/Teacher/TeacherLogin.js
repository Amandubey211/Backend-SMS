import React from "react";
import TeacherLoginForm from "./TeacherLoginForm";
import TeacherLoginBanner from "../../../Assets/TeacherAssets/TeacherLoginBanner.png";
import Layout from "../../../Components/Common/Layout";
const TeacherLogin = () => {
  return (
    <Layout title="Teacher Login | Student diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        <div className="md:col-span-7  flex items-center justify-center">
          <TeacherLoginForm />
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

export default TeacherLogin;
