import React, { useState, useEffect } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import axios from "axios";

const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const AccountingSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone",
  });
  const [selectedStatus, setSelectedStatus] = useState("Everyone");
  const [data, setData] = useState([]);
  const [totalUnpaidFees, setTotalUnpaidFees] = useState("");
  const [totalPaidFees, setTotalPaidFees] = useState("");
  const [error, setError] = useState("");

  useNavHeading("Parent Accounting");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("parent:token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("http://localhost:8080/parent/api/fees", {
          headers: {
            Authentication: `${token}`,
          },
        });

        setData(response.data.fees);
        console.log(response.data)
        setTotalUnpaidFees(response.data.totalUnpaidFees);
        setTotalPaidFees(response.data.totalPaidFees);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const classes = uniqueFilterOptions(data, "class");
  const sections = uniqueFilterOptions(data, "section");
  const feesTypes = uniqueFilterOptions(data, "feesType");

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const filteredData = data.filter(
    (item) =>
      (filters.class === "" || item.class === filters.class) &&
      (filters.section === "" || item.section === filters.section) &&
      (filters.feesType === "" || item.feesType === filters.feesType) &&
      (filters.status === "Everyone" ||
        (filters.status === "Paid" && item.status === "Paid") ||
        (filters.status === "Unpaid" && item.status === "Unpaid"))
  );

  return (
    <Layout title="Accounting">
      <div className="p-4">
        
        <div className="flex items-center mb-4">
          {/* Add any additional content here */}
        </div>
        
        <div className="p-4">
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-100">
                  <th className="px-5 py-3 border-b-2 border-gray-200">Fees Type</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Paid By</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Due Date</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="text-left text-gray-700 bg-gray-100">
                    <td className="px-5 py-2 border-b border-gray-200 flex items-center">
                      {item.feeType}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {item.paidBy}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {item.dueDate}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {item.amount}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Paid"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {/* Add action buttons or content here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountingSection;
