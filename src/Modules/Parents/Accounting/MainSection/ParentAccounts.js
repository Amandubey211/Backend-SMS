import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";
import Layout from "../../../../Components/Common/ParentLayout";
import { FaMoneyBillWave } from "react-icons/fa"; // Importing an icon for the no fees message
import Spinner from "../../../../Components/Common/Spinner"; // Import Spinner

const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const AccountingSection = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone",
  });
  const [data, setData] = useState([]);
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get(`${baseUrl}/parent/api/fees`, {
          headers: {
            Authentication: `${token}`,
          },
        });

        setData(response.data.fees);
        setTotalUnpaidFees(response.data.totalUnpaidFees);
        setTotalPaidFees(response.data.totalPaidFees);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even on error
      }
    };
    fetchData();
  }, []);

  const classes = uniqueFilterOptions(data, "class");
  const sections = uniqueFilterOptions(data, "section");
  const feesTypes = uniqueFilterOptions(data, "feesType");

  const filteredData = data.filter(
    (item) =>
      (filters.class === "" || item.class === filters.class) &&
      (filters.section === "" || item.section === filters.section) &&
      (filters.feesType === "" || item.feesType === filters.feesType) &&
      (filters.status === "Everyone" ||
        (filters.status === "Paid" && item.status === "Paid") ||
        (filters.status === "Unpaid" && item.status === "Unpaid"))
  );

  if (loading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <Layout title="Accounting">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-normal text-gray-600">Accounting</h2>
          <button
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#C83B62] to-[#7F35CD] font-normal"
            onClick={() => navigate("/parentfinance")}
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
                        {item.paidBy || "------"}
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
                            style={{ minWidth: "100px", height: "36px" }} // Ensure consistent button width and height
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
