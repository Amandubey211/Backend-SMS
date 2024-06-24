import React, { useState } from "react";
// import FormField from '../Admin/Accounting/subClass/component/FormField';
import { studentFinanceDummyData } from "./dummyData/dummyData"; // Correct path to your data file
// import FormField from "./subClass/component/FormField";
// import StudentDashLayout from "../../Components/Student/StudentDashLayout";
import Layout from "../../Components/Common/Layout";
import ParentDashLayout from "../../Components/Parents/ParentDashLayout";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";

const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const ParentFinanceTable = () => {
  const [filters, setFilters] = useState({
    feesType: "",
    status: "Everyone",
  });

  // Extracting fee details from the imported dummy data
  const feesDetails = studentFinanceDummyData.finance.feesDetails;

  // Extracting unique fee types for the dropdown filter
  const feesTypes = uniqueFilterOptions(feesDetails, "feeType").map((type) => ({
    label: type,
    value: type,
  }));

  // Handler for changes in filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtering the fees details based on selected filters
  const filteredFeesDetails = feesDetails.filter(
    (item) =>
      (filters.feesType === "" || item.feeType === filters.feesType) &&
      (filters.status === "Everyone" || item.status === filters.status)
  );

  return (
    <>
      <Layout title="Parent Finance ">
        <ParentDashLayout>
          <div className="flex ">
            {/* left */}
            <div className="flex flex-col w-[80%] h-full  ">
              <div className="filter-container flex  justify-between p-6 items-center ">
                
               <div className="flex justify-between gap-3 " >
               
               {["Everyone", "Paid", "Unpaid"].map((status) => (
                  
                  <>
                  <div className="" >
                 
                   <label
                    key={status}
                    className="flex  items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filters.status === status}
                      onChange={handleFilterChange}
                      className="hidden"
                    />
                    <div
                      className={`h-5 w-5 rounded-full mr-2 flex  items-center justify-center border-2 ${
                        filters.status === status
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {filters.status === status && (
                        <div className="h-3 w-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`transition-colors duration-200 ${
                        filters.status === status
                          ? "text-red-700"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </label>
                  </div>
                 
                  
                  </>
                ))}
                </div>
              </div>
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Fee Type
                    </th>
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
                  {filteredFeesDetails.map((item, index) => (
                    <tr key={index} className="text-left text-gray-700">
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.feeType}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.paidBy}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.dueDate}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.amount} QR
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.status === "Paid"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.status === "Paid" ? (
                          <span className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-green-200 text-green-800 py-1 px-2 rounded-md">
                            Complete
                          </span>
                        ) : (
                          <button className="inline-flex items-center border border-transparent text-xs font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-2 rounded-md hover:from-pink-600 hover:to-purple-600">
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* right */}
              <div className="  w-[20%] border p-4 h-screen ">
            <div className="flex flex-col gap-5 ">
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Total Unpaid Fees</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                 {studentFinanceDummyData.finance.totalUnpaidFees} QR
                </span>
                <button
                  // onClick={onAddNewSubject}
                  className="flex items-center border border-blue-800 w-full justify-center   px-5    rounded-full"

                  // className=" border border-gray-300 px-8 w-full rounded-full"
                >
                  <span className="text-blue-800">Pay Now </span>
                </button>
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Total Paid Fees</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                {studentFinanceDummyData.finance.totalPaidFees} QR
                </span>
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Parent Account Total Paid</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                {studentFinanceDummyData.finance.totalPaidFees} QR
                </span>
                
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">My Account Total Paid</span>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text">
                {studentFinanceDummyData.finance.myAccountPaidFees}  QR
                </span>
                <button
                  // onClick={onAddNewSubject}
                  className="flex items-center border border-blue-800 w-full justify-center   px-5    rounded-full"

                  // className=" border border-gray-300 px-8 w-full rounded-full"
                >
                  <span className="text-blue-800">View All Expenses </span>
                </button>
              </div>

              
            </div>
          </div>
          </div>
        </ParentDashLayout>
      </Layout>
    </>
  );
};

export default ParentFinanceTable;
