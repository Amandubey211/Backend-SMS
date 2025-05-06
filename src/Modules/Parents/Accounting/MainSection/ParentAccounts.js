import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../Components/Common/ParentLayout";
import { FaExclamationCircle, FaWallet } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FinanceTableSkeleton } from "../../Skeletons";

// Dummy accounting data for testing UI
const dummyAccountingData = {
  fees: [
    {
      id: 1,
      childName: "John Doe",
      feeType: "Tuition",
      paidBy: "John Doe",
      dueDate: "2025-01-15",
      amount: "1500",
      status: "Unpaid",
    },
    {
      id: 2,
      childName: "John Doe",
      feeType: "Lab Fee",
      paidBy: "John Doe",
      dueDate: "2025-01-20",
      amount: "200",
      status: "Partial",
    },
    {
      id: 3,
      childName: "Jane Smith",
      feeType: "Tuition",
      paidBy: "Jane Smith",
      dueDate: "2025-01-15",
      amount: "1400",
      status: "Unpaid",
    },
    {
      id: 4,
      childName: "Mark Johnson",
      feeType: "Tuition",
      paidBy: "Mark Johnson",
      dueDate: "2025-01-15",
      amount: "1600",
      status: "Paid",
    },
    {
      id: 5,
      childName: "Jane Smith",
      feeType: "Transport",
      paidBy: "Jane Smith",
      dueDate: "2025-01-25",
      amount: "150",
      status: "Unpaid",
    },
    {
      id: 6,
      childName: "Alice Brown",
      feeType: "Tuition",
      paidBy: "Alice Brown",
      dueDate: "2025-02-01",
      amount: "1300",
      status: "Unpaid",
    },
    {
      id: 7,
      childName: "Bob Martin",
      feeType: "Transport",
      paidBy: "Bob Martin",
      dueDate: "2025-02-10",
      amount: "180",
      status: "Partial",
    },
  ],
  totalUnpaidFees: 0,
  totalPaidFees: 0,
};

const AccountingSection = () => {
  const { t } = useTranslation("prtFinance");
  const navigate = useNavigate();

  // Use dummy data directly
  const accountingData = dummyAccountingData;

  // Extract fees array from dummy data
  const fees = useMemo(() => accountingData?.fees ?? [], [accountingData]);

  // Group fees by childName for all fee records.
  // For each child, pendingFees is the sum of amounts for fees with status "Unpaid" or "Partial"
  const groupedFees = useMemo(() => {
    const groups = {};
    fees.forEach((fee) => {
      const childName = fee.childName || "Unknown Child";
      
      if (!groups[childName]) {
        groups[childName] = 0;
      }
      // Only add fee amount if the status is Unpaid or Partial
      if (fee.status === "Unpaid" || fee.status === "Partial") {
        groups[childName] += parseFloat(fee.amount) || 0;
      }
    });
    // Convert groups object to an array of objects with childName and pendingFees
    return Object.keys(groups).map((childName) => ({
      childName,
      pendingFees: groups[childName].toFixed(2),
    }));
  }, [fees]);

  // For this dummy version, loading and error are false/null
  const loading = false;
  const error = null;

  // Navigation handler for "See All" / "View Details"
  const handleNavigate = () => {
    navigate("/parentfinance");
  };

  return (
      <div className="py-1 px-2 pt-0 w-full">
        {/* Header: Title and conditional button */}
        <div className="flex justify-between items-center mt-5">
          <h2 className="text-xl font-semibold text-gray-600 text-center">
            {t("Fees Pending")}
          </h2>
          {groupedFees.length > 0 && !error && (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 ease-in-out 
                        text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
                        hover:bg-gradient-to-r hover:from-[#7F35CD] hover:to-[#C83B62] hover:shadow-md"
              onClick={handleNavigate}
            >
              {groupedFees.length === 1 ? t("View Details") : t("View All")}
            </button>
          )}
        </div>

        <div className="pt-5 pb-2 flex items-center justify-center w-full">
          <div className="rounded-md w-full overflow-x-hidden">
            {loading ? (
              <FinanceTableSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center p-10">
                <FaExclamationCircle className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">
                  {error ? `${error}: ` : ""}
                  {t("Unable to fetch Fees")}
                </p>
              </div>
            ) : groupedFees.length === 0 ? (
              <div className="flex flex-col items-center p-10">
                <FaWallet className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">{t("No Fees Yet")}</p>
              </div>
            ) : (
              // Row-wise list of cards showing each child's name and pending fees.
              // If more than 3 children exist, the container will have a fixed max height with scroll on hover.
              <div
                className={`space-y-2 ${
                  groupedFees.length > 3
                    ? "max-h-[210px] overflow-y-hidden hover:overflow-y-auto"
                    : "max-h-[210px]"
                }`}
              >
                {groupedFees.map((group) => (
                  <div
                    key={group.childName}
                    className="flex items-center justify-between border border-gray-300 rounded-md bg-white shadow-sm p-4"
                  >
                    <div className="flex items-center">
                      <FaWallet className="text-3xl text-[#C83B62] mr-4" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {group.childName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {group.pendingFees} QAR
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default AccountingSection;
