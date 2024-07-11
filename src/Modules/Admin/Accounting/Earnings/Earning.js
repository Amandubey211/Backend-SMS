import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import { MdAccessTime } from "react-icons/md";
import AddEarning from "./AddEarning";
import Sidebar from "../../../../Components/Common/Sidebar";

const Earning = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editEarning, setEditEarning] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleEditModalOpen = (earning) => {
    setEditEarning(earning);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);
  const fetchTotalAmounts = async () => {
    const token = localStorage.getItem('admin:token');
    try {
      const response = await fetch('http://localhost:8080/admin/total_amount', {
        headers: {
          Authentication: `${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTotalEarnings(data.totalEarning);
        setTotalExpense(data.totalExpense);
        setTotalFees(data.totalFees);
        setRemainingBalance(data.remainingBalance);
      } else {
        throw new Error(data.msg || 'Failed to fetch total amounts');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin:token');
    try {
      const response = await fetch('http://localhost:8080/admin/getearning', {
        headers: {
          Authentication: `${token}` 
        }
      });
      const data = await response.json();
      if (response.ok) {
        setEarnings(data.earnings);
      } else {
        throw new Error(data.msg || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalEarnings = async () => {
    const token = localStorage.getItem('admin:token');
    try {
      const response = await fetch('http://localhost:8080/admin/total_earnings', {
        headers: {
          Authentication: `${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTotalEarnings(data.totalEarnings);
      } else {
        throw new Error(data.msg || 'Failed to fetch total earnings');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleEdit = async (values) => {
    const token = localStorage.getItem('admin:token');
    try {
      const response = await fetch(`http://localhost:8080/admin/updateEarning/${editEarning._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authentication: `${token}`
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Earning updated successfully');
        fetchEarnings();
        handleEditModalClose();
      } else {
        throw new Error(data.msg || 'Failed to update earning');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDelete = async (earningId) => {
    const token = localStorage.getItem('admin:token');
    try {
      const response = await fetch(`http://localhost:8080/admin/deleteEarning/${earningId}`, {
        method: 'DELETE',
        headers: {
          Authentication: `${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Earning deleted successfully');
        fetchEarnings();
      } else {
        throw new Error(data.msg || 'Failed to delete earning');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchEarnings();
    fetchTotalEarnings();
    fetchTotalAmounts(); 
  }, []);

  return (
    <Layout title="Accounting">
      <DashLayout>
        <div className="min-h-screen flex border">
          {/* Left side */}
          <div className="w-[80%] border">
            <div className="w-full h-20 p-4 border flex justify-between items-center" style={{ maxHeight: "90vh" }}>
              <span>All Earnings</span>
              <button onClick={handleSidebarOpen} className="flex items-center border border-gray-300 ps-5 py-0 rounded-full">
                <span className="mr-2">Add New Earning</span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-2xl -mt-2">+</span>
                </div>
              </button>
            </div>
            {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
              <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr className="text-left text-gray-700 bg-gray-100">
                      <th className="px-5 py-3 border-b-2 border-gray-200">Earning Description</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">From</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">Earning Date</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">Amount</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((item, index) => (
                      <tr key={index} className="text-left text-gray-700">
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.description}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.from}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {new Date(item.dateOfEarning).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200">
                          {item.amount}
                        </td>
                        <td className="px-5 py-2 border-b border-gray-200 flex">
  <button
    onClick={() => handleEditModalOpen(item)}
    className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-700 mr-4 transition duration-300"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(item._id)}
    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300"
  >
    Delete
  </button>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Right side - Widgets */}
         
          <div className="w-[20%] flex flex-col items-center">
  <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center">
    <div className="flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    </div>
    <h2 className="text-lg font-semibold">Remaining Balance</h2>
    <p className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">${remainingBalance}</p>
  </div>
  
  <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center">
    <div className="flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    </div>
    <h2 className="text-lg font-semibold">Total Earning</h2>
    <p className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">${totalEarnings}</p>
  </div>
  
  <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center">
    <div className="flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    </div>
    <h2 className="text-lg font-semibold">Total Student Fees</h2>
    <p className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">${totalFees}</p>
    <button className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-full">View All Fees</button>
  </div>
  
  <div className="bg-white shadow rounded-lg p-4 w-full max-w-xs text-center">
    <div className="flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    </div>
    <h2 className="text-lg font-semibold">Total Expenses</h2>
    <p className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">${totalExpense}</p>
    <button className="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-full">View All Expenses</button>
  </div>
</div>

          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title="Add New Earnings"
          >
            <AddEarning />
          </Sidebar>
          <Modal
            title="Edit Earning"
            visible={isEditModalOpen}
            onCancel={handleEditModalClose}
            footer={null}
          >
            {editEarning && (
              <Form
                initialValues={editEarning}
                onFinish={handleEdit}
              >
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please input the description!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="from"
                  label="From"
                  rules={[{ required: true, message: 'Please input the source!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="dateOfEarning"
                  label="Date of Earning"
                  rules={[{ required: true, message: 'Please input the date!' }]}
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: 'Please input the amount!' }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Modal>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Earning;
