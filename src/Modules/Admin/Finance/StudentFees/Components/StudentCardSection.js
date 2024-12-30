import React, { useEffect } from "react";
import { FaDollarSign, FaWallet, FaClipboard, FaExclamationCircle } from "react-icons/fa"; 
import StudentCard from "./StudentCard";
import { fetchStudentFeeCardData } from "../../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { useDispatch, useSelector } from "react-redux";


const StudentCardSection = () => {
  const { stdFeesCardData } = useSelector((state) => state.admin.studentFees);
  const dispatch = useDispatch();


  const studentCardsData = [
    {
      title: "Total Collected Fees",
      value: `${stdFeesCardData?.totalCollected || 0} QAR`,
      icon: <FaDollarSign />, // Appropriate icon for collected fees
    },
    {
      title: "Total Due Fees",
      value: `${stdFeesCardData?.totalDue || 0} QAR`,
      icon: <FaWallet />, // Icon for due fees or wallet
    },
    {
      title: "Total Outstanding Balance",
      value: `${stdFeesCardData?.totalOutstanding || 0} QAR`,
      icon: <FaExclamationCircle />, // Icon for outstanding balance (exclamation for pending)
    },
  ];

  useEffect(() => {
    dispatch(fetchStudentFeeCardData());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 place-items-center">
      {studentCardsData?.map((item, index) => (
        <StudentCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StudentCardSection;
