import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import AddFeesForm from "../subClass/component/AddFeesForm";
import FormField from "../subClass/component/FormField";

const AccountingSection = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    feesType: "",
    status: "Everyone",
  });
  const [feesData, setFeesData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Everyone");

  useNavHeading("Accounting");

  useEffect(() => {
    const token = localStorage.getItem('admin:token');
    fetch("http://localhost:8080/admin/get_fees", {
      method: "GET",
      headers: {
        Authentication: `${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setFeesData(data.data);
        }
      })
      .catch(error => console.error('Error fetching fees data:', error));
  }, []);

  const uniqueFilterOptions = (data, key) => {
    return [...new Set(data.map(item => item[key]))].sort();
  };

  const classes = useMemo(() => uniqueFilterOptions(feesData.map(fd => fd.studentId.presentClassId), "className"), [feesData]);
  const feesTypes = useMemo(() => uniqueFilterOptions(feesData, "feeType"), [feesData]);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilters((prev) => ({ ...prev, status }));
  };

  const filteredData = useMemo(() => feesData.filter(item => {
    const { class: classFilter, feesType, status } = filters;
    return (
      (classFilter === "" || item.studentId.presentClassId.className === classFilter) &&
      (feesType === "" || item.feeType === feesType) &&
      (status === "Everyone" ||
        (status === "Paid" && item.status === "Paid") ||
        (status === "Unpaid" && item.status === "Unpaid"))
    );
  }), [feesData, filters]);

  return (
    <Layout title="Accounting">
      <DashLayout>
        <div className="min-h-screen p-4 bg-gray-50 ">
          <div className="flex items-center mb-4">
            <div className="flex justify-between items-end space-x-2 w-full">
              <FormField
                id="class"
                label="Class"
                value={filters.class}
                onChange={handleFilterChange}
                options={classes}
              />
              <FormField
                id="feesType"
                label="Fees Type"
                value={filters.feesType}
                onChange={handleFilterChange}
                options={feesTypes}
              />

              <button
                onClick={handleSidebarOpen}
                className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
              >
                Add New Fees
                <span className="ml-2">+</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-4">
              {["Everyone", "Paid", "Unpaid"].map((status) => (
                <label
                  key={status}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={selectedStatus === status}
                    onChange={() => handleStatusChange(status)}
                    className="hidden"
                  />
                  <div
                    className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                      selectedStatus === status
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedStatus === status && (
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`transition-colors duration-200 ${
                      selectedStatus === status
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-100">
                  <th className="px-5 py-3 border-b-2 border-gray-200">Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Class</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Fees Type</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Due Date</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="text-left text-gray-700 bg-gray-100">
                    <td className="px-5 py-2 border-b border-gray-200">
                      <span>{item.studentId.fullName}</span>
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {item.studentId.presentClassId.className}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {item.feeType}
                    </td>
                    <td className="px-5 py-2 border-b border-gray-200">
                      {new Date(item.dueDate).toLocaleDateString()}
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
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Fees"
          >
            <AddFeesForm />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AccountingSection;

