import React from "react";
import TeacherBtnLogo from "../../Assets/HomeAssets/TeacherBtnLogo.png";

import StudentBtnLogo from "../../Assets/HomeAssets/StudentBtnLogo.png";
import ParentBtnLogo from "../../Assets/HomeAssets/ParentBtnLogo.png";
import { NavLink } from "react-router-dom";
import Logo from "../../Components/Common/Logo";

const HomeLeft = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 w-full">
      <div className="absolute top-0 right-0 p-6">
        <Logo />
      </div>

      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-full max-w-xl space-y-4">
          <h1 className="text-3xl font-bold ">Welcome to the LMS!</h1>
          <p className="text-gray-600">Choose an account type to proceed:</p>

          <NavLink
            to="/stafflogin"
            className="bg-white flex justify-between items-center shadow-md rounded-lg p-4 hover:bg-gray-200 transition hover:cursor-pointer duration-300"
          >
            <div className="flex gap-2">
              <div className="h-16 w-16">
                <img src={TeacherBtnLogo} alt="teacherAccessLogo" />
              </div>
              <div className="flex items-center">
                <div>
                  <h2 className="text-xl font-semibold">Teacher Account</h2>
                  <p className="text-gray-600">
                    I’m an Instructor/School Admin/IT Specialist
                  </p>
                </div>
              </div>
            </div>
            <span className="text-gray-600 text-2xl">&rarr;</span>
          </NavLink>

          <NavLink
            to="/studentlogin"
            className="bg-white flex justify-between items-center shadow-md rounded-lg p-4 hover:bg-gray-200 transition hover:cursor-pointer duration-300"
          >
            <div className="flex gap-2">
              <div className="h-16 w-16">
                <img src={StudentBtnLogo} alt="StudentAccessLogo" />
              </div>
              <div className="flex items-center">
                <div>
                  <h2 className="text-xl font-semibold">Student Account</h2>
                  <p className="text-gray-600">I’m a Student</p>
                </div>
              </div>
            </div>
            <span className="text-gray-600 text-2xl">&rarr;</span>
          </NavLink>

          <NavLink
            to="/parentlogin"
            className="bg-white flex justify-between items-center shadow-md rounded-lg p-4 hover:bg-gray-200 transition hover:cursor-pointer duration-300"
          >
            <div className="flex gap-2">
              <div className="h-16 w-16">
                <img src={ParentBtnLogo} alt="teacherAccessLogo" />
              </div>
              <div className="flex items-center">
                <div>
                  <h2 className="text-xl font-semibold">Parent Account</h2>
                  <p className="text-gray-600">I’m a Parent/Legal Guardian</p>
                </div>
              </div>
            </div>
            <span className="text-gray-600 text-2xl">&rarr;</span>
          </NavLink>

          <p className="text-gray-600 text-sm mt-4 ">
            By signing in, you agree to our Privacy Policy, Terms of Use and
            Cookie Policy.
          </p>
          <p className="text-gray-600 text-sm">
            ©The Student Diwan. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeLeft;
