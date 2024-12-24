import { FaDollarSign, FaBook, FaBuilding } from "react-icons/fa";

export const earningCardsData = [
  {
    title: "Total Revenue",
    value: "2,67,634 QAR",
    percentage: 3.5,
    icon: <FaDollarSign />,
    trend: "up",
  },
  {
    title: "Unpaid Fees",
    value: "2,67,634 QAR",
    percentage: 3.5,
    icon: <FaBook />,
    trend: "up",
  },
  {
    title: "Remaining Partial Paid",
    value: "2,67,634 QAR",
    percentage: -3.5,
    icon: <FaBuilding />,
    trend: "down",
  },
];
