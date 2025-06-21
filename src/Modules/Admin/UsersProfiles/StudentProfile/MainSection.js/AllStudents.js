import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import profileIcon from "../../../../../Assets/DashboardAssets/profileIcon.png";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useDispatch, useSelector } from "react-redux";
import { CgArrowsExchange } from "react-icons/cg";
import { fetchAllStudents } from "../../../../../Store/Slices/Admin/Users/Students/student.action";
import { CiUser } from "react-icons/ci";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import StudentsFilter from "./StudentsFilter";
import Spinner from "../../../../../Components/Common/Spinner";
import Sidebar from "../../../../../Components/Common/Sidebar";
import UpdateStudent from "./UpdateStudent";
import EditStudent from "../../../Students/Components/EditStudent";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import NoDataFound from "../../../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../../config/permission";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import { BsFilterSquare } from "react-icons/bs";
import { FaEdit, FaPencilAlt } from "react-icons/fa";

const AllStudents = () => {
  const { t } = useTranslation("admAccounts");
  const { allStudents, loading } = useSelector(
    (store) => store.admin.all_students
  );
  const { role } = useSelector((store) => store.common.auth);
  const dispatch = useDispatch();
  const [isUpdateSidebarOpen, setIsUpdateSidebarOpen] = useState(false);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSidebarClose = () => setIsUpdateSidebarOpen(false);
  const handleUpdateSidebarClose = () => setIsUpdateSidebarOpen(false);
  const handleEditSidebarClose = () => setIsEditSidebarOpen(false);

  useNavHeading("User", "Students");

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    groupId: "",
    searchTerm: "",
  });

  const filteredStudents = allStudents?.filter((student) => {
    // Class filter
    const classMatch = filters.classId
      ? student.classId === filters.classId
      : true;

    // Section filter
    const sectionMatch = filters.sectionId
      ? student.sectionId === filters.sectionId
      : true;

    // Group filter
    const groupMatch = filters.groupId
      ? student.groups?.some((g) => g._id === filters.groupId)
      : true;

    // Search filter
    const searchTerm = (filters.searchTerm || "").toLowerCase();
    const searchMatch = searchTerm
      ? student.firstName?.toLowerCase().includes(searchTerm) ||
        student.lastName?.toLowerCase().includes(searchTerm) ||
        student.admissionNumber?.toLowerCase().includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm) ||
        student.contactNumber?.toLowerCase().includes(searchTerm)
      : true;

    return classMatch && sectionMatch && groupMatch && searchMatch;
  });

  const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-rose-500 to-rose-600",
    "bg-gradient-to-br from-amber-500 to-amber-600",
    "bg-gradient-to-br from-indigo-500 to-indigo-600",
  ];

  const hashCode = (str) => {
    let hash = 0;
    if (str?.length === 0) return hash;
    for (let i = 0; i < str?.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const bgColor = (studentId) => {
    const colorIndex = hashCode(studentId) % colors?.length;
    return colors[colorIndex];
  };

  return (
    <Layout title={t("All students")}>
      <DashLayout>
        {/* Enhanced Header Section */}
        <div className="w-full px-6 py-4 bg-white rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <FiUsers className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {t("All Students")}
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredStudents?.length || 0} {t("students found")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition-colors"
              >
                <BsFilterSquare className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {showFilters ? t("Hide Filters") : t("Show Filters")}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <StudentsFilter
                onFilterChange={(name, value) =>
                  setFilters((prev) => ({ ...prev, [name]: value }))
                }
                filters={filters}
              />
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex w-full h-[80vh] flex-col items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProtectedSection
            requiredPermission={PERMISSIONS.VIEW_STUDENT}
            title={"All Students"}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredStudents?.length > 0 ? (
                filteredStudents?.map((student, index) => (
                  <motion.div
                    key={student?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative group overflow-hidden rounded-xl shadow-xl transition-all duration-300 ${bgColor(
                      student?._id
                    )}`}
                  >
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none" />

                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-md z-10">
                      <HiMiniCheckBadge className="text-green-500 text-xl" />
                    </div>

                    {/* Admin actions */}
                    {role === "admin" && (
                      <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setStudentData(student);
                            setIsEditSidebarOpen(true);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
                          aria-label="Change class"
                        >
                          <CgArrowsExchange className="text-gray-700 text-lg" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setStudentData(student);
                            setIsUpdateSidebarOpen(true);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
                          aria-label="Change class"
                        >
                          <FaPencilAlt className="text-gray-700 text-lg" />
                        </button>
                      </div>
                    )}

                    <NavLink
                      to={`/users/students/${student?._id}`}
                      className="block h-full"
                      onClick={(e) => {
                        if (e.target.closest(".admin-action")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="p-5 h-full flex flex-col">
                        {/* Profile section */}
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-full border-4 border-white/80 shadow-md overflow-hidden bg-white flex items-center justify-center">
                              {student?.profile ? (
                                <img
                                  src={student?.profile || profileIcon}
                                  alt="Student"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <CiUser size={28} className="text-gray-600" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold text-white truncate">
                              {student?.firstName} {student?.lastName}
                            </h2>
                            <p className="text-white/90 text-sm truncate">
                              ID: {student?.admissionNumber}
                            </p>
                          </div>
                        </div>

                        {/* Details section */}
                        <div className="space-y-2 mt-2 flex-grow">
                          <div className="flex items-start">
                            <span className="text-white/80 text-sm font-medium w-20 flex-shrink-0">
                              {t("Class")}:
                            </span>
                            <span className="text-white font-medium text-sm">
                              {student?.className || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-white/80 text-sm font-medium w-20 flex-shrink-0">
                              {t("Email")}:
                            </span>
                            <span className="text-white text-sm truncate">
                              {student?.email || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-white/80 text-sm font-medium w-20 flex-shrink-0">
                              {t("Contact")}:
                            </span>
                            <span className="text-white text-sm">
                              {student?.contactNumber || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-white/80 text-sm font-medium w-20 flex-shrink-0">
                              {t("Parent")}:
                            </span>
                            <span className="text-white text-sm truncate">
                              {student?.fatherName ||
                                student?.motherName ||
                                "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full text-sm">
                            View Profile
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex w-full text-gray-500 h-[60vh] items-center justify-center flex-col text-2xl">
                  <NoDataFound />
                  <p className="mt-4 text-lg">{t("No students found")}</p>
                </div>
              )}
            </div>
          </ProtectedSection>
        )}

        {/* Sidebars */}
        <Sidebar
          isOpen={isUpdateSidebarOpen}
          onClose={handleSidebarClose}
          title={t("Edit Student")}
          ignoreClickOutsideSelectors={[
            ".jodit-ui-list__box",
            ".jodit-popup",
            ".jodit-toolbar-button",
          ]}
          width="80%"
        >
          {studentData && (
            <UpdateStudent
              data={studentData}
              handleUpdateSidebarClose={handleUpdateSidebarClose}
            />
          )}
        </Sidebar>

        <Sidebar
          isOpen={isEditSidebarOpen}
          onClose={handleEditSidebarClose}
          title={t("Change Student Class")}
          width="30%"
        >
          {studentData && (
            <EditStudent
              studentId={studentData?._id}
              onFilterChange={(name, value) =>
                setFilters((prev) => ({ ...prev, [name]: value }))
              }
              handleUpdateSidebarClose={handleEditSidebarClose}
            />
          )}
        </Sidebar>
      </DashLayout>
    </Layout>
  );
};

export default AllStudents;
