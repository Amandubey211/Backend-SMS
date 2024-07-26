import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import FinanceCard from "./FinanceCard";
import FinanceTable from "./FinanceTable";
import { PiMoneyBold } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
const StudentFinance = ({ student }) => {
  return (
      <>
      <div className="flex flex-col">
        <div className="w-full border p-4">
          <div className="flex flex-row gap-3 p-4 ">
           <div className="w-[18rem]">
           <FinanceCard
              icon={<PiMoneyBold className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />}
              label="Total Unpaid Fees"
              value={student?.finance?.totalUnpaidFees | 0}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
           </div>
            <FinanceCard
              icon={<FaUserFriends className="text-red-300 text-[2.5rem] font-bold border border-red-300 p-2 rounded-full" />}
              label="Parents Account Total Paid"
              value={student?.finance?.parentsAccountTotalPaid | 0}
              onButtonClick={() => console.log("Message clicked")}
              buttonLabel={null}
            />
            <FinanceCard
              icon={<PiMoneyBold className="text-green-300 text-[2.5rem] font-bold border border-green-300 p-2 rounded-full" />}
              label="Total Paid Fees"
              value={student?.finance
                ?.totalPaidFees | 0}
                buttonLabel={null}
              onButtonClick={() => console.log("Message clicked")}
            />
          </div>
        </div>
        <FinanceTable feesDetails={student?.finance
          ?.feesDetails} />
      </div>
    </>
  );
};

export default StudentFinance;






