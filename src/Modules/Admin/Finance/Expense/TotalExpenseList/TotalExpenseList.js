import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  Spin,
  Alert,
  Tooltip,
  Card,
  Tag,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { fetchAllExpenses } from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import { setCurrentPage } from "../../../../../Store/Slices/Finance/Expenses/expensesSlice";
import debounce from "lodash.debounce";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const TotalExpenseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useNavHeading("Expense", "List");

  // Redux state
  const {
    expenses,
    loading,
    error,
    totalRecords,
    totalPages,
    currentPage,
    pageSize,
    totalExpense,
    remainingPartialPaidExpense,
    unpaidExpense,
    totalPaidAmount,
  } = useSelector((store) => store.admin.expenses);

  const [searchText, setSearchText] = useState("");

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((params) => {
      dispatch(fetchAllExpenses(params));
    }, 500),
    [dispatch]
  );

  // Fetch expenses on mount and dependencies change
  useEffect(() => {
    const params = {
      search: searchText,
      page: currentPage,
      limit: 10,
    };
    debouncedFetch(params);
  }, [debouncedFetch, searchText, currentPage]);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    dispatch(setCurrentPage(1));
  };

  // Format functions
  const formatCurrency = (value) =>
    value !== undefined && value !== null
      ? `${value.toLocaleString()} QR`
      : "N/A";

  // Table columns
  const columns = useMemo(
    () => [
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (text) => <span className="text-xs">{text}</span>,
        ellipsis: true,
        width: 200,
      },
      {
        title: "Payment Type",
        dataIndex: "paymentType",
        key: "paymentType",
        render: (type) => <span className="text-xs capitalize">{type}</span>,
        width: 100,
      },
      {
        title: "Payment Status",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (status) => {
          let color = "default";
          switch (status) {
            case "paid":
              color = "green";
              break;
            case "partial":
              color = "yellow";
              break;
            case "unpaid":
              color = "red";
              break;
            default:
              color = "default";
          }
          return (
            <Tag color={color} className="text-xs capitalize">
              {status || "N/A"}
            </Tag>
          );
        },
        width: 100,
      },
      {
        title: "Final Amount",
        dataIndex: "finalAmount",
        key: "finalAmount",
        render: (value) => (
          <span className="text-xs">{formatCurrency(value)}</span>
        ),
        width: 120,
      },
      {
        title: "Paid Amount",
        dataIndex: "paidAmount",
        key: "paidAmount",
        render: (value) => (
          <span className="text-xs text-green-600">
            {formatCurrency(value)}
          </span>
        ),
        width: 120,
      },
      {
        title: "Remaining Amount",
        dataIndex: "remainingAmount",
        key: "remainingAmount",
        render: (value) => (
          <span className="text-xs text-red-600">{formatCurrency(value)}</span>
        ),
        width: 120,
      },
    ],
    []
  );

  // DataSource for Table
  const dataSource = useMemo(
    () =>
      expenses?.map((expense) => ({
        key: expense._id,
        description: expense.description,
        paymentType: expense.paymentType,
        paymentStatus: expense.paymentStatus,
        finalAmount: expense.finalAmount,
        paidAmount: expense.paidAmount,
        remainingAmount: expense.remainingAmount,
      })),
    [expenses]
  );

  // Compute pageSize from totalRecords and totalPages to reflect backend pagination
  const computedPageSize =
    totalPages > 0 ? Math.ceil(totalRecords / totalPages) : pageSize;

  // Statistics for Top Cards
  const cardData = useMemo(
    () => [
      {
        title: "Total Expense",
        icon: <DollarCircleOutlined />,
        color: "purple",
        amount: formatCurrency(totalExpense),
      },
      {
        title: "Remaining Partial Paid",
        icon: <PieChartOutlined />,
        color: "yellow",
        amount: formatCurrency(remainingPartialPaidExpense),
      },
      {
        title: "Unpaid Amount",
        icon: <ExclamationCircleOutlined />,
        color: "red",
        amount: formatCurrency(unpaidExpense),
      },
      {
        title: "Paid Amount",
        icon: <CheckCircleOutlined />,
        color: "green",
        amount: formatCurrency(totalPaidAmount),
      },
    ],
    [totalExpense, remainingPartialPaidExpense, unpaidExpense, totalPaidAmount]
  );

  return (
    <Layout title="Expense List | Student Diwan">
      <DashLayout>
        <div className="p-4 space-y-3">
          {/* Top Cards Row */}
          <div className="w-full flex flex-wrap justify-center items-stretch gap-4">
            {cardData.map((card, index) => (
              <Card
                key={index}
                title={
                  <div
                    className={`flex items-center gap-2 font-bold text-${card.color}-800`}
                  >
                    {card.icon}
                    {card.title}
                  </div>
                }
                className={`bg-${card.color}-100 shadow-sm border-none`}
                headStyle={{ borderBottom: "none" }}
                style={{
                  flex: "1 1 200px",
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                <p className={`text-${card.color}-800 text-lg font-bold`}>
                  {card.amount}
                </p>
              </Card>
            ))}
          </div>

          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Expense List</h3>
            <Input
              placeholder="Search expenses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              allowClear
              className="w-64"
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
            />
          )}

          {/* Table */}
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              current: currentPage,
              total: totalRecords,
              pageSize: computedPageSize,
              showSizeChanger: false,
            }}
            loading={loading}
            bordered
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default TotalExpenseList;
