import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { FaMoneyBillWave } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchParentFinanceData } from "../../Store/Slices/Parent/Finance/finance.action.js";
import Spinner from "../../Components/Common/Spinner";
import useNavHeading from "../../Hooks/CommonHooks/useNavHeading .js";
import { useTranslation } from "react-i18next"; // Importing translation hook

const ParentFinanceTable = () => {
  const { t } = useTranslation("prtFinance"); // Initialize translation hook
  const dispatch = useDispatch();

  // Accessing the redux state, with optional chaining to avoid errors.
  const { financeData, totalUnpaidFees, totalPaidFees, loading, error } = useSelector(
    (state) => state?.Parent?.finance || {}
  );

  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });

  // Custom hook for setting navigation heading
  useNavHeading(t("Finance"));

  // Fetch finance data on mount or if dispatch changes
  useEffect(() => {
    dispatch(fetchParentFinanceData());
  }, [dispatch]);

  // Caching the filtered fee details for performance
  const filteredFeesDetails = useMemo(() => {
    return financeData?.filter(
      (item) =>
        (!filters.feesType || item?.feeType === filters.feesType) &&
        (filters.status === "Everyone" || item?.status === filters.status)
    );
  }, [financeData, filters]);

  // Caching the no data message for performance
  const noDataMessage = useMemo(() => {
    if (filters.status === "Paid") return t("No Paid Entries Available");
    if (filters.status === "Unpaid") return t("No Unpaid Entries Available");
    return t("No Finance Data Available for Now");
  }, [filters.status, t]);

  // Update filters based on user input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Centered error message with custom network error icon inside table row
  const renderErrorMessage = () => {
    const isNetworkError = error?.toLowerCase().includes("network error");

    return (
      <tr>
        <td className="text-center py-4" colSpan="6">
          <div className="flex flex-col items-center justify-center mt-10">
            {isNetworkError ? (
              <RiSignalWifiErrorFill className="text-gray-400 text-8xl mb-6" />
            ) : (
              <MdAccessTime className="text-gray-400 text-8xl mb-6" />
            )}
            <p className="text-gray-600 text-lg">
              {error}: {t("Failed to fetch finance data")}
            </p>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Layout title={t("Finance")}>
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex">
          {/* Main content area */}
          <div className={`flex flex-col w-[80%] h-full ${loading || error ? "w-full" : ""}`}>
            {/* Filter section */}
            <div className="filter-container flex justify-between p-6 items-center">
              <div className="flex justify-between gap-4">
                {["Everyone", "Paid", "Unpaid"]?.map((status) => (
                  <div key={status}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={filters.status === status}
                        onChange={handleFilterChange}
                        className="hidden"
                      />
                      <div
                        className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${filters.status === status
                          ? "border-green-500 bg-white"
                          : "border-gray-300 bg-white"
                          }`}
                        style={{ position: "relative" }}
                      >
                        {filters.status === status && (
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: "#0D9755",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          ></div>
                        )}
                      </div>
                      <span
                        className={`transition-colors duration-200 ${filters.status === status ? "text-green-700" : "text-gray-700"
                          }`}
                        style={{ paddingLeft: "2px" }}
                      >
                        {t(status)}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Table section */}
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
                {loading ? (
                  // Show Spinner while loading data in the table body area
                  <tr>
                    <td className="text-center py-4" colSpan="6">
                      <Spinner />
                    </td>
                  </tr>
                ) : error ? (
                  renderErrorMessage() // Display error message in table row
                ) : filteredFeesDetails.length > 0 ? (
                  filteredFeesDetails?.map((item, index) => (
                    <tr key={index} className="text-left text-gray-700 bg-white shadow-sm">
                      <td className="px-5 py-4 border-b border-gray-200">{item?.feeType || t("No Fee Type")}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.paidBy || "------"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.dueDate || "No Due Date"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.amount || "No Amount"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        <span className={`inline-block px-3 py-1 font-semibold rounded-full ${item?.status === "Paid" ? "text-[#0D9755]" : "text-red-500"}`}>
                          {item?.status || "No Status"}
                        </span>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.status === "Paid" ? (
                          <button className="bg-[#E9F8EB] text-[#0D9755] font-semibold px-4 py-1 rounded-md" disabled>
                            {t("Completed")}
                          </button>
                        ) : (
                          <button className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-semibold px-4 py-1 rounded-md">
                            {t("Pay Now")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  // Handle no data case
                  <tr>
                    <td className="text-center py-4 pt-7" style={{ paddingTop: "6.75rem" }} colSpan="6">
                      <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" style={{ margin: "0 auto" }} />
                      <p className="text-gray-600 text-lg">{noDataMessage}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar with totals */}
          {!loading && !error && (
            <div className="w-[20%] border p-4 h-auto">
              <div className="flex flex-col gap-5">
                <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                  <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                    <MdAccessTime className="text-2xl text-red-400" />
                  </div>
                  <span className="text-sm">{t("Total Unpaid Fees")}</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                    {totalUnpaidFees || "0"}
                  </span>
                  <button className="flex items-center bg-gradient-to-r from-[#C83B62] to-[#7F35CD] p-1 w-full justify-center px-5 rounded-full">
                    <span className="text-white">{t("Pay Now")}</span>
                  </button>
                </div>
                <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                  <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                    <GiExpense className="text-2xl text-red-400" />
                  </div>
                  <span className="text-sm">{t("Total Paid Fees")}</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                    {totalPaidFees || "0"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
