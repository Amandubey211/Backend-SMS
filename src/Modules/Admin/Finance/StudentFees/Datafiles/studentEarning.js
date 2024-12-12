// src/Modules/Admin/Finance/StudentFees/Datafiles/studentEarning.js
import { FaUserGraduate, FaWallet, FaBookReader } from "react-icons/fa";

export const studentCardsData = [
  {
    title: "Total Fees Collected",
    value: "1,50,000 QAR",
    comparison: "Compared to (1,20,000 QAR last month)",
    percentage: 25,
    icon: <FaUserGraduate />,
    trend: "up",
  },
  {
    title: "Due Fees",
    value: "30,000 QAR",
    comparison: "Compared to (20,000 QAR last month)",
    percentage: 50,
    icon: <FaWallet />,
    trend: "up",
  },
  {
    title: "Outstanding Balances",
    value: "20,000 QAR",
    comparison: "Compared to (25,000 QAR last month)",
    percentage: -20,
    icon: <FaBookReader />,
    trend: "down",
  },
];
