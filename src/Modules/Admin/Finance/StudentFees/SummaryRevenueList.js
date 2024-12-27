import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Spin, Alert, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../Components/Admin/AdminDashLayout";
import { FiUserPlus } from "react-icons/fi";
import { deleteStudentFees } from "../../../../Store/Slices/Finance/StudentFees/studentFeesThunks";
import moment from "moment"; // Replaced dayjs with moment
import { fetchAllIncomes } from "../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import Spinner from "../../../../Components/Common/Spinner";
import NoDataFound from "../../../../Components/Common/NoDataFound";

const SummaryRevenueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { incomes, loading, error, totalRecords } = useSelector(
    (state) => state.admin.earnings
  );

  let sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const classList = useSelector((state) => state.admin.class.classes);

  const [params, setParams] = useState({
    limit: 10,
    categoryName: "Student-Based Revenue",
    includeDetails:true,
    classId: "",
    sectionId: "",
    subCategory: "",
    paymentStatus: "",
  });

  useEffect(() => {
    dispatch(fetchAllClasses());
    dispatch(fetchAllIncomes(params)); // Fetch initial data
  }, [dispatch, params]);

  const filterOnchange = (e) => {
    const { name, value } = e.target;
   

    // Fetch filtered incomes immediately
    if (name === "classId") {
      if(!value){
        setParams((prev) => ({
          ...prev,
          sectionId:'', 
        }));
        dispatch(fetchSectionsNamesByClass("675bc4e3e7901c873905fd2f")); 
      }else{
        dispatch(fetchSectionsNamesByClass(value)); 
      }
      
    }
    setParams((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "studentDetails",
      key: "studentDetails",
      render: (studentDetails) =>
        studentDetails?.firstName?.slice(0,10)+'..' || "N/A",
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
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-medium ${
            status === "paid"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      ),
    },
 
    {
      title: "Final Amount",
      dataIndex: "final_amount",
      key: "final_amount",
      sorter: (a, b) => (a.final_amount || 0) - (b.final_amount || 0),
      render: (amount) => <span>{`${amount.toFixed(2)} QR`}</span>,
    },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      sorter: (a, b) => a.paid_amount - b.paid_amount,
      render: (amount) => <span>{`${amount.toFixed(2)} QR`}</span>,
    },
    {
      title: "Date",
      dataIndex: "paidDate",
      key: "paidDate",
      sorter: (a, b) => new Date(a.paidDate) - new Date(b.paidDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount, record) => (
        <span>
          {discount
            ? record.discountType === "percentage"
              ? `${discount}%`
              : `${discount} QR`
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                // onClick={() => {
                //   const incomeToEdit = incomeIdMap[record.key];
                //   if (incomeToEdit) {
                //     dispatch(setReadOnly(true)); // Set readOnly to true for viewing
                //     dispatch(setSelectedIncome(incomeToEdit)); // Dispatch the selected income to Redux
                //     navigate("/finance/earning/add"); // Navigate without passing state
                //   } else {
                //     toast.error("Selected income not found.");
                //   }
                // }}
                className="text-blue-600 hover:text-blue-800 p-0"
                aria-label="Edit"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                // onClick={() => {
                //   const incomeToDelete = incomeIdMap[record.key];
                //   if (incomeToDelete) {
                //     setSelectedIncomeForDeletion(incomeToDelete); // Set income for deletion
                //     setIsDeleteModalVisible(true);
                //   } else {
                //     toast.error("Selected income not found.");
                //   }
                // }}
                className="text-red-600 hover:text-red-800 p-0"
                aria-label="Delete"
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
                <span className="text-gray-700">Partial </span>
              </label>
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="radio"
                  name="paymentStatus"
                  className="form-radio text-gray-500"
                  value="unpaid"
                  onChange={filterOnchange}
                />
                <span className="text-gray-700">Unpaid </span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90"
              onClick={() => console.log("Exporting data...")}
            >
              Export
            </button>
            <button
              onClick={() => navigate("/finance/studentfees/add/form")}
              className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
            >
              <span className="text-gray-800 font-medium">Add New Fee</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                <FiUserPlus size={16} />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <Spinner/>
          ) : error ? (
           <NoDataFound/>
          ) : (
            <Table
              dataSource={incomes}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: totalRecords,
                onChange: (page) => {
                  setCurrentPage(page);
                  dispatch(fetchAllIncomes({ ...params, page }));
                },
              }}
              rowKey="_id"
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SummaryRevenueList;
