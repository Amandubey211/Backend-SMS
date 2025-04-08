import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "../../../../Components/Common/Layout";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import { FaFileBudget } from "react-icons/fa";
import { MdDeleteOutline, MdEdit, MdOutlineEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GiTakeMyMoney } from "react-icons/gi";
import { fetchBudgetsummary, updateBudget } from "../../../../Store/Slices/Finance/budget/budget.thunk";
import Sidebar from "../../../../Components/Common/Sidebar";
import CreateBudgetForm from "./CreateBudget";
import { Form, Input, DatePicker, Select, InputNumber,Table } from "antd";
const BudgetList = () => {
  const dispatch = useDispatch();
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);

  const { allBudgetDetails, loading, currentPage, totalRecords, totalPages } = useSelector(
    (store) => store.admin.budget
  );

  const [searchText, setSearchText] = useState("");
  const [computedPageSize, setComputedPageSize] = useState(10); // Default page size

  useEffect(() => {
    dispatch(fetchBudgetsummary({ page: currentPage || 1, subCategory: searchText, limit: computedPageSize }));
  }, [dispatch, currentPage, computedPageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    dispatch(fetchBudgetsummary({ page: 1, subCategory: value, limit: computedPageSize }));
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      title: "Budget Allocated",
      render: (_, record) => `${record.totalBudget} ${schoolCurrency} / ${record.frequency}  `,
    },
    {
      title: "Total Spend Amount",
      dataIndex: "spendAmount",
      render: (spendAmount) => `${spendAmount} ${schoolCurrency}`
    },
    {
      title: "Status",
      render: (_, record) => {
        let text = "With in budget";

        if (record.frequency === "monthly") {
          text = record?.totalBudget / 12 > record?.spendAmount / 12
            ? "With in budget"
            : "Over Budget";
        } else {
          text = record?.totalBudget > record?.spendAmount
            ? "With in budget"
            : "Over Budget";
        }

        return (
          <p className={`text-${text === "With in budget" ? "green" : "red"}-500`}>
            {text}
          </p>
        );
      },
    },
    {
      title: "Active",
      render: (_, record) => {
        let text = "Yes";
        text = record?.active ? "Yes" : "No";
        return (
          <p className={`text-${text == "Yes" ? "green" : "red"}-500`}>
            {text}
          </p>
        );
      },
    },
    {
      title: "Action",
      render: (_, record) => <div className="flex flex-row gap-4">
        <span className="text-xs text-blue-600 cursor-pointer"
          onClick={() => {
            console.log(record);
            
             setSelectedBudget(null);setSelectedBudget(record); setBudgetVisible(true) }}
          title="Edit"><MdEdit size={20} /></span>
      </div>,
    },
  ];


  const navigate = useNavigate();
  const [isBudgetVisible, setBudgetVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const handleModalClose = () => {
    setSelectedBudget(null)
    setBudgetVisible(false)
  }
    const [form] = Form.useForm();
    const handleUpdate = (value)=>{
     dispatch(updateBudget({...value,_id:selectedBudget._id}))
    }
    useEffect(() => {
      if (selectedBudget) {
        form.setFieldsValue({
          ...selectedBudget,
          amount: selectedBudget.totalBudget
        });
      }
    }, [selectedBudget]);
  return (
    <Layout title="Finance | Expense List">
      <AdminDashLayout>
        <div className="p-4">
          <div className="flex flex-row items-center justify-between">
            <Input
              placeholder="Search by Sub-Category..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              style={{ width: 300, marginBottom: 16 }}
            />
            <div>
              <button
                onClick={() => {
                  setSelectedBudget(null)
                  setBudgetVisible(true)
                }}
                className="inline-flex  items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2 mb-4"
              >
                <span className="text-gray-800 font-medium">Create Budget</span>
                <div className="w-12 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                  <GiTakeMyMoney size={20} />
                </div>
              </button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={allBudgetDetails}
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: computedPageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              size: "small",
              showTotal: () =>
                `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
              onChange: (page, pageSize) => {
                dispatch(fetchBudgetsummary({ page, subCategory: searchText, limit: pageSize }));
              },
              onShowSizeChange: (current, size) => {
                setComputedPageSize(size); // Update local state
                dispatch(fetchBudgetsummary({ page: 1, subCategory: searchText, limit: size }));
              },
            }}
            rowKey="_id"
            loading={loading}
          />
        </div>

        <Sidebar title={selectedBudget ? "Update Budget" : "Create Budget"}
          width="30%"
          isOpen={isBudgetVisible}
          onClose={handleModalClose}>
          {
            selectedBudget ? <>
              <Form form={form} layout="vertical" 
              onFinish={handleUpdate}
              initialValues={{...selectedBudget,amount:selectedBudget.totalBudget}}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Category"
                    required
                  >
                    <Input placeholder="Category" readOnly value={selectedBudget?.category} />
                  </Form.Item>
                  <Form.Item name="subCategory" label="Sub Category" rules={[{ required: true, message: "Enter Sub Category" }]}>
                    <Input placeholder="Sub Category" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Enter Amount" }]}>
                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter Amount" />
                  </Form.Item>

                  <Form.Item name="active" label="Active" rules={[{ required: true, message: "Active" }]}>
                    <select placeholder="Select Option" className="w-[13rem] h-[2.5rem] border border-gray-200 rounded-lg">
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                    </select>
                  </Form.Item>
                </div>
                <Form.Item name="purpose" label="Purpose">
                  <Input.TextArea placeholder="Enter Purpose" rows={3} />
                </Form.Item>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-full py-2 rounded-md"
                >
                  Update Budget
                </button>
              </Form>
            </> : <CreateBudgetForm onClose={handleModalClose} />

          }

        </Sidebar>
      </AdminDashLayout>
    </Layout>
  );
};

export default BudgetList;
