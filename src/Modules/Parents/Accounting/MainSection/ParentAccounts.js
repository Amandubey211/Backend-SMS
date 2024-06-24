import React, { useState } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { dummyData } from "../../dummyData/dummyData";


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

  useNavHeading("Parent Accounting");

  const classes = uniqueFilterOptions(dummyData, "class");
  const sections = uniqueFilterOptions(dummyData, "section");
  const feesTypes = uniqueFilterOptions(dummyData, "feesType");

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleStatusChange = (status) => {
//     setSelectedStatus(status);
//   };
  const filteredData = dummyData.filter(
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
        <div className=" p-4  ">
          <div className="flex  items-center mb-4  ">
           
          </div>
</div>
          {/* //everyone, paid,unpaid */}
          <div className="p-4">
            

          <div className=" overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-100">
                  <th className="px-5 py-3 border-b-2 border-gray-200">Fees Type</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                   Paid By
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                   Due Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                   Amount
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                   Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className=" text-left text-gray-700 bg-gray-100">
                    <td className="px-5 py-2 border-b border-gray-200 flex items-center">
                    {item.feesType}
                   
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
                    <td className="px-5 py-2 border-b  border-gray-200">
                     {item.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Fees"
          > */}
            {/* <AddFeesForm /> */}
          {/* </Sidebar> */}
        </div>
     
    </Layout>
  );
};

export default AccountingSection;

