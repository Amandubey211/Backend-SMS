import React, { useEffect, useState } from "react";
import {
  FaHeartbeat,
  FaUser,
  FaSchool,
  FaTint,
  FaInfoCircle,
} from "react-icons/fa";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../../Store/Slices/Admin/Users/Students/student.action";
import { fetchAllClasses } from "../../../Store/Slices/Admin/Class/actions/classThunk";
import StudentsFilter from "../UsersProfiles/StudentProfile/MainSection.js/StudentsFilter";
import Spinner from "../../../Components/Common/Spinner";
import Sidebar from "../../../Components/Common/Sidebar";
import EditHealthModal from "./EditHealthModal";
import { useTranslation } from "react-i18next";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import NoDataFound from "../../../Components/Common/NoDataFound";
import ProtectedSection from "../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../config/permission";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";

const Health = () => {
  const { t } = useTranslation("admAccounts");
  const { allStudents, loading } = useSelector(
    (state) => state.admin.all_students
  );
  const dispatch = useDispatch();

  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [filters, setFilters] = useState({
    classId: "",
    sectionId: "",
    groupId: "",
    searchTerm: "",
  });

  useNavHeading("Admin", "Health");

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const filteredStudents = allStudents?.filter((student) => {
    // Class filter
    const byClass = filters.classId
      ? student.classId === filters.classId
      : true;

    // Section filter
    const bySection = filters.sectionId
      ? student.sectionId === filters.sectionId
      : true;

    // Group filter
    const byGroup = filters.groupId
      ? student.groups?.some((g) => g._id === filters.groupId)
      : true;

    // Search filter
    const searchTerm = (filters.searchTerm || "").toLowerCase();
    const bySearch = searchTerm
      ? student.firstName?.toLowerCase().includes(searchTerm) ||
        student.lastName?.toLowerCase().includes(searchTerm) ||
        student.admissionNumber?.toLowerCase().includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm) ||
        student.contactNumber?.toLowerCase().includes(searchTerm)
      : true;

    return byClass && bySection && byGroup && bySearch;
  });

  const counts = {
    Low: filteredStudents?.filter((s) => s.healthRisk === "Low").length || 0,
    Medium:
      filteredStudents?.filter((s) => s.healthRisk === "Medium").length || 0,
    High: filteredStudents?.filter((s) => s.healthRisk === "High").length || 0,
  };

  const handleEditClick = (student) => {
    setStudentData(student);
    setIsHealthModalOpen(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  // Helper function to clean and render medical condition
  const renderMedicalCondition = (val, truncate = false, max = 50) => {
    if (!val || val.trim() === "") return "No Medical Conditions Reported";
    if (typeof val === "string" && /<\/?[a-z][\s\S]*>/i.test(val)) {
      const cleaned = DOMPurify.sanitize(val);
      if (truncate) {
        const text = cleaned.replace(/<[^>]+>/g, "");
        return text.length > max ? `${text.substring(0, max)}…` : text;
      }
      return cleaned;
    }
    return truncate && val.length > max ? `${val.substring(0, max)}…` : val;
  };

  // Risk Indicator Component
  const RiskIndicator = ({ count, total, level, color, icon }) => {
    const pct = total ? Math.round((count / total) * 100) : 0;

    const pill = {
      green: "text-green-600 bg-green-50",
      orange: "text-amber-600 bg-amber-50",
      red: "text-red-600 bg-red-50",
    };
    const bar = {
      green: "bg-green-600",
      orange: "bg-amber-600",
      red: "bg-red-600",
    };
    const base = {
      green: "bg-green-100",
      orange: "bg-amber-100",
      red: "bg-red-100",
    };

    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{level} Risk</h3>
          <span className={`p-2 rounded-full ${pill[color]}`}>{icon}</span>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-gray-800">{count}</p>
          <p className="text-sm font-medium text-gray-500">{pct}%</p>
        </div>

        <div className={`mt-3 w-full h-1.5 rounded-full ${base[color]}`}>
          <div
            className={`h-1.5 rounded-full ${bar[color]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  // Health Student Card Component
  const HealthStudentCard = ({ student, onEdit, onViewDetails }) => {
    const stripe = {
      Low: "bg-green-500/80",
      Medium: "bg-amber-500/80",
      High: "bg-red-500/80",
    };
    const badge = {
      Low: "bg-green-100 text-green-800 border-green-200",
      Medium: "bg-amber-100 text-amber-800 border-amber-200",
      High: "bg-red-100 text-red-800 border-red-200",
    };

    const medical = renderMedicalCondition(student?.medicalCondition, true);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white transition hover:shadow-md"
      >
        {/* coloured side-stripe */}
        <div
          className={`absolute top-0 left-0 w-1 h-full ${
            stripe[student.healthRisk]
          }`}
        />

        <div className="p-5 pl-6">
          {/* header */}
          <div className="flex items-start gap-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <img
                src={student?.profile}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  badge[student.healthRisk]
                }`}
              />
            </div>

            {/* identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {student.firstName} {student.lastName}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-[11px] rounded-full ${
                    badge[student.healthRisk]
                  }`}
                >
                  {student.healthRisk} Risk
                </span>
              </div>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                <span className="flex items-center">
                  <FaUser className="mr-1 text-xs opacity-70" />
                  Age&nbsp;{student.age}
                </span>
                <span className="flex items-center">
                  <FaSchool className="mr-1 text-xs opacity-70" />
                  {student.className} ({student.sectionName})
                </span>
                <span className="flex items-center">
                  <FaTint className="mr-1 text-xs opacity-70" />
                  {student.bloodGroup || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* medical notes */}
          <div className="mt-4">
            <h4 className="text-[10px] font-medium tracking-wide text-gray-500 mb-0.5">
              Medical Notes
            </h4>
            <div className="text-sm text-gray-700 line-clamp-2">
              {typeof medical === "string" && medical.startsWith("<") ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(medical),
                  }}
                />
              ) : (
                <p>{medical}</p>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => onViewDetails(student)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <span className="inline-flex items-center">
                <FaInfoCircle className="mr-1.5" />
                Details
              </span>
            </button>
            <button
              onClick={() => onEdit(student)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white hover:opacity-90 transition"
            >
              Edit Health
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout title={t("Health Management | Student Diwan")}>
      <DashLayout>
        <div className="w-full max-w-[80vw] mx-auto px-2 sm:px-3 lg:px-4 py-3">
          {/* ───── header + filters ───── */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">
                Student Health Management
              </h1>
              <span className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                {filteredStudents?.length || 0} Students
              </span>
            </div>
            {/* risk summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <RiskIndicator
                count={counts.Low}
                total={filteredStudents?.length || 1}
                level="Low"
                color="green"
                icon={<FaHeartbeat />}
              />
              <RiskIndicator
                count={counts.Medium}
                total={filteredStudents?.length || 1}
                level="Medium"
                color="orange"
                icon={<FaHeartbeat />}
              />
              <RiskIndicator
                count={counts.High}
                total={filteredStudents?.length || 1}
                level="High"
                color="red"
                icon={<FaHeartbeat />}
              />
            </div>
            <div className="w-full">
              <StudentsFilter
                onFilterChange={(name, value) =>
                  setFilters((prev) => ({ ...prev, [name]: value }))
                }
                filters={filters}
              />
            </div>
          </div>

          {/* student cards */}
          {loading ? (
            <div className="flex w-full h-[80vh] items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <ProtectedSection
              requiredPermission={PERMISSIONS.VIEW_STUDENT}
              title="All Students"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents?.length ? (
                  filteredStudents.map((s) => (
                    <HealthStudentCard
                      key={s._id}
                      student={s}
                      onEdit={handleEditClick}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex w-full h-[90vh] items-center justify-center text-lg sm:text-2xl text-gray-500">
                    <NoDataFound />
                  </div>
                )}
              </div>
            </ProtectedSection>
          )}

          {/* edit-health sidebar */}
          <Sidebar
            isOpen={isHealthModalOpen}
            onClose={() => setIsHealthModalOpen(false)}
            title={t("Update Student Information")}
            ignoreClickOutsideSelectors={[
              ".jodit-ui-list__box",
              ".jodit-popup",
              ".jodit-toolbar-button",
            ]}
            width="60%"
          >
            <EditHealthModal
              isOpen={isHealthModalOpen}
              onClose={() => setIsHealthModalOpen(false)}
              studentData={studentData}
            />
          </Sidebar>

          {/* details sidebar */}
          <Sidebar
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            title={t("Student Health Details")}
            width="60%"
          >
            {selectedStudent && (
              <div className="p-4 overflow-y-auto max-h-screen">
                {/* identity */}
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={selectedStudent.profile}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Age: {selectedStudent.age} | Class:&nbsp;
                      {selectedStudent.className} ({selectedStudent.sectionName}
                      )
                    </p>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        {
                          Low: "bg-green-100 text-green-800",
                          Medium: "bg-amber-100 text-amber-800",
                          High: "bg-red-100 text-red-800",
                        }[selectedStudent.healthRisk]
                      }`}
                    >
                      {selectedStudent.healthRisk} Risk
                    </span>
                  </div>
                </div>

                {/* vitals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Blood Group
                    </h4>
                    <p className="text-gray-800">
                      {selectedStudent.bloodGroup || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Height &amp; Weight
                    </h4>
                    <p className="text-gray-800">
                      {selectedStudent.height || "N/A"} cm /{" "}
                      {selectedStudent.weight || "N/A"} kg
                    </p>
                  </div>
                </div>

                {/* medical history */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">
                    Medical History
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {(() => {
                      const mc = renderMedicalCondition(
                        selectedStudent.medicalCondition
                      );
                      return typeof mc === "string" && mc.startsWith("<") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(mc),
                          }}
                        />
                      ) : (
                        <p>{mc}</p>
                      );
                    })()}
                  </div>
                </div>

                {/* emergency contacts */}
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-2">
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Primary Contact
                      </h4>
                      <p className="text-gray-800">
                        {selectedStudent.emergencyNumber || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Guardian
                      </h4>
                      <p className="text-gray-800 font-medium">
                        {selectedStudent.guardianName ||
                          selectedStudent.fatherName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedStudent.guardianRelationToStudent ||
                          "Guardian"}
                      </p>
                      <p className="text-gray-800 mt-1">
                        {selectedStudent.guardianContactNumber ||
                          selectedStudent.fatherInfo?.cell1?.value ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Sidebar>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default Health;
