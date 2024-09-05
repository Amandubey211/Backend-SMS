import React, { useState, useEffect } from "react";
import { message } from "antd";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddEarning from "./AddEarning";
import EditEarning from "./EditEarning";
import { GiMoneyStack } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { baseUrl } from "../../../../config/Common";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";

const Earning = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditSidebarOpen, setEditSidebarOpen] = useState(false);
  const [editEarning, setEditEarning] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleEditSidebarOpen = (earning) => {
    setEditEarning(earning);
    setEditSidebarOpen(true);
  };
  const handleEditSidebarClose = () => setEditSidebarOpen(false);

  const fetchTotalAmounts = async () => {
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await fetch(`${baseUrl}/admin/total_amount`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTotalEarnings(data.totalEarning);
        setTotalExpense(data.totalExpense);
        setTotalFees(data.totalFees);
        setRemainingBalance(data.remainingBalance);
      } else {
        throw new Error(data.msg || "Failed to fetch total amounts");
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await fetch(`${baseUrl}/admin/getearning`, {
        headers: {
          Authentication: `${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setEarnings(data.earnings);
      } else {
        throw new Error(data.msg || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (earningId) => {
    const token = localStorage.getItem(`${role}:token`);
    try {
      const response = await fetch(
        `${baseUrl}/admin/deleteEarning/${earningId}`,
        {
          method: "DELETE",
          headers: {
            Authentication: `${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Earning deleted successfully");
        fetchEarnings();
        fetchTotalAmounts();
      } else {
        throw new Error(data.msg || "Failed to delete earning");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchEarnings();
    fetchTotalAmounts();
  }, []);

  return (
    <Layout title="Accounting">
      <DashLayout>
        <div className="min-h-screen flex">
          <div className="w-[75%] border-r">
            <div
              className="w-full h-20 p-4 border-b flex justify-between items-center"
              style={{ maxHeight: "90vh" }}
            >
              <span>All Earnings</span>
              <button
                onClick={handleSidebarOpen}
                className="flex items-center border border-gray-300 ps-5 py-0 rounded-full"
              >
                <span className="mr-2">Add New Earning</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-2xl -mt-2">+</span>
                </div>
              </button>
            </div>
            {loading ? (
              <Spinner />
            ) : error ? (
              <NoDataFound />
            ) : (
              <div className="overflow-x-auto h-full bg-white shadow rounded-lg ">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="text-left text-gray-700 bg-gray-100 ">
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
                    {earnings.map((item, index) => (
                      <tr key={index} className=" text-gray-700">
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.description}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.from}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {formatDate(item.dateOfEarning)}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.amount} QR
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200 font-bold relative">
                          <button
                            onClick={() => handleDropdownToggle(index)}
                            className="text-gray-500 hover:text-gray-700 transition duration-300"
                          >
                            &#x22EE;
                          </button>
                          {openDropdown === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  handleEditSidebarOpen(item);
                                  handleDropdownClose();
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(item._id);
                                  handleDropdownClose();
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="w-[25%] flex flex-col items-center gap-4 p-4">
            <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-black-0 rounded-full p-4 border border-red-500">
                  <GiMoneyStack size={40} color="red" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Remaining Balance
              </h2>
              <p className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {remainingBalance} QR
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white rounded-full p-4 border border-green-500">
                  <GiMoneyStack size={40} color="green" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Total Earning
              </h2>
              <p className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {totalEarnings} QR
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white rounded-full p-4 border border-blue-500">
                  <GiTakeMyMoney className="size-10 text-blue-400" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Total Student Fees
              </h2>
              <p className="text-3xl mb-5 font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {totalFees} QR
              </p>
              <Link
                to="/accounting/studentfees"
                className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-full"
              >
                View All Fees
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white rounded-full p-4 border border-red-500 ">
                  <HiOutlineBanknotes className="size-10 text-red-500" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Total Expenses
              </h2>
              <p className="text-3xl mb-5 font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {totalExpense} QR
              </p>
              {/* <Link to="/accounting/expenses" className="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-full">
              View All Expenses
              </Link> */}
            </div>
          </div>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Earnings"
          >
            <AddEarning
              fetchEarning={fetchEarnings}
              fetchTotalAmounts={fetchTotalAmounts}
              handleSidebarClose={handleSidebarClose}
            />
          </Sidebar>

          <Sidebar
            isOpen={isEditSidebarOpen}
            onClose={handleEditSidebarClose}
            title="Update Earning"
          >
            {editEarning && (
              <EditEarning
                earning={editEarning}
                onClose={handleEditSidebarClose}
                onUpdate={fetchEarnings}
                fetchTotalAmounts={fetchTotalAmounts}
              />
            )}
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Earning;
