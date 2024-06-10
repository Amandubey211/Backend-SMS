// import React, { useState } from 'react';
// import { dummyExpenses } from '../../dummyData/dummyData'

// import Layout from "../../../../Components/Common/Layout";
// import DashLayout from "../../../../Components/Admin/AdminDashLayout";

// const Expenses = () => {
//   const [selectedFilter, setSelectedFilter] = useState('All Expenses');
//   const [selectedMonth, setSelectedMonth] = useState('January');

//   const handleFilterChange = (filter) => {
//     setSelectedFilter(filter);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const filteredExpenses = dummyExpenses.filter(expense => {
//     return (selectedFilter === 'All Expenses' || expense.status === selectedFilter) &&
//            (selectedMonth === 'All' || expense.salaryMonth === selectedMonth);
//   });

//   return (
//     <Layout title="Expenses">
//       <DashLayout>
//         <div className="p-4 bg-gray-50 min-h-screen">
//   <div className="flex justify-between items-center mb-4">
// <div>
//   <button onClick={() => handleFilterChange('All Expenses')} className={`button ${selectedFilter === 'All Expenses' ? 'active' : ''}`}>All Expenses</button>
//   <button onClick={() => handleFilterChange('Paid')} className={`button ${selectedFilter === 'Paid' ? 'active' : ''}`}>Paid Expenses</button>
//   <button onClick={() => handleFilterChange('Due')} className={`button ${selectedFilter === 'Due' ? 'active' : ''}`}>Due Expenses</button>
// </div>
//     <select onChange={handleMonthChange} value={selectedMonth}>
//       <option value="All">All Months</option>
//       <option value="January">January</option>
//       <option value="February">February</option>
//       {/* Add more months as needed */}
//     </select>
//   </div>
//           <table className="min-w-full leading-normal">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Contact Info</th>
//                 <th>Salary Month</th>
//                 <th>Salary Amount</th>
//                 <th>Paid Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredExpenses.map((expense) => (
//                 <tr key={expense.id}>
//                   <td>{expense.name}</td>
//                   <td>{expense.contact}</td>
//                   <td>{expense.salaryMonth}</td>
//                   <td>{expense.salaryAmount}</td>
//                   <td>{expense.paidDate}</td>
//                   <td>{expense.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </DashLayout>
//     </Layout>
//   );
// };

// export default Expenses;

//----------------
/*

import React, { useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";

const Expenses = () => {
  const [activeTab, setActiveTab] = useState('Teachers Salary');
  const [selectedMonth, setSelectedMonth] = useState('January');

  const expensesData = {
    'Teachers Salary': [
      { name: 'Leslie Alexander', contact: '+990 7183641', month: 'January', amount: 2500, date: '01/05/2024', status: 'Paid' },
      { name: 'Bessie Cooper', contact: '+990 7183641', month: 'January', amount: 2500, date: '01/05/2024', status: 'Paid' },
    ],
    'Staff Salary': [
      { name: 'Annette Black', contact: '+990 7183641', month: 'January', amount: 2000, date: '01/05/2024', status: 'Due' },
    ],
    'Other Expenses': [
      { name: 'Courtney Henry', contact: '+990 7183641', month: 'January', amount: 1800, date: '02/05/2024', status: 'Paid' },
    ]
  };

  const filteredExpenses = expensesData[activeTab].filter(expense => expense.month === selectedMonth || selectedMonth === 'All');

  return (
    <Layout title="Expenses">
      <DashLayout>
        <div className="p-4 bg-gray-50 min-h-screen">
          <div className="mb-4">
            {['Teachers Salary', 'Staff Salary', 'Other Expenses'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 mr-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
            <option value="All">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
          </select>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Paid Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>{expense.contact}</td>
                  <td>{expense.month}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>{expense.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Expenses;
*/

//----------

import React, { useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import TeacherSalary from "./TeacherSalary"; // Component for teacher salaries
import StaffSalary from "./StaffSalary"; // Component for staff salaries
import OtherExpenses from "./OtherExpenses"; // Component for other expenses
import TabButton from "../../Libary/Subclasss/component/TabButton";
import { dummyTeacherExpenses,dummyStaffExpenses,dummyOtherExpenses } from "../../dummyData/dummyData";
import Sidebar from "../../../../Components/Common/Sidebar";
import PaySalary from "./PaySalary";
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
    const monthMatch = expense.salaryMonth === selectedMonth || selectedMonth === "All";
    const filterMatch = selectedFilter === "All Expenses" || expense.status === selectedFilter;
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
        <div className="min-h-screen p-4 bg-gray-50   overflow-x-auto  " style={{maxHeight:'90vh'}}>
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
              {/* <div>
                <button
                  onClick={() => handleFilterChange("All Expenses")}
                  className={`button ${
                    selectedFilter === "All Expenses" ? "active" : ""
                  }`}
                >
                  All Expenses
                </button>
                <button
                  onClick={() => handleFilterChange("Paid")}
                  className={`button ${
                    selectedFilter === "Paid" ? "active" : ""
                  }`}
                >
                  Paid Expenses
                </button>
                <button
                  onClick={() => handleFilterChange("Due")}
                  className={`button ${
                    selectedFilter === "Due" ? "active" : ""
                  }`}
                >
                  Due Expenses
                </button>
              </div> */}
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

          {activeTab === "StaffSalary" && <StaffSalary data={filteredExpenses} selectedMonth={selectedMonth}    />}
          {activeTab === "OtherExpenses" && <OtherExpenses data={filteredExpenses} selectedMonth={selectedMonth}/>}
          
          
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
            title="Add Transaction"
          >
          <AddEarning/>
          </Sidebar>



        </div>
      </DashLayout>
    </Layout>
  );
};

export default Expenses;
