import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountingData } from '../../../../Store/Slices/Parent/Dashboard/dashboard.action'; // Redux action to fetch accounting data
import Layout from "../../../../Components/Common/ParentLayout";
import { FaExclamationCircle, FaMoneyBillWave } from "react-icons/fa"; // Icons for error and no data message
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5"; // Icons for pagination arrows
import Spinner from "../../../../Components/Common/Spinner"; // Spinner component
import { useTranslation } from "react-i18next"; // Import useTranslation from i18next
import { FinanceTableSkeleton } from "../../Skeletons";

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
  var {
    accountingData = {
      fees: [],
      totalUnpaidFees: 0,
      totalPaidFees: 0
    },
    loadingAccounting: loading, // Alias loading state for simplicity
    errorAccounting: error // Alias error state for simplicity
  } = useSelector((state) => state?.Parent?.dashboard || {}); // Optional chaining to safely access Parent and dashboard

  // useRef to track if fetchAccountingData has been dispatched
  const hasFetched = useRef(false);

  // Dispatch action to fetch accounting data on component mount
  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchAccountingData());
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Extracting data with safe defaults
  const fees = useMemo(() => accountingData?.fees ?? [], [accountingData]);
  const totalUnpaidFees = accountingData?.totalUnpaidFees ?? 0;
  const totalPaidFees = accountingData?.totalPaidFees ?? 0;

  // Memoize the filter options inside the component itself
  const classes = useMemo(() => uniqueFilterOptions(fees, "class"), [fees]);
  const sections = useMemo(() => uniqueFilterOptions(fees, "section"), [fees]);
  const feesTypes = useMemo(() => uniqueFilterOptions(fees, "feeType"), [fees]);


  // Apply filters to the fees data, useMemo to optimize the filtered data calculation
  const filteredData = useMemo(() => {
    return fees?.filter((item) => {
      const classCondition = filters?.class === "" || item?.class === filters?.class;
      const sectionCondition = filters?.section === "" || item?.section === filters?.section;
      const feeTypeCondition = filters?.feesType === "" || item?.feeType === filters?.feesType;
      const statusCondition = filters?.status === "Everyone" || item?.status === filters?.status;
      return classCondition && sectionCondition && feeTypeCondition && statusCondition;
    });
  }, [fees, filters]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => Math.ceil(filteredData?.length / rowsPerPage), [filteredData?.length, rowsPerPage]);

  // Determine which data to show on the current page
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData?.slice(startIndex, endIndex); // Safe slicing
  }, [currentPage, filteredData, rowsPerPage]);

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

  // Reset currentPage if filters change and currentPage exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <Layout title={t("Finance")}>
      <div className="p-4 pt-0 w-full">
        {/* Accounting Section Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-600 text-center">
            {t("Finance")}
          </h2>
          {!error && (
            <div className="flex items-center space-x-4">

              <div className="inline-block mr-5">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out 
               text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal
               hover:bg-gradient-to-r hover:from-[#7F35CD] hover:to-[#C83B62]  
               hover:shadow-md"
                  onClick={handleNavigate}
                >
                  {t("See All")}
                </button>
              </div>

            </div>
          )}
        </div>

        <div className="p-4 flex items-center justify-center w-full ">
          {/* Adjusting the table layout to show rows based on pagination */}
          <div className="rounded-lg w-full overflow-x-hidden">
            {loading ? (
              <FinanceTableSkeleton />
            ) : error ? (
              // Show error message when error occurs
              <div className="flex flex-col items-center p-10">
                <FaExclamationCircle className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600 text-lg">
                  {error ? `${error}: ` : ""}
                  {t("Unable to fetch Fees")}
                </p>
              </div>
            ) : paginatedData?.length === 0 ? (
              // No data available, show icon and message
              <div className="flex flex-col items-center p-10">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">{t("No Fees Yet")}</p>
              </div>
            ) : (
              // Display paginated data in table
              <table className="w-full table-fixed leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-[#e5e5e5]">
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Fee Type")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Paid By")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Due Date")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Amount")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Status")}</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal w-1/5">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {paginatedData?.map((item) => (
                    <tr key={item.id} className="text-left text-gray-700 bg-white shadow-sm hover:bg-gray-100 transition-colors duration-200">
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
