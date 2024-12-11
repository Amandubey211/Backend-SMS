import { FaDollarSign, FaBook, FaBuilding } from "react-icons/fa";

export const earningCardsData = [
  {
    title: "Total Revenue",
    value: "2,67,634 QAR",
    comparison: "2,34,567 QAR last month",
    percentage: 3.5,
    icon: <FaDollarSign />,
    trend: "up",
  },
  {
    title: "Tuition Fees",
    value: "2,67,634 QAR",
    comparison: "2,34,567 QAR last month",
    percentage: 3.5,
    icon: <FaBook />,
    trend: "up",
  },
  {
    title: "Hostel Fees",
    value: "2,67,634 QAR",
    comparison: "2,34,567 QAR last month",
    percentage: -3.5,
    icon: <FaBuilding />,
    trend: "down",
  },
];
