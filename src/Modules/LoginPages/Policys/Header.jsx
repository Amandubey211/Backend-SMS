// src/Components/Common/Header.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./../../../Components/Common/Logo";
import { IoIosArrowRoundBack } from "react-icons/io";
const Header = ({ title }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="flex items-center justify-between p-3  bg-white shadow-md sticky top-0 z-50"
    >
      <div className="flex items-center px-16">
        <NavLink
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700  items-center flex gap-2"
        >
          <div className="rounded-full border text-xl w-6 h-6 flex justify-center items-center">
            <IoIosArrowRoundBack />
          </div>
          <span>LMS Home</span>
        </NavLink>
        {/* <div className="ml-4"><Logo /></div> */}
      </div>
      <div>
        <Logo />
      </div>
    </motion.header>
  );
};

export default Header;
