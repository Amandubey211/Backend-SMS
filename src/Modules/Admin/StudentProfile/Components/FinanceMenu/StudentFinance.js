import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import FinanceCard from "./FinanceCard";
import FinanceTable from "./FinanceTable";

const StudentFinance = ({ student }) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="w-full border p-4">
          <div className="flex flex-row gap-3 p-4">
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Total Unpaid Fees"
              value={student.finance.totalUnpaidFees}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Parents Account Total Paid"
              value={student.finance.parentsAccountTotalPaid}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
            <FinanceCard
              icon={<MdOutlineLocationOn className="text-red-300 text-2xl" />}
              label="Total Paid Fees"
              value={student.finance.totalPaidFees}
              buttonLabel="Message"
              onButtonClick={() => console.log("Message clicked")}
            />
          </div>
        </div>
        <FinanceTable feesDetails={student.finance.feesDetails} />
      </div>
    </>
  );
};

export default StudentFinance;






