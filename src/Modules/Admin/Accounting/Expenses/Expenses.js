import React, { useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import TeacherSalary from "./components/TeacherSalary";
import StaffSalary from "./components/StaffSalary";
import OtherExpenses from "./components/OtherExpenses";
import TabButton from "../../Libary/Subclasss/component/TabButton";
import {
  dummyTeacherExpenses,
  dummyStaffExpenses,
  dummyOtherExpenses,
} from "../../dummyData/dummyData";
import Sidebar from "../../../../Components/Common/Sidebar";
import PaySalary from "./components/PaySalary";
import AddEarning from "../Earnings/AddEarning";

// import TabButton from "../Subclasss/component/TabButton"; // Ensure correct import path
// TabButton

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("TeacherSalary");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("All Expenses");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const expensesData = {
    TeacherSalary: dummyTeacherExpenses,
    StaffSalary: dummyStaffExpenses,
    OtherExpenses: dummyOtherExpenses,
  };

  //   const filteredExpenses = dummyTeacherExpenses.filter((expense) => {
  //     const monthMatch =
  //       expense.salaryMonth === selectedMonth || selectedMonth === "All";

  //     const filterMatch =
  //       selectedFilter === "All Expenses" || expense.status === selectedFilter;

  //     return monthMatch, filterMatch;
  //   });
  const filteredExpenses = expensesData[activeTab].filter((expense) => {
    const monthMatch =
      expense.salaryMonth === selectedMonth || selectedMonth === "All";
    const filterMatch =
      selectedFilter === "All Expenses" || expense.status === selectedFilter;
    return monthMatch && filterMatch;
  });

  // const handleMonthChange=dummyTeacherExpenses.filter(month=>month.salaryMonth===selectedMonth||selectedMonth==='All')

  const uniqueMonths = [
    ...new Set(dummyTeacherExpenses.map((item) => item.salaryMonth)),
  ];
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <Layout title="Expenses">
      <DashLayout>
        <div
          className="min-h-screen p-4 bg-gray-50   overflow-x-auto  "
          style={{ maxHeight: "90vh" }}
        >
          <div className="flex  flex-col gap-5   mb-6  ">
            <div className="flex justify-between   ">
              <div className="flex gap-2">
                <TabButton
                  isActive={activeTab === "TeacherSalary"}
                  onClick={() => setActiveTab("TeacherSalary")}
                >
                  Teacher's Salary
                </TabButton>
                <TabButton
                  isActive={activeTab === "StaffSalary"}
                  onClick={() => setActiveTab("StaffSalary")}
                >
                  Staff Salary
                </TabButton>
                <TabButton
                  isActive={activeTab === "OtherExpenses"}
                  onClick={() => setActiveTab("OtherExpenses")}
                >
                  Other Expenses
                </TabButton>
              </div>

              <div>
                <button
                  onClick={handleSidebarOpen}
                  // onClick={handleSidebarOpen}
                  className="flex items-center border border-gray-300 ps-5  py-0 rounded-full"
                >
                  <span className="mr-2">Add New Earning</span>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl -mt-2">+</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-between ">
              <div className="flex items-center space-x-4">
                {["All Expenses", "Paid", "Due"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedFilter === status}
                      onChange={() => handleFilterChange(status)}
                      className="hidden"
                    />
                    <div
                      className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                        selectedFilter === status
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedFilter === status && (
                        <div className="h-3 w-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`transition-colors duration-200 ${
                        selectedFilter === status
                          ? "text-red-700"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex  gap-3">
                <label>Month:</label>
                <select
                  onChange={handleMonthChange}
                  value={selectedMonth}
                  className=" bg-white border-none  text-green-800"
                >
                  <option value="All">All Months</option>
                  {uniqueMonths.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeTab === "TeacherSalary" && (
            <TeacherSalary
              data={filteredExpenses}
              selectedMonth={selectedMonth}
            />
          )}

          {activeTab === "StaffSalary" && (
            <StaffSalary
              data={filteredExpenses}
              selectedMonth={selectedMonth}
            />
          )}
          {activeTab === "OtherExpenses" && (
            <OtherExpenses
              data={filteredExpenses}
              selectedMonth={selectedMonth}
            />
          )}

          {/* <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title={
                <span className="bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                  {sidebarContent === "payNow"
                    ? "Pay Now"
                    : "Add Transaction"}
                </span>
              }
            >
              {renderSidebarContent()}
            </Sidebar> */}

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={<span className=" font-normal  text-gray-600 " >Add Transaction</span>}
            >
            <AddEarning />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Expenses;





// ----------check later ----------
// import React from 'react';

// const ExpenseTable = ({ data, handlePayClick, isPaid }) => (
//     <table className="min-w-full leading-normal mt-4 shadow-lg rounded-lg overflow-hidden">
//         <thead>
//             <tr className="text-left text-gray-700 bg-gray-100">
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Name</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Contact Info</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Month</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Paid Date</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Status</th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
//             </tr>
//         </thead>
//         <tbody>
//             {data.map((item, index) => (
//                 <tr key={index} className="bg-white">
//                     <td className="px-5 py-2 border-b border-gray-200">{item.name}</td>
//                     <td className="px-5 py-2 border-b border-gray-200">{item.contact}</td>
//                     <td className="px-5 py-2 border-b border-gray-200">{item.salaryMonth}</td>
//                     <td className="px-5 py-2 border-b border-gray-200">{item.salaryAmount}</td>
//                     <td className="px-5 py-2 border-b border-gray-200">{item.paidDate}</td>
//                     <td className="px-5 py-2 border-b border-gray-200">
//                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
//                             {item.status}
//                         </span>
//                     </td>
//                     <td className="px-5 py-2 border-b border-gray-200">
//                         {item.status === 'Paid' ? (
//                             <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">Complete</span>
//                         ) : (
//                             <button onClick={() => handlePayClick(item)} className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600">Pay Now</button>
//                         )}
//                     </td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// );

// export default ExpenseTable;



//expense


// import React, { useState } from "react";
// import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";
// import TabButton from "../../Libary/Subclasss/component/TabButton";
// import Sidebar from "../../../../Components/Common/Sidebar";
// import AddEarning from "../Earnings/AddEarning";
// import ExpenseTable from "./ExpenseTable";
// import { dummyTeacherExpenses, dummyStaffExpenses, dummyOtherExpenses } from "../../dummyData/dummyData";

// const Expenses = () => {
//   const [activeTab, setActiveTab] = useState("TeacherSalary");
//   const [selectedMonth, setSelectedMonth] = useState("All");
//   const [selectedFilter, setSelectedFilter] = useState("All Expenses");
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const expensesData = {
//     TeacherSalary: dummyTeacherExpenses,
//     StaffSalary: dummyStaffExpenses,
//     OtherExpenses: dummyOtherExpenses,
//   };

//   const filteredExpenses = expensesData[activeTab].filter((expense) => {
//     const monthMatch = expense.salaryMonth === selectedMonth || selectedMonth === "All";
//     const filterMatch = selectedFilter === "All Expenses" || expense.status === selectedFilter;
//     return monthMatch && filterMatch;
//   });

//   const uniqueMonths = [...new Set([...dummyTeacherExpenses, ...dummyStaffExpenses, ...dummyOtherExpenses].map(item => item.salaryMonth))];
//   const handleMonthChange = (e) => setSelectedMonth(e.target.value);
//   const handleFilterChange = (filter) => setSelectedFilter(filter);

//   return (
//     <Layout title="Expenses">
//       <DashLayout>
//         <div className="min-h-screen p-4 bg-gray-50 overflow-x-auto" style={{ maxHeight: "90vh" }}>
//           {/* Tab and Filter UI */}
//           <div className="flex  flex-col gap-5 mb-6">
//             {/* Dynamic tab buttons and sidebar opening for new entries */}
//             <div className="flex justify-between">
//               {["TeacherSalary", "StaffSalary", "OtherExpenses"].map((tab) => (
//                 <TabButton key={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)}>
//                   {tab.replace(/([A-Z])/g, ' $1').trim()}  // Better naming for display
//                 </TabButton>
//               ))}
//               <button onClick={() => setSidebarOpen(true)} className="flex items-center border border-gray-300 ps-5 py-0 rounded-full">
//                 <span className="mr-2">Add New Earning</span>
//                 <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
//                   <span className="text-2xl -mt-2">+</span>
//                 </div>
//               </button>
//             </div>
//             {/* Month and Expense Type Filters */}
//             <div className="flex justify-between">
//               <div className="flex items-center space-x-4">
//                 {["All Expenses", "Paid", "Due"].map((status) => (
//                   <label key={status} className="flex items-center cursor-pointer">
//                     <input type="radio" name="status" value={status} checked={selectedFilter === status} onChange={() => handleFilterChange(status)} className="hidden" />
//                     <div className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${selectedFilter === status ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
//                       {selectedFilter === status && (<div className="h-3 w-3 bg-white rounded-full"></div>)}
//                     </div>
//                     <span className={`transition-colors duration-200 ${selectedFilter === status ? "text-red-700" : "text-gray-700"}`}>{status}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="flex gap-3">
//                 <label>Month:</label>
//                 <select onChange={handleMonthChange} value={selectedMonth} className="bg-white border-none text-green-800">
//                   <option value="All">All Months</option>
//                   {uniqueMonths.map((month) => (
//                     <option key={month} value={month}>{month}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//           {/* Display Expense Table for the active tab */}
//           <ExpenseTable data={filteredExpenses} handlePayClick={() => {}} isPaid={selectedFilter === "Paid"} />
//           <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} title="Add Transaction">
//             <AddEarning />
//           </Sidebar>
//         </div>
//       </DashLayout>
//     </Layout>
//   );
// };

// export default Expenses;
