import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountingData } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action'; // Redux action to fetch accounting data
import Layout from "../../../../Components/Common/ParentLayout";
import { FaExclamationCircle, FaMoneyBillWave } from "react-icons/fa"; // Icon for error and no data message
import Spinner from "../../../../Components/Common/Spinner"; // Spinner component
import { useTranslation } from "react-i18next"; // Import useTranslation from i18next

// Utility function to get unique filter options from the data (with optional chaining)
const uniqueFilterOptions = (data, key) => {
  return [...new Set(data?.map((item) => item?.[key])?.filter(Boolean))].sort();
};

const AccountingSection = () => {
  const { t } = useTranslation('prtFinance'); // Initialize i18next hook with prtFinance namespace
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone", // Default to show all statuses
  });

  // Redux state for accounting data, now with error message from Redux
  const { accountingData, loading, error } = useSelector((state) => state?.Parent?.dashboard || {});

  // Dispatch action to fetch accounting data on component mount
  useEffect(() => {
    dispatch(fetchAccountingData());
  }, [dispatch]);

  // Check if accountingData exists and has fees data
  const fees = accountingData?.fees ?? [];
  const totalUnpaidFees = accountingData?.totalUnpaidFees ?? "";
  const totalPaidFees = accountingData?.totalPaidFees ?? "";

  // Memoize the filter options inside the component itself
  const classes = useMemo(() => uniqueFilterOptions(fees, "class"), [fees]);
  const sections = useMemo(() => uniqueFilterOptions(fees, "section"), [fees]);
  const feesTypes = useMemo(() => uniqueFilterOptions(fees, "feeType"), [fees]);

  // Apply filters to the fees data, useMemo to optimize the filtered data calculation
  const filteredData = useMemo(() => {
    return fees?.filter((item) => {
      const classCondition = filters?.class === "" || !item?.class || item?.class === filters?.class;
      const sectionCondition = filters?.section === "" || !item?.section || item?.section === filters?.section;
      const feeTypeCondition = !filters?.feeType || item?.feeType === filters?.feeType;
      const statusCondition = filters?.status === "Everyone" || item?.status === filters?.status;
      return classCondition && sectionCondition && feeTypeCondition && statusCondition;
    });
  }, [fees, filters]);

  // Handle navigation using useCallback to prevent re-creation on every render
  const handleNavigate = useCallback(() => {
    navigate("/parentfinance");
  }, [navigate]);

  // Cache and optimize rendering with conditional rendering
  if (loading) {
    return (
      <Layout title={t("Finance")}>
        <div className="p-4">
          {/* Accounting Section Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-600">{t("Finance")}</h2>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto shadow rounded-lg flex flex-col items-center justify-center h-64 text-center">
              <Spinner />
              <p className="text-gray-600">{t("Loading...")}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t("Finance")}>
      <div className="p-4">
        {/* Accounting Section Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-600">{t("Finance")}</h2>
          {!error && filteredData.length > 0 && (
            <button
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
              onClick={handleNavigate}
            >
              {t("See All")}
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="overflow-x-auto shadow rounded-lg">
            {error ? (
              // Error message displayed in the center with an icon and Redux error message
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaExclamationCircle className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">{error}: {t("Failed to fetch finance data")}</p>
              </div>
            ) : filteredData.length === 0 ? (
              // No data available, show icon and message
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">{t("No Fees Yet")}</p>
              </div>
            ) : (
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-[#F9FAFC]">
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Fee Type")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Paid By")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Due Date")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Amount")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Status")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="text-left text-gray-700 bg-white shadow-sm">
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.feeType ?? t("No Fee Type")}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.paidBy ?? "N/A"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.dueDate ?? "N/A"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.amount ?? "N/A"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        <span
                          className={`inline-block px-3 py-1 font-medium rounded-full ${item?.status === "Paid"
                            ? "text-[#0D9755]"
                            : "text-red-500"
                            }`}
                        >
                          {item?.status ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.status === "Unpaid" ? (
                          <button
                            className="text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:bg-gradient-to-l px-4 py-1  font-normal rounded-md transition duration-300 ease-in-out"
                            style={{ minWidth: "100px", height: "36px" }}
                          >
                            {t("Pay Now")}
                          </button>
                        ) : (
                          <span
                            className="text-[#0D9755] bg-[#E9F8EB] font-normal px-4 py-1 rounded-md inline-block"
                            style={{
                              width: "100px",  // Set a fixed width to match "Pay Now" button
                              height: "36px",  // Ensure height matches "Pay Now" button
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}
                          >
                            {t("Completed")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountingSection;
