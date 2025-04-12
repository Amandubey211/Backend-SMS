import React, { useEffect, useState } from "react";
import Layout from "../../../../Components/Common/Layout.js";
import DashLayout from "../../../../Components/Admin/AdminDashLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Spin, Table, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading .js";
import { BiCategory } from "react-icons/bi";
import { TbCategory2, TbCategoryMinus } from "react-icons/tb";
import { fetchDayBook } from "../../../../Store/Slices/Finance/dayBook/dayBook.thunk.js";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DayBookMain = () => {
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.common.auth.role);
  const [dayBookData, setDayBookData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  useNavHeading(role, `Day Book`);

  const fetchData = (page = currentPage, limit = pageSize) => {
    setLoading(true);
    const [startDate, endDate] = dateRange || [];
    dispatch(
      fetchDayBook({
        transactionType: categoryType,
        category: searchText,
        page,
        limit,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : undefined,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
      })
    )
      .then((action) => {
        setDayBookData(action?.payload);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [categoryType, searchText, currentPage, pageSize, dateRange]);

  const columns = [
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (val) => <span className={`capitalize text-${val=="revenue"?"green":"red"}-500`}>{val}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val) => <span>{dayjs(val).format("DD MMM YYYY")}</span>,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val) => <span>{val?.toFixed(2)} {schoolCurrency}</span>,
    },
    {
      title: "Linked To",
      dataIndex: "linkedTo",
      key: "linkedTo",
    },
  ];

  return (
    <Layout title={`Finance | Student Diwan`}>
      <DashLayout>
        <div className="p-4">
          {/* Summary Cards */}
          <div className="flex flex-row gap-4 mb-4">
            {[{ title: "Total Income", value: dayBookData?.totalIncome || 0, icon: <BiCategory /> },
            { title: "Total Expense", value: dayBookData?.totalExpense || 0, icon: <TbCategory2 /> },
            { title: "Total Transactions", value: dayBookData?.totalTransactions || 0, icon: <TbCategoryMinus /> }].map((item, index) => (
              <div
                key={index}
                className="p-4 w-full h-full rounded-lg border hover:shadow-lg hover:scale-105 transition-transform duration-300"
                style={{
                  background:
                    "radial-gradient(100.5% 129.64% at 50.05% 35.24%, #FBF7FF 0%, #FFCEDB 100%)",
                  borderColor: "#DABDFF",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-3 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                    {item?.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 truncate">{item?.title}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-purple-800 truncate">
                    {item?.value} {index < 2 ?schoolCurrency:null}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex w-full flex-row items-center justify-between mb-4 gap-4">
            <div className="flex w-full flex-row items-center gap-4">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-80 py-2"
              />
              <Select
                className="px-1 w-[10rem]"
                value={categoryType}
                onChange={(value) => setCategoryType(value)}
                placeholder="Select Type"
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="revenue">Revenue</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </div>

            {/* Date Range Picker */}
            <RangePicker
              className="w-[15rem]"
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </div>

          {/* Table */}
          <Table
            dataSource={dayBookData?.data || []}
            columns={columns}
            pagination={{
              current: currentPage,
              total: dayBookData?.totalTransactions || 0,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              size: "small",
              showTotal: () => `Page ${currentPage} of ${dayBookData?.totalPages || 0} | Total ${dayBookData?.totalTransactions} records`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            loading={{ spinning: loading, indicator: <Spin size="large" /> }}
            bordered
            rowKey={(record, idx) => idx}
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default DayBookMain;
