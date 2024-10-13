import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountingData } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action'; // Redux action to fetch accounting data
import Layout from "../../../../Components/Common/ParentLayout";
import { FaExclamationCircle, FaMoneyBillWave } from "react-icons/fa"; // Icons for error and no data message
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5"; // Icons for pagination arrows
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filters state
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone", // Default to show all statuses
  });

  // Redux state for accounting data
  const {
    accountingData,
    loadingAccounting: loading, // Alias loading state for simplicity
    errorAccounting: error // Alias error state for simplicity
  } = useSelector((state) => state?.Parent?.dashboard || {});

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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Determine which data to show on the current page
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [currentPage, filteredData]);

  // Handle page change with left and right arrows
  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  }, []);

  // Handle navigation using useCallback to prevent re-creation on every render
  const handleNavigate = useCallback(() => {
    navigate("/parentfinance");
  }, [navigate]);

  return (
    <Layout title={t("Finance")}>
      <div className="p-4">
        {/* Accounting Section Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-600 text-center">
            {t("Finance")}
          </h2>
          {!error && paginatedData.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-500"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <IoArrowBackCircleOutline className="inline-block text-2xl" />
              </button>
              <span className="font-normal text-gray-600">
                {`${currentPage.toString().padStart(2, '0')} / ${totalPages.toString().padStart(2, '0')}`}
              </span>
              <button
                className="text-gray-500"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <IoArrowForwardCircleOutline className="inline-block text-2xl" />
              </button>
              <button
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
                onClick={handleNavigate}
              >
                {t("See All")}
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Adjusting the table layout to show rows based on pagination */}
          <div className="shadow rounded-lg">
            {loading ? (
              // Show spinner when loading
              <>
                <Spinner />
                <p className="text-gray-600">{t("Loading...")}</p>
              </>
            ) : error ? (
              // Show error message when error occurs
              <>
                <FaExclamationCircle className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">{error}: {t("Unable to fetch Fees")}</p>
              </>
            ) : paginatedData.length === 0 ? (
              // No data available, show icon and message
              <>
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">{t("No Fees Yet")}</p>
              </>
            ) : (
              // Display paginated data in table

              <table className="min-w-full table-fixed leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-[#F9FAFC]">
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Fee Type")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Paid By")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Due Date")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Amount")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Status")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {paginatedData.map((item, index) => (
                    <tr key={index} className="text-left text-gray-700 bg-white shadow-sm">
                      <td className="px-5 py-4 border-b border-gray-200 truncate">{item?.feeType ?? t("No Fee Type")}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.paidBy ?? "N/A"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.dueDate ?? "N/A"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">{item?.amount ?? "N/A"}</td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        <span className={`inline-block px-3 py-1 font-medium rounded-full ${item?.status === "Paid" ? "text-[#0D9755]" : "text-red-500"}`}>
                          {item?.status ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item?.status === "Unpaid" ? (
                          <button className="text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:bg-gradient-to-l px-4 py-1 font-normal rounded-md transition duration-300 ease-in-out" style={{ minWidth: "100px", height: "36px" }}>
                            {t("Pay Now")}
                          </button>
                        ) : (
                          <span className="text-[#0D9755] bg-[#E9F8EB] font-normal px-4 py-1 rounded-md inline-block" style={{ width: "100px", height: "36px", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
