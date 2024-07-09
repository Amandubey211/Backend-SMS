import { FaUsers } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";

import { ImExit } from "react-icons/im";
import { FaSquareXmark } from "react-icons/fa6";

export const navData = [
  {
    label: " Total Students",
    value: "106,74",
    bgColor: "bg-[#f6ecf6]",
    textColor: "text-purple-700",
    icon: <FaUsers className="text-[#564FFD]" />,
    iconColor: "text-[#564FFD]",
  },
  {
    label: "Present Today",
    // url: "/teachers",
    value: "674",
    bgColor: "bg-[#e9f8eb]",
    textColor: "text-green-700",
    icon: <IoCheckbox className="text-[#22c55e]" />,
    iconColor: "text-green",
  },
  {
    label: "Absent Today",
    value: "167",
    bgColor: "bg-[#f7e5e5]",
    textColor: "black",
    icon: <FaSquareXmark className="text-[#EA2058]" />,
    iconColor: "text-[#F09F04]",
  },
  {
    label: "Leave Today",
    value: "20",
    bgColor: "bg-[#f7ecf4]",
    textColor: "text-pink-700",
    icon: <ImExit className="text-[#EA2058]" />,
    iconColor: "text-[#EA2058]",
  },
];
