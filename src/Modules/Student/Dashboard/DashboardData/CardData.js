import { FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { SiAuth0 } from "react-icons/si";
export const cardData = [
  {
    label: "Upcoming Exam",
    value: "10",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    icon: <FaUsers />,
    iconBackground: "bg-[#564FFD]",
  },
  {
    label: "Due Fees",
    // url: "/teachers",
    value: "674",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: <FaChalkboardTeacher />,
    iconBackground: "bg-[#23BD331A]",
  },
  {
    label: "Event",
    value: "12",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    icon: <MdFamilyRestroom />,
    iconBackground: "bg-[#F09F04]",
  },
  {
    label: "Notice",
    value: "20",
    bgColor: "bg-pink-100",
    textColor: "text-pink-700",
    icon: <SiAuth0 />,
    iconBackground: "bg-[#EA2058]",
  },
];
