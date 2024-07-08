import React from "react";
import StudentSignUpForm from "./StudentSignUpForm";
import Layout from "../../../../Components/Common/Layout";

const StudentSignUp = () => {
  return (
    <Layout title="Student SignUp | Student diwan">
      <div className=" flex items-center justify-center">
        <StudentSignUpForm />
      </div>
    </Layout>
  );
};

export default StudentSignUp;
