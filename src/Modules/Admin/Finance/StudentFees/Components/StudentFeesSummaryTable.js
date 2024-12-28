import React, { useEffect, useState, useMemo } from "react";
import { Table, Spin, Alert, Input, Button,Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchAllIncomes } from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import Spinner from "../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../Components/Common/NoDataFound";

const StudentFeesSummaryTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { incomes, loading, error, totalRecords } = useSelector(
    (state) => state.admin.earnings
  );

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page

  useEffect(() => {
    dispatch(
      fetchAllIncomes({
        page: currentPage,
        limit: 10,
        categoryName: "Student-Based Revenue",
        includeDetails:true
      })
    );
  }, [dispatch, currentPage]);

  // Handle search filtering
  const filteredData = useMemo(() => {
    if (!incomes) return [];
    return incomes?.slice(0,5)?.filter((item) => {
      const searchableString = [
        item?.category?.[0]?.categoryName,
        item?.subCategory,
        item?.description,
        item?.paymentStatus,
        item?.paymentType,
        item?.final_amount,
      ]
        .join(" ")
        .toLowerCase();
      return searchableString.includes(searchText.toLowerCase());
    });
  }, [incomes, searchText]);

  // Table columns definition
  const columns = [
    {
      title: "Student",
      dataIndex: "studentDetails",
      key: "studentDetails",
      render:(studentDetails) => studentDetails?.firstName?.slice(0,10)+'..' || "N/A",
    },
    {
      title: "Class ",
      dataIndex: "classDetails",
      key: "classDetails",
      render: (classDetails) => classDetails?.className ||"N/A",
    },
    {
      title: "Sub-Category",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (subCategory) => subCategory || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
      render: (value) => (value ? `${value} QAR` : "N/A"),
    },
    {
      title: "Status",
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
      width: 80,
      ellipsis: true,
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (type) => type || "N/A",
    },
    {
      title: "Date",
      dataIndex: "paidDate",
      key: "paidDate",
      sorter: (a, b) => new Date(a.paidDate) - new Date(b.paidDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
  ];

  return (
    <div className="w-full">
      {/* Heading and Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          Summary of Student Fees
        </h3>
        <div className="flex items-center space-x-4">
          {/* View More Button */}
          <Button
            type="primary"
            onClick={() => navigate("/finance/studentfees/total-revenue")}
          >
            View More {totalRecords}
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
    {loading && <Spinner/>}
    
    {error && <NoDataFound/>}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id" 
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}
    </div>
  );
};

export default StudentFeesSummaryTable;
