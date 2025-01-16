import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const NoDataFound = ({
  title = "Data",
  desc = "",
  icon: Icon = FaExclamationTriangle,
  iconColor = "text-gray-500",
  textColor = "text-gray-500",
  bgColor = "bg-white",
  animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center w-full h-full`}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
    >
      <Icon className={`w-12 h-12 mb-3 `} />
      <p className={`text-lg font-semibold  text-center`}>
        No {title} available.
      </p>

      <p className={`text-gray-600 ${textColor}`}> {desc}</p>
    </motion.div>
  );
};

export default NoDataFound;
