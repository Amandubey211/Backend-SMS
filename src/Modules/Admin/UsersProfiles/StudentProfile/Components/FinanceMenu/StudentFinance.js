import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Spin, Alert, Tooltip, Tag, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeOutlined,

} from "@ant-design/icons";

import moment from "moment";
import Spinner from "../../../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../../config/permission";
import { fetchAllIncomes } from "../../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import { setCurrentPage } from "../../../../../../Store/Slices/Finance/Earnings/earningsSlice";
import EditStudentFeesForm from "../../../../Finance/StudentFees/EditStudentFeesForm";



const StudentFinance = ({ student }) => {
 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { incomes, loading, error, totalRecords, totalPages, currentPage } =
    useSelector((state) => state.admin.earnings);
  const [computedPageSize, setComputedPageSize] = useState(10);


  // New search state
  const [searchText, setSearchText] = useState("");

  const [params, setParams] = useState({
    limit: computedPageSize,
    categoryName: "Student-Based Revenue",
    includeDetails: true,
    classId: "",
    sectionId: "",
    studentId:student._id,
    subCategory: "",
    page: currentPage,
    search: "", // added search parameter
  });

 

 useEffect(() => {
   
    dispatch(fetchAllIncomes(params));
  }, [dispatch]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };
  const capitalizeFirstLetter = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "N/A";

  const columns = [

    {
      title: "Sub-Category",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => <span>{capitalizeFirstLetter(text)}</span>,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      sorter: (a, b) => a.total_amount - b.total_amount,
      render: (amount) => <span>{`${amount.toFixed(2)} QAR`}</span>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value, record) =>
        record.discountType === "percentage" ? (
          <Tag color="purple" className="text-xs">
            {`${value || 0}%`}
          </Tag>
        ) : (
          <Tag color="orange" className="text-xs">
            {`${value || 0} QAR`}
          </Tag>
        ),
      width: 100,
      ellipsis: true,
    },
    {
      title: "Final Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
      render: (amount) => <span>{`${amount.toFixed(2)} QAR`}</span>,
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
            {capitalizeFirstLetter(status)}
          </Tag>
        );
      },
      width: 80,
      ellipsis: true,
    },
    {
      title: "Paid Date",
      dataIndex: "paidDate",
      key: "paidDate",
      sorter: (a, b) => new Date(a.paidDate) - new Date(b.paidDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                handleEditClick({ ...record, mode: "View" });
              }}
              className="text-blue-600 hover:text-blue-800 p-0"
              aria-label="View"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

 

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  

  const handleModalClose = () => {
    setIsEditModalVisible(false);
  };


return(
<>
        <ProtectedSection
          requiredPermission={PERMISSIONS.SUMMARY_OF_STUDENT_FEES}
          title={"Fees List"}
        >
          <div className="p-6 bg-white rounded-lg">
           

            <div className="mt-6">
              {loading ? (
                <Spinner />
              ) : (
                <Table
                  dataSource={incomes}
                  columns={columns}
                  pagination={{
                    current: currentPage,
                    total: totalRecords,
                    pageSize: computedPageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    size: "small",
                    showTotal: (total, range) =>
                      `Page ${currentPage} of ${totalPages} | Total ${totalRecords} records`,
                    onChange: (page, pageSize) => {
                      dispatch(setCurrentPage(page));
                      setComputedPageSize(pageSize);
                      dispatch(
                        fetchAllIncomes({
                          limit: pageSize,
                          categoryName: "Student-Based Revenue",
                          includeDetails: true,
                          classId: "",
                          sectionId: "",
                          subCategory: "",
                          page: page,
                          search: searchText,
                        })
                      );
                    },
                    onShowSizeChange: (current, size) => {
                      setComputedPageSize(size);
                      dispatch(setCurrentPage(1));
                    },
                  }}
                  rowKey="_id"
                  size="small"
                />
              )}
            </div>
          </div>
          <Sidebar
            title="View Student Fees"
            isOpen={isEditModalVisible}
            onClose={handleModalClose}
            width="70"
          >
              {selectedRecord && (
                          <EditStudentFeesForm
                            data={selectedRecord}
                            onClose={handleModalClose}
                          />
                        )}
          </Sidebar>
        </ProtectedSection>
    </>
  );
};

export default StudentFinance;
