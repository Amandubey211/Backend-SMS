import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../../../Components/Common/Sidebar";
import Layout from "../../../../Components/Common/Layout";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import AddFeesForm from "../subClass/component/AddFeesForm";
import FormField from "../subClass/component/FormField";
import { baseUrl } from "../../../../config/Common";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import EditFee from "./EditFee";
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import toast from "react-hot-toast";
import axios from "axios";
import useGetAllClasses from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useGetAllClasses";
import {
  setEditFormData,
  setFilters,
  setModalOpen,
  setSidebarEditOpen,
  setSidebarOpen,
} from "../../../../Store/Slices/Admin/Accounting/StudentFees/studentFeesSlice";
import {
  deleteStudentFee,
  fetchClasses,
  fetchFees,
} from "../../../../Store/Slices/Admin/Accounting/StudentFees/studentFees.action";
import NoDataFound from "../../../../Components/Common/NoDataFound";
const AccountingSection = () => {
  const {
    isSidebarOpen,
    isSidebarEditOpen,
    feesData,
    filters,
    editFormData,
    isModalOpen,
  } = useSelector((store) => store?.admin?.student_fees);
  const dispatch = useDispatch();
  const [showEditMenu, setShowEditMenu] = useState({ show: false, index: 0 });

  useEffect(() => {
    dispatch(fetchFees());
    dispatch(fetchClasses());
  }, [dispatch]);

  const uniqueFilterOptions = (data, key) => {
    return [...new Set(data.map((item) => item?.[key]))].sort();
  };

  const classes = useMemo(
    () =>
      uniqueFilterOptions(
        feesData.map((fd) => fd.studentId?.presentClassId),
        "className"
      ),
    [feesData]
  );
  const feesTypes = useMemo(
    () => uniqueFilterOptions(feesData, "feeType"),
    [feesData]
  );

  const handleSidebarOpen = () => {
    dispatch(setSidebarOpen(true));
  };
  const handleSidebarEditOpen = () => {
    dispatch(setSidebarEditOpen(true));
  };
  const handleSidebarClose = () => {
    dispatch(setSidebarOpen(false));
    dispatch(setSidebarEditOpen(false));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleStatusChange = (status) => {
    dispatch(setFilters({ status }));
  };

  const filteredData = feesData.filter((item) => {
    return (
      (filters.class === "" ||
        item?.studentId?.presentClassId?.className === filters.class) &&
      (filters.feesType === "" || item?.feeType === filters.feesType) &&
      (filters.status === "Everyone" ||
        (filters.status === "Paid" && item?.status === "paid") ||
        (filters.status === "Unpaid" && item?.status === "unpaid"))
    );
  });

  const openModal = () => {
    dispatch(setModalOpen(true));
  };

  const closeModal = () => {
    dispatch(setModalOpen(false));
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle cases with undefined or empty strings
    const firstLetter = str.charAt(0);
    // Check if the first letter is already uppercase
    if (firstLetter === firstLetter.toUpperCase()) {
      return str;
    } else {
      return firstLetter.toUpperCase() + str.slice(1);
    }
  };

  const handleDelete = (feeId) => {
    dispatch(deleteStudentFee(feeId));
    dispatch(fetchFees());
    closeModal();
  };

  return (
    <Layout title="Accounting">
      <DashLayout>
        <div className="min-h-screen p-4 bg-gray-50">
          <div className="flex items-center mb-4">
            <div className="flex justify-between items-end space-x-2 w-full">
              <div className="flex gap-3">
                <FormField
                  id="class"
                  label="Class"
                  value={filters.class}
                  onChange={handleFilterChange}
                  options={classes}
                />
                <FormField
                  id="feesType"
                  label="Fees Type"
                  value={filters.feesType}
                  onChange={handleFilterChange}
                  options={feesTypes}
                />
              </div>
              <div>
                <button
                  onClick={handleSidebarOpen}
                  className="h-12 inline-flex items-center border border-transparent text-sm font-medium shadow-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                  Add New Fees
                  <span className="ml-2">+</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center space-x-4">
              {["Everyone", "Paid", "Unpaid"].map((status) => (
                <label
                  key={status}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={filters.status === status}
                    onChange={() => handleStatusChange(status)}
                    className="hidden"
                  />
                  <div
                    className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                      filters.status === status
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {filters.status === status && (
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span
                    className={`transition-colors duration-200 ${
                      filters.status === status
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-100">
                  <th className="px-5 py-3 border-b-2 border-gray-200">Name</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Class
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Fees Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Due Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Amount
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center px-5 py-5">
                      <NoDataFound /> {/* Display NoDataFound when no data */}
                    </td>
                  </tr>
                ) : (
                  filteredData?.reverse()?.map((item, index) => (
                    <tr
                      key={index}
                      className="text-left text-gray-700 border border-gray-200 bg-white"
                    >
                      <td className="px-5 py-2 flex flex-row gap-2">
                        <img
                          src={item?.studentId?.profile}
                          alt="img"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span>{item?.studentId?.fullName}</span>
                          <span>ID: {item?.studentId?.admissionNumber}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2">
                        {item.studentId?.presentClassId?.className}
                      </td>
                      <td className="px-5 py-2">{item?.feeType}</td>
                      <td className="px-5 py-2">
                        {new Date(item?.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-2">{item?.amount}</td>
                      <td className="px-5 py-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            item.status === "paid"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {capitalizeFirstLetter(item?.status)}
                        </span>
                      </td>
                      <td className="pl-10 py-4 relative">
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer font-bold items-center"
                          onClick={() =>
                            setShowEditMenu({ show: true, index: index })
                          }
                        >
                          ⋮
                        </div>
                        {showEditMenu.show && showEditMenu.index === index ? (
                          <div className="absolute bottom-0 right-0 bg-white shadow-lg flex flex-col items-center w-[6rem] h-[3rem] border rounded-lg">
                            <button
                              className="absolute left-[-1.5rem] top-[-2rem] bottom-2 text-indigo-600 hover:text-indigo-900"
                              onClick={() => setShowEditMenu(false)}
                            >
                              <MdCancel className="text-2xl text-black" />
                            </button>
                            <button
                              className="bottom-2 text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                dispatch(
                                  setEditFormData({
                                    feeId: item._id,
                                    feeType: item.feeType,
                                    dueDate: item.dueDate,
                                    amount: item.amount,
                                  })
                                );
                                handleSidebarEditOpen();
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="bottom-2 text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                dispatch(
                                  setEditFormData({
                                    feeId: item._id,
                                    feeType: item.feeType,
                                    dueDate: item.dueDate,
                                    amount: item.amount,
                                  })
                                );
                                openModal();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Sidebar
            isOpen={isSidebarEditOpen}
            onClose={handleSidebarClose}
            title={"Edit Fees"}
          >
            <EditFee />
          </Sidebar>
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
            title={"Add New Fees"}
          >
            <AddFeesForm />
          </Sidebar>
          <DeleteConfirmatiomModal
            isOpen={isModalOpen}
            onClose={() => dispatch(setModalOpen(false))}
            onConfirm={() => handleDelete(editFormData.feeId)}
          />
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AccountingSection;
