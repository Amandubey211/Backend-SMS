import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountingData } from '../../../../Store/Slices/Parent/Dashboard/dashboardThunks'; // Redux action to fetch accounting data
import Layout from "../../../../Components/Common/ParentLayout";
import { FaMoneyBillWave } from "react-icons/fa"; // Icon for no fees message
import Spinner from "../../../../Components/Common/Spinner"; // Spinner component

// Utility function to get unique filter options from the data (no useMemo here)
const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const AccountingSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone", // Default to show all statuses
  });

  // Redux state for accounting data
  const { accountingData, loading, error } = useSelector((state) => state.Parent.dashboard);
  
  // Dispatch action to fetch accounting data on component mount
  useEffect(() => {
    if (!accountingData?.fees?.length) {
      dispatch(fetchAccountingData());
    }
  }, [dispatch, accountingData]);

  // Check if accountingData exists and has fees data
  const { fees = [], totalUnpaidFees = "", totalPaidFees = "" } = accountingData || {};

  // Memoize the filter options inside the component itself
  const classes = useMemo(() => uniqueFilterOptions(fees, "class"), [fees]);
  const sections = useMemo(() => uniqueFilterOptions(fees, "section"), [fees]);
  const feesTypes = useMemo(() => uniqueFilterOptions(fees, "feeType"), [fees]);

  // Apply filters to the fees data, useMemo to optimize the filtered data calculation
  const filteredData = useMemo(() => {
    return fees.filter((item) => {
      const classCondition = filters.class === "" || !item.class || item.class === filters.class;
      const sectionCondition = filters.section === "" || !item.section || item.section === filters.section;
      const feeTypeCondition = !filters.feeType || item.feeType === filters.feeType;
      const statusCondition = filters.status === "Everyone" || item.status === filters.status;
      return classCondition && sectionCondition && feeTypeCondition && statusCondition;
    });
  }, [fees, filters]);

  // Handle navigation using useCallback to prevent re-creation on every render
  const handleNavigate = useCallback(() => {
    navigate("/parentfinance");
  }, [navigate]);

  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Layout title="Parents | Dashboard">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-normal text-gray-600">Accounting</h2>
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
            onClick={handleNavigate}
          >
            See All
          </button>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto shadow rounded-lg">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">No Fees Yet</p>
              </div>
            ) : (
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-[#F9FAFC]">
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Fees Type</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Paid By</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Due Date</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Amount</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Action</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="text-left text-gray-700 bg-white shadow-sm">
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item.feeType}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item.paidBy || "N/A"}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item.dueDate}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item.amount}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        <span
                          className={`inline-block px-3 py-1 font-medium rounded-full ${item.status === "Paid"
                            ? "text-[#0D9755]"
                            : "text-red-500"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200">
                        {item.status === "Unpaid" ? (
                          <button
                            className="text-white bg-gradient-to-r from-[#C83B62] to-[#7F35CD] hover:bg-gradient-to-l px-4 py-1  font-normal rounded-md transition duration-300 ease-in-out"
                            style={{ minWidth: "100px", height: "36px" }}
                          >
                            Pay Now
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
                            Completed
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
