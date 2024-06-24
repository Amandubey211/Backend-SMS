import { RiBookOpenLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
export const cardData = [
  {
    label: "Due Fees",
    value: "2,210",
    bgColor: "bg-rose-50",
    textColor: "text-purple-700",
    icon: <CiMoneyBill />,
    iconBackground: "bg-[#ffffff]",
  },
  {
    label: "Upcoming Fees",
    // url: "/teachers",
    value: "10",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    icon: <RiBookOpenLine  />,
    iconBackground: "bg-[#ffffff]",
  },
  {
    label: "Result Published",
    value: "12",
    bgColor: "bg-emerald-100",
    textColor: "text-yellow-700",
    icon: <RiCalendarCheckLine />,
    iconBackground: "bg-[#ffffff]",
  },
  {
    label: "Total Expense",
    value: "2,500",
    bgColor: "bg-rose-100",
    textColor: "text-pink-400",
    icon: <RiMoneyDollarBoxFill />,
    iconBackground: "bg-rose-500",
  },
];
