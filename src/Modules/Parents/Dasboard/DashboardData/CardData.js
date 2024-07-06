import { RiBookOpenLine } from "react-icons/ri";
import { CiMoneyBill } from "react-icons/ci";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
export const cardData = [
  {
    label: "Due Fees",
    value: "0",
    bgColor: "bg-rose-200",
    textColor: "text-rose-500",
    icon: <CiMoneyBill />,
    iconBackground: "bg-rose-800",
  },
  {
    label: "Upcoming Events",
    value: "0",
    bgColor: "bg-green-200",
    textColor: "text-green-500",
    icon: <RiBookOpenLine />,
    iconBackground: "bg-green-800",
  },
  {
    label: "Result Published",
    value: "0",
    bgColor: "bg-teal-100",
    textColor: "text-teal-700",
    icon: <RiCalendarCheckLine />,
    iconBackground: "bg-teal-400",
  },
  {
    label: "Total Expense",
    value: "0",
    bgColor: "bg-purple-200",
    textColor: "text-purple-400",
    icon: <RiMoneyDollarBoxFill />,
    iconBackground: "bg-purple-500",
  },
];
