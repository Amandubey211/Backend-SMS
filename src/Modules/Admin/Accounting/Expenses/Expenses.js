import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import TeacherSalary from "./components/TeacherSalary";
import StaffSalary from "./components/StaffSalary";
import OtherExpenses from "./components/OtherExpenses";
import Sidebar from "../../../../Components/Common/Sidebar";
import PaySalary from "./components/PaySalary";
import AddEarning from "../Earnings/AddEarning";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from './api/apiService.js';
import axios from "axios";
import { baseUrl } from "../../../../config/Common.js";
import AddExpense from "./components/AddExpense.js";
import { useDispatch, useSelector } from "react-redux";
import TabButton from "../../Libary/Components/TabButton.js";
import { setCurrentExpense, setIsSidebarOpen } from "../../../../Store/Slices/Admin/Accounting/Expenses/expensesSlice.js";
import { fetchSalaries } from "../../../../Store/Slices/Admin/Accounting/Expenses/expenses.action.js";

const Expenses = () => {

  const { isSidebarOpen, currentExpense } = useSelector((store) => store?.admin?.expenses)
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState("TeacherSalary");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const options = [{
    label: 'All Expenses',
    value: ''
  }, {
    label: 'Paid Expenses',
    value: 'paid'
  }, {
    label: 'Due Expenses',
    value: 'unpaid'
  }]

  const months = [
    { value: '', label: 'All Month' },
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
  ];

  const handleSidebarOpen = () => {
    dispatch(setIsSidebarOpen(true))
  };

  const handleSidebarClose = () => {
    dispatch(setIsSidebarOpen(false))
    dispatch(setCurrentExpense(null));
    
  };

  const handleCreateExpense = async () => {
    dispatch(fetchSalaries({ query: selectedOption, activeTab, month: selectedMonth }))
    handleSidebarClose();
  };

  const handleFilterChange = (e) => {
    const newData = e.target.value
    setSelectedOption(newData)
    dispatch(fetchSalaries({ query: newData, activeTab, month: selectedMonth }))
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    dispatch(fetchSalaries({ query: selectedOption, activeTab, month }))
  };

  useEffect(() => {
    dispatch(fetchSalaries({ query: selectedOption, activeTab, month: selectedMonth }));
  }, [activeTab]);

  return (
    <Layout title="Expenses">
      <DashLayout>
        <div className="min-h-screen p-4 bg-gray-50 overflow-x-auto" style={{ maxHeight: "90vh" }}>
          <div className="flex flex-col gap-5 mb-6">
            <div className="flex justify-between">
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

              {activeTab === "OtherExpenses" && <div>
                <button
                  onClick={handleSidebarOpen}
                  className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
                >
                  <span className="mr-2">Other Expenses</span>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-2xl -mt-2">+</span>
                  </div>
                </button>
              </div>}
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                {options?.map((option, index) => (
                  <label key={index} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="expenseFilter"
                      value={option.value}
                      checked={selectedOption == option.value}
                      onChange={handleFilterChange}
                      className="hidden"
                    />
                    <div
                      className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${selectedOption === option.value ? "border-green-500 bg-green-500" : "border-gray-300"}`}
                    >
                      {selectedOption === option.value && (
                        <div className="h-3 w-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`transition-colors duration-200 ${selectedOption === option.value ? "text-red-700" : "text-gray-700"}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              <div>
                <span className="text-gray-700 font-semibold">Month :</span>
                <select className="text-green-700 font-bold bg-inherit" value={selectedMonth} onChange={handleMonthChange}>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {activeTab === "TeacherSalary" && (
            <TeacherSalary
              //initialTeacherData={salaryData}
              selectedMonth={selectedMonth}
              selectedOption={selectedOption}
              //onEdit={fetchExpenseById}
              //onDelete={handleDeleteExpense}
            />
          )}

          {activeTab === "StaffSalary" && (
            <StaffSalary
              //staffData={salaryData}
              selectedMonth={selectedMonth}
              selectedOption={selectedOption}
              //onEdit={fetchExpenseById}
              //onDelete={handleDeleteExpense}
            />
          )}

          {activeTab === "OtherExpenses" && (
            <OtherExpenses
              //expenseData={salaryData}
              selectedMonth={selectedMonth}
              selectedOption={selectedOption}
              //onEdit={fetchExpenseById}
              //onDelete={handleDeleteExpense}
            />
          )}

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={<span className="font-normal text-gray-600">Add New Expenses</span>}
          >
            <AddExpense

              onCreate={handleCreateExpense}
            />
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Expenses;






