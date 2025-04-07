import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Spin, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk.js";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { BiCategory } from "react-icons/bi";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { FaPlusCircle } from "react-icons/fa";
import Sidebar from "../../../../Components/Common/Sidebar.js";
import FinanceCategoryAddForm from "./FinanceCategoryAddForm.js";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { fetchAllIcons } from "../../../../Store/Slices/Admin/Class/actions/iconThunk.js";
import { fetchDayBook } from "../../../../Store/Slices/Finance/dayBook/dayBook.thunk.js";



const FinanceCategory = () => {
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const { categories, loading, total,
    totalPages,
    page,
    totalRevenue, } = useSelector((store) => store.admin.financialCategory);

  const [searchText, setSearchText] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectCategory, setSelectCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  useNavHeading(role, `Categories`);

  useEffect(() => {
     dispatch(fetchDayBook({  search: searchText, page: currentPage, limit: pageSize }));
    dispatch(fetchCategory({ categoryType, search: searchText, page: currentPage, limit: pageSize }));
  }, [dispatch, categoryType, searchText, currentPage, pageSize]);
  useEffect(() => {
      dispatch(fetchAllIcons({ type: "Category" }));
    }, [dispatch]);

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (value) => <span className="text-md">{value || "N/A"}</span>,
      ellipsis: true,
      width: 70,
    },
    {
      title: "Category For",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (value) => <span className="text-md">{value == "revenue" ? "Revenue":"Expense" || "N/A"}</span>,
      ellipsis: true,
      width: 60,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => <span className="text-sm">{value?.slice(0,60) || "-"}</span>,
      ellipsis: true,
      width: 230,
    },
    {
      title: "Action",
      render: (_, record) =>   <div className="flex flex-row gap-4">
      <span className="text-xs text-blue-600 cursor-pointer"  onClick={() => { setSelectCategory(record); setIsModalVisible(true) }} title="Edit"><MdEdit size={20}/></span>
      <span className="text-xs text-blue-600 cursor-pointer"  onClick={() => { setSelectCategory({mode:"view",...record}); setIsModalVisible(true) }}title="View"><MdRemoveRedEye size={20}/></span>
      </div>,
      width: 30,
    },
  ];

  return (
    <Layout title={`Finance | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          <div className="flex flex-row gap-4 mb-4">
            {[{ title: "Total Categories", value: total, icon: <BiCategory /> },
            { title: "Total Revenue Categories", value: totalRevenue, icon: <TbCategory2 /> },
            { title: "Total Expense Categories", value: total - totalRevenue, icon: <TbCategoryMinus /> }].map((item, index) => (
              <div
        className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
        style={{
          background:
            "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
          borderColor: "#DABDFF",
        }}
      >
        {/* Title and Icon */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
            {item?.icon}
          </div>
          <h3 className="text-sm font-medium text-gray-800 truncate">{item?.title}</h3>
        </div>
  
        {/* Value and Trend */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-purple-800 truncate">
            {item?.value}
          </h2>
        </div>
      </div>
            ))}
          </div>

          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div className="flex w-full flex-row items-center gap-4">
              <Input
                placeholder="Search by description, name..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-80 py-2"
              />
              <Select
                className=" px-1  w-[10rem] "
                value={categoryType}
                onChange={(value) => setCategoryType(value)}
                placeholder="Select Type"
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="revenue">Revenue</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>

              </Select>

            </div>
            <div className="w-[15rem]">
          
              uese rangelpicker andt
            </div>

          </div>

          <Table
            dataSource={categories}
            columns={columns}
            pagination={{
              current: currentPage,
              total: total,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              size: "small",
              showTotal: (total) => `Page ${currentPage} of ${totalPages} | Total ${total} records`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
                dispatch(fetchCategory({ categoryType, search: searchText, page, limit: size }));
              },
            }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            bordered
          />
        </div>
        <Sidebar
          title={selectCategory ? "Category Full Information" : "Add Category"}
          width="25%"
          isOpen={isModalVisible}
          onClose={handleModalClose}
        >

          <FinanceCategoryAddForm visible={isModalVisible} onClose={handleModalClose} editData={selectCategory} />

        </Sidebar>


      </DashLayout>
    </Layout>
  );
};

export default FinanceCategory;