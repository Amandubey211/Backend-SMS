import React from "react";
import StudentRightSide from "../../../../Assets/StudentAssets/StudentRightSide.png";
import StudentLoginForm from "./StudentLoginForm";
import Layout from "../../../../Components/Common/Layout";
import QIDLogin from "./QIDLogin";
import { useSelector } from "react-redux";
const StudentLogin = () => {
  const Auth = useSelector((store) => store.Auth.isLoggedIn);

  return (
    <Layout title="Student Login | Student diwan">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        <div className="md:col-span-7  flex items-center justify-center">
          {Auth ? <QIDLogin /> : <> {<StudentLoginForm />}</>}
        </div>
        <div className="md:col-span-5 relative">
          <div className="max-h-screen overflow-hidden">
            <img
              src={StudentRightSide}
              alt="Placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentLogin;
