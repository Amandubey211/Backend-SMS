import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout.js";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { LuPocket } from "react-icons/lu";
import { CiMoneyCheck1 } from "react-icons/ci";
import { baseUrl } from "../../config/Common.js";
import Spinner from "../../Components/Common/Spinner"; // Import Spinner
import { FaMoneyBillWave } from "react-icons/fa";
const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const ParentFinanceTable = () => {
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });

  const [feesDetails, setFeesDetails] = useState([]);
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeesData = async () => {
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

        setFeesDetails(response.data.fees);
        setTotalUnpaidFees(response.data.totalUnpaidFees);
        setTotalPaidFees(response.data.totalPaidFees);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("No fees found for the given parent's children");
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
  }, []);

  const feesTypes = uniqueFilterOptions(feesDetails, "feeType").map((type) => ({
    label: type,
    value: type,
  }));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredFeesDetails = feesDetails.filter(
    (item) =>
      (filters.feesType === "" || item.feeType === filters.feesType) &&
      (filters.status === "Everyone" || item.status === filters.status)
  );

  return (
    <Layout title="Parents | Finance">
      <ParentDashLayout hideAvatarList={true}>
        <div className="flex">
          <div className="flex flex-col w-[80%] h-full">
            {loading ? (
              <Spinner /> // Display spinner while loading
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">Unable to fetch finance data!</p>
              </div>
            ) : filteredFeesDetails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg">No Finance Data Found!</p>
              </div>
            ) : (
              <>
                <div className="filter-container flex justify-between p-6 items-center">
                  <div className="flex justify-between gap-4">
                    {["Everyone", "Paid", "Unpaid"].map((status) => (
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
                            style={{ position: 'relative' }}
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
                            style={{ paddingLeft: "2px" }} // Adjust padding to align with the text
                          >
                            {status}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="text-left text-gray-700 bg-[#F9FAFC]">
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Fee Type</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Paid By</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Due Date</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Amount</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Status</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 font-normal">Action</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {filteredFeesDetails.map((item, index) => (
                      <tr key={index} className="text-left text-gray-700 bg-white shadow-sm">
                        <td className="px-5 py-4 border-b border-gray-200">{item.feeType}</td>
                        <td className="px-5 py-4 border-b border-gray-200">{item.paidBy || "------"}</td>
                        <td className="px-5 py-4 border-b border-gray-200">{item.dueDate}</td>
                        <td className="px-5 py-4 border-b border-gray-200">{item.amount}</td>
                        <td className="px-5 py-4 border-b border-gray-200">
                          <span
                            className={`inline-block px-3 py-1 font-semibold rounded-full ${item.status === "Paid"
                              ? "text-[#0D9755]"
                              : "text-red-500"
                              }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200">
                          {item.status === "Paid" ? (
                            <button
                              className="bg-[#E9F8EB] text-[#0D9755] font-semibold px-4 py-1 rounded-md"
                              disabled
                            >
                              Completed
                            </button>
                          ) : (
                            <button className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-semibold px-4 py-1 rounded-md">
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          {/* right */}
          <div className="w-[20%] border p-4 h-auto">
            <div className="flex flex-col gap-5">
              {error ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MdAccessTime className="text-gray-400 text-6xl mb-4" />
                  <p className="text-gray-600 text-lg">Not being able to fetch finance data</p>
                </div>
              ) : totalUnpaidFees === 0 && totalPaidFees === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MdAccessTime className="text-gray-400 text-6xl mb-4" />
                  <p className="text-gray-600 text-lg">No Finance Data Available</p>
                </div>
              ) : (
                <>
                  <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                    <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                      <MdAccessTime className="text-2xl text-red-400" />
                    </div>
                    <span className="text-sm">Total Unpaid Fees</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                      {totalUnpaidFees}
                    </span>
                    <button className="flex items-center bg-gradient-to-r from-[#C83B62] to-[#7F35CD] p-1 w-full justify-center px-5 rounded-full">
                      <span className="text-white">Pay Now</span>
                    </button>

                  </div>
                  <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                    <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                      <GiExpense className="text-2xl text-red-400" />
                    </div>
                    <span className="text-sm">Total Paid Fees</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                      {totalPaidFees}
                    </span>
                  </div>
                  <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                    <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                      <CiMoneyCheck1 className="text-2xl text-red-400" />
                    </div>
                    <span className="text-sm">Parent Account Total Paid</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                      {totalPaidFees}
                    </span>
                  </div>
                  <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
                    <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
                      <LuPocket className="text-2xl text-red-400" />
                    </div>
                    <span className="text-sm">My Account Total Paid</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                      {totalPaidFees}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ParentDashLayout>
    </Layout>
  );
};

export default ParentFinanceTable;
