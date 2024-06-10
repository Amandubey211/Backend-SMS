import React, { useState } from "react";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import AddFeesForm from "../subClass/component/AddFeesForm"; // Assuming you have this form component for adding fees
import FormField from "../subClass/component/FormField";
import { dummyData } from "../../dummyData/dummyData";
import { MdAccessTime, MdMoneyBillWave } from "react-icons/md";
import AddEarning from "./AddEarning";
import Sidebar from "../../../../Components/Common/Sidebar";
import FormInput from "../subClass/component/FormInput";

const Earning = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const handleSidebarOpen = () => setSidebarOpen(true);
    const handleSidebarClose = () => setSidebarOpen(false);
  
  return (
    <Layout title="Accounting">
      <DashLayout>
        <div className=" min-h-screen flex border  ">
          {/* left sidr */}
          <div className="w-[80%] border  ">
            {/*  header-box */}
            <div
              className="w-full h-20 p-4 border   flex  justify-between  items-center    "
              style={{ maxHeight: "90vh" }}
            >
              <span>All Earnings</span>
              <button
                onClick={handleSidebarOpen}
                className="flex items-center border border-gray-300 ps-5  py-0 rounded-full"
              >
                <span className="mr-2">Add New Earning</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-2xl -mt-2">+</span>
                </div>
              </button>
            </div>
            {/* table of all earnings */}
            {/* <div>


            </div> */}

            <div className=" overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Earning Reason
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      From
                    </th>

                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Earning Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Amount
                    </th>

                    <th className="px-5 py-3 border-b-2 border-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.map((item, index) => (
                    <tr
                      key={index}
                      className=" text-left text-gray-700 "
                    >
                      <td className="px-5 py-2 border-b border-gray-200 flex items-center">
                        <span>Donation for School</span>
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.name}
                      </td>

                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.dueDate}
                      </td>
                      <td className="px-5 py-2 border-b border-gray-200">
                        {item.amount}
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
          </div>
          {/* right side */}
          <div className="  w-[20%] border p-4  ">
            <div className="flex flex-col gap-5 ">
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Remaining Balances</span>
                <span className='text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text'>75000 QR</span>
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Total Earning</span>
                <span className='text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text'>75000 QR</span>
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Total Student Fees</span>
                <span className='text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text'>75000 QR</span>
                <button
                // onClick={onAddNewSubject}
                className="flex items-center border border-blue-800 w-full justify-center   px-5    rounded-full"

                // className=" border border-gray-300 px-8 w-full rounded-full"
              >
                <span className="text-blue-800">View All fees </span>
                
              </button>
              </div>
              <div className="   px-7  py-2 flex flex-1 flex-col justify-around items-center gap-3  border border-gray-300    rounded-lg ">
                <div className=" border border-black  flex  items-center justify-center p-1.5 rounded-full">
                  <MdAccessTime className="text-2xl text-red-400 " />
                  {/* <MdMoneyBillWave className="text-white text-2xl " /> */}
                </div>

                <span className="text-sm">Total Expenses</span>
                <span className='text-xl font-bold bg-gradient-to-r from-pink-500   to-purple-500 inline-block text-transparent bg-clip-text'>75000 QR</span>
                <button
                // onClick={onAddNewSubject}
                className="flex items-center border border-blue-800 w-full justify-center   px-5    rounded-full"

                // className=" border border-gray-300 px-8 w-full rounded-full"
              >
                <span className="text-blue-800">View All Expenses </span>
                
              </button>
              </div>
             
              {/* <div className="w-full h-50 flex flex-col justify-center items-center bg-red-400  border border-black " >
                <span>Remaining Balances</span>
                <span>75000</span>
                </div>     */}
              {/* <div className="" ></div>    
            <div className="" ></div>    
            <div  className="" ></div>     */}
            </div>
          </div>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Fees"
          >
          <AddEarning/>
          </Sidebar>

        </div>
      </DashLayout>
    </Layout>
  );
};

export default Earning;
