import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../Components/Common/Logo";
import HomeData from "./HomeData/HomeData";
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

          {HomeData.map(({ path, imgSrc, altText, title, description }) => (
            <NavLink
              key={path}
              to={path}
              className="bg-white flex justify-between items-center shadow-md rounded-lg p-4 hover:bg-gray-200 transition hover:cursor-pointer duration-300"
            >
              <div className="flex gap-2">
                <div className="h-16 w-16">
                  <img src={imgSrc} alt={altText} />
                </div>
                <div className="flex items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <p className="text-gray-600">{description}</p>
                  </div>
                </div>
              </div>
              <span className="text-gray-600 text-2xl">&rarr;</span>
            </NavLink>
          ))}

          <p className="text-gray-600 text-sm mt-4">
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
