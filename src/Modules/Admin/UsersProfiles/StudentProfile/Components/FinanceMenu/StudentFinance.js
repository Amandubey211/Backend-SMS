import React, { useEffect, useState } from "react";
import FinanceCard from "./FinanceCard";
import FinanceTable from "./FinanceTable";
import { PiMoneyBold } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentFinance } from "../../../../../../Store/Slices/Admin/Users/Students/student.action";
import { useTranslation } from "react-i18next";
import Spinner from "../../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const StudentFinance = ({ student }) => {
  const { t } = useTranslation('admAccounts');
  const { cid } = useParams();
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const { feesDetails, loading } = useSelector((store) => store.admin.all_students);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudentFinance(cid)).then(() => {
      setTotalUnpaidFees(feesDetails?.totalUnpaidFees);
      setTotalPaidFees(feesDetails?.totalPaidFees);
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex w-full h-[90vh] flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
    <ProtectedSection requiredPermission={"viewstudentfinance"}  title={"Student Fees"}>
      <div className="flex flex-col">
        <div className="w-full border p-4">
          <div className="flex flex-row gap-3 p-4">
            <div className="w-[18rem]">
              <FinanceCard
                icon={
                  <PiMoneyBold className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />
                }
                label={t("Total Unpaid Fees")}
                value={feesDetails?.totalUnpaidFees}
                buttonLabel={null}
                
              />
            </div>
            <FinanceCard
              icon={
                <FaUserFriends className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />
              }
              label={t("Parents Account Total Paid")}
              value={feesDetails?.totalPaidFeesByParent || "0 QR"}
             
              buttonLabel={null}
            />
            <FinanceCard
              icon={
                <PiMoneyBold className="text-green-300 text-[2.5rem] font-bold border border-green-300 p-2 rounded-full" />
              }
              label={t("Total Paid Fees")}
              value={feesDetails?.totalPaidFees}
              buttonLabel={null}
              
            />
          </div>
        </div>
        <FinanceTable />
      </div>
      </ProtectedSection>
    </>
  );
};

export default StudentFinance;
