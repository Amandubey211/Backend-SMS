


import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Spin, Alert, Tooltip, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined, EyeOutlined, ExportOutlined, DollarCircleOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import moment from "moment"; // Replaced dayjs with moment
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import EditStudentFeesForm from "./EditStudentFeesForm";
import Sidebar from "../../../../Components/Common/Sidebar";
import { deleteStudentFees } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import { FaPlusCircle } from "react-icons/fa";
import { setCurrentPage } from "../../../../Store/Slices/Finance/Earnings/earningsSlice";

const SummaryRevenueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const {
      incomes,
      loading,
      error,
      totalRecords,
      totalPages,
      currentPage,
    } = useSelector((state) => state.admin.earnings);
  const [computedPageSize, setComputedPageSize] = useState(10);
  let sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const classList = useSelector((state) => state.admin.class.classes);

  const [params, setParams] = useState({
    limit:  computedPageSize,
    categoryName: "Student-Based Revenue",
    includeDetails: true,
    classId: "",
    sectionId: "",
    subCategory: "",
    page:currentPage
  });

  const [selectedRowIds, setSelectedRowIds] = useState([]); // To store selected rows

  

  const filterOnchange = (e) => {
    const { name, value } = e.target;

    // Fetch filtered incomes immediately
    if (name === "classId") {
      if (!value) {
        setParams((prev) => ({
          ...prev,
          sectionId: "",
        }));
        dispatch(fetchSectionsNamesByClass("675bc4e3e7901c873905fd2f"));
      } else {
        dispatch(fetchSectionsNamesByClass(value));
      }
    }
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    dispatch(fetchAllClasses())
    dispatch(fetchAllIncomes(params));
  }, [dispatch,params]);
  const handleDeleteSelected = () => {
    if (selectedRowIds.length > 0) {
      dispatch(deleteStudentFees({ids:selectedRowIds})).then(()=>dispatch(fetchAllIncomes(params)));
      setSelectedRowIds([]); 
    } else {
      console.log("No rows selected");
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowIds(selectedRowKeys);
    },
    selectedRowKeys: selectedRowIds,
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "studentDetails",
      key: "studentDetails",
      render: (studentDetails) =>
        <Tooltip title={studentDetails?.firstName +' ' +studentDetails?.lastName}>
        {studentDetails?.firstName?.slice(0, 10) + ".." || "N/A"}
        </Tooltip>
    },
    {
      title: "Class",
      dataIndex: "classDetails",
      key: "classDetails",
      render: (classDetails) => classDetails?.className || "N/A",
    },
    {
      title: "Sub-Category",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    
          {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            sorter: (a, b) => a.total_amount - b.total_amount,
            render: (amount) => <span>{`${amount.toFixed(2)} QAR`}</span>,
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
            {status || "N/A"}
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
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value, record) =>
        record.discountType === "percentage" ? (
          <Tag color="purple" className="text-xs">
            {value || 0}%
          </Tag>
        ) : (
          <Tag color="orange" className="text-xs">
            {value || 0} QAR
          </Tag>
        ),
      width: 100,
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div
          className="flex space-x-1"
          onClick={(e) => e.stopPropagation()}
        >
           <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                handleEditClick(record);
              }}
              className="text-blue-600 hover:text-blue-800 p-0"
              aria-label="Edit"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                handleEditClick(record);
              }}
              className="text-blue-600 hover:text-blue-800 p-0"
              aria-label="Edit"
            />
          </Tooltip>
         
        </div>
      ),
    },
  ];

  const subCategoryList = [
    "Tuition Fees",
    "Hotel Fees",
    "Application Fees",
    "Certificate Fees",
    "Meal Fees",
    "Event Fees",
    "Exam Fees",
    "Transport Fees",
    "Other",
  ];

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEditClick = (record) => {
    setSelectedRecord(record); // Set the selected record
    setIsEditModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false); // Close the modal
    setSelectedRecord(null); // Clear selected record
  };

  return (
  
    <AdminLayout>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        {/* Filters and Buttons Section */}
        <div className="flex justify-between items-start">
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              {/* Class Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Class</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28"
                  onChange={filterOnchange}
                  name="classId"
                >
                  <option value="">All</option>
                  {classList?.map((i) => (
                    <option value={i._id} key={i._id}>
                      {i.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Section</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-28"
                  name="sectionId"
                  onChange={filterOnchange}
                >
                  <option value="">ALL</option>
                  {sectionList?.map((i) => (
                    <option value={i?._id} key={i?._id}>
                      {i?.sectionName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fees Type Filter */}
              <div className="flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Fees Type</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-36"
                  name="subCategory"
                  onChange={filterOnchange}
                >
                  <option value="">All</option>
                  {subCategoryList.map((i, idx) => (
                    <option value={i} key={idx}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  className="form-radio text-green-600"
                  value=""
                  defaultChecked
                  onChange={filterOnchange}
                />
                <span className="text-green-600 font-medium">Everyone</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  className="form-radio text-gray-500"
                  value="paid"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Paid</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  className="form-radio text-gray-500"
                  value="partial"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Partial</span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  className="form-radio text-gray-500"
                  value="unpaid"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Unpaid</span>
              </label>
              <div className="flex items-center space-x-4 ">
            {selectedRowIds.length > 0 && (
              <Button
                type="danger"
                onClick={handleDeleteSelected}
                icon={<DeleteOutlined />}
              >
                Delete Selected
              </Button>
            )}
          </div>
            </div>
            
          </div>
          <div className="flex items-center space-y-4 flex-col">
            
           <div>
           <button
              onClick={() => navigate("/finance/studentfees/add/form")}
              className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">Add New Fees</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <FiPlus size={16} />
              </div>
            </button>
           </div>
           <div className="flex items-center space-x-4 flex-row">
           {selectedRowIds?.length == 1 && (
                <Tooltip title="Create an invoice for the selected unpaid record">
                  <Button
                   
                    icon={<DollarCircleOutlined />}
                    onClick={() => {

                        navigate("/finance/invoices/add-new-invoice")}}
                     
                  
                 className="flex items-center  px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-lg rounded-lg hover:opacity-90"
                  >
                    Create Invoice
                  </Button>
                </Tooltip>
              )}
            <button
              className="flex items-center  px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90"
              onClick={() => console.log("Exporting data...")}
            >
              <ExportOutlined className="pr-2" /> Export
            </button>
            </div>
          </div>
        
        </div>
        
        <div className="mt-6">
          {loading ? (
            <Spinner />
          ) : error ? (
            <NoDataFound />
          ) : (
            <Table
              rowSelection={rowSelection}
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
                               dispatch(fetchAllIncomes({
                                limit:  pageSize,
                                categoryName: "Student-Based Revenue",
                                includeDetails: true,
                                classId: "",
                                sectionId: "",
                                subCategory: "",
                                page:page
                              }));
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
        title="Edit/View Student Fees"
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
    </AdminLayout>
  );
};

export default SummaryRevenueList;
