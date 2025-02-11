import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

// Local Imports
import NavIconCard from "./Components/NavIconCard";
import ButtonGroup from "./Components/ButtonGroup";
import SubjectCard from "./SubjectCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewSubject from "./AddNewSubject";
import SemesterManager from "../Semesters/SemesterManager";
import NoDataFound from "../../../../Components/Common/NoDataFound";
import Spinner from "../../../../Components/Common/Spinner";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";

// Actions & Thunks
import { fetchClassDetails } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { setSelectedSemester } from "../../../../Store/Slices/Common/User/reducers/userSlice";

// Icons
import { FaSchool, FaExclamationCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import { SlEyeglass } from "react-icons/sl";
import { FcGraduationCap, FcCalendar } from "react-icons/fc";

// i18n
import { useTranslation } from "react-i18next";

// Permissions
import { PERMISSIONS } from "../../../../config/permission";

// Ant Design
import { Modal, Button, Result, Typography } from "antd";

// Framer Motion
import { AnimatePresence, motion } from "framer-motion";

const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => colors[index % colors.length];

function MainSection() {
  const { t } = useTranslation("admClass");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cid } = useParams();

  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null);

  // Semester Management sidebar state
  const [isSemesterSidebarOpen, setIsSemesterSidebarOpen] = useState(false);

  // Modal state for "no semester" warning
  const [noSemesterModalVisible, setNoSemesterModalVisible] = useState(false);

  // Tab state for subjects (Published / Draft)
  const [selectedTab, setSelectedTab] = useState(t("Published"));

  // Redux store data
  const classDetails = useSelector((store) => store.admin.class.classDetails);
  const role = useSelector((store) => store.common.auth.role);
  const loading = useSelector((store) => store.admin.class.loading);
  const { Title, Text } = Typography;
  // Semesters & selected semester
  const { semesters } = useSelector((state) => state.admin.semesters);
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  // Fetch class details on mount/update
  useEffect(() => {
    dispatch(fetchClassDetails(cid));
  }, [dispatch, cid]);

  // Validate persisted selectedSemester
  useEffect(() => {
    if (!semesters) return;

    if (semesters.length === 0) {
      // Clear if we had a selected semester but none exist now
      if (selectedSemester && selectedSemester.id) {
        dispatch(setSelectedSemester({ id: null, name: "" }));
      }
    } else if (selectedSemester && selectedSemester.id) {
      // Ensure the selected semester is valid
      const isValid = semesters.some((sem) => sem._id === selectedSemester.id);
      if (!isValid) {
        dispatch(setSelectedSemester({ id: null, name: "" }));
      }
    }
  }, [semesters, dispatch, selectedSemester]);

  // Filter subjects by "Published" or "Draft"
  const filteredSubjects =
    classDetails && classDetails.subjects
      ? classDetails.subjects.filter((subject) =>
          selectedTab === t("Published")
            ? subject.isPublished
            : !subject.isPublished
        )
      : [];

  // Dynamic data for top NavIconCard items
  const staticIconData = [
    {
      icon: <SlEyeglass className="text-purple-600" />,
      text: "",
      url: `/class/${cid}/teachers`,
    },
    {
      icon: <FaSchool className="text-yellow-600" />,
      text: "",
      url: `/class/${cid}/section_group`,
    },
    { icon: <FcGraduationCap />, text: "", url: `/class/${cid}/students` },
    {
      icon: <FcCalendar />,
      text: t("Attendance"),
      url: `/class/${cid}/attendance`,
    },
  ];

  // Update icon text if classDetails exist
  if (classDetails) {
    staticIconData[0].text = t("Instructor Assigned", {
      count: classDetails?.teachers?.length || 0,
    });
    staticIconData[1].text = t("Sections and Groups", {
      sections: classDetails?.sections?.length || 0,
      groups: classDetails?.groups?.length || 0,
    });
    staticIconData[2].text = `${classDetails?.students?.length || 0} ${t(
      "Students"
    )}`;
  }

  // Handlers for Subject Sidebar
  const handleAddNewSubject = () => {
    setEditSubject(null);
    setIsSidebarOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditSubject(subject);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handler for opening the Semester Management sidebar
  const handleViewSemester = () => {
    setIsSemesterSidebarOpen(true);
  };

  // Subject card click handler
  const handleSubjectClick = (subject) => {
    const hasSemesters = semesters && semesters.length > 0;
    const hasValidSelection = selectedSemester && selectedSemester.id;

    if (!hasSemesters || !hasValidSelection) {
      setNoSemesterModalVisible(true);
      setIsSemesterSidebarOpen(true);
    } else {
      // Navigate to subject's module page (or your preferred route)
      navigate(`/class/${cid}/${subject._id}/module`);
    }
  };

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.SPECIFIC_CLASS}
      title={"Subjects"}
    >
      {/* Show loading spinner if data is still being fetched */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Top Nav Icon Cards */}
          <div className="flex flex-wrap justify-center gap-3 p-4">
            {staticIconData.map((item, index) => (
              <NavIconCard
                key={index}
                icon={item.icon}
                text={item.text}
                url={item.url}
              />
            ))}
          </div>

          {/* Subject Tabs (Published/Draft) + Subject List */}
          <div className="px-5">
            <ButtonGroup
              role={role}
              onAddNewSubject={handleAddNewSubject}
              onViewSemester={handleViewSemester}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />

            <div className="grid grid-cols-3 gap-4 mb-10">
              {filteredSubjects && filteredSubjects.length > 0 ? (
                <AnimatePresence>
                  {filteredSubjects.map((subject, index) => (
                    <motion.div
                      key={subject._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SubjectCard
                        role={role}
                        data={subject}
                        Class={cid}
                        subjectId={subject._id}
                        backgroundColor={
                          subject.subjectColor
                            ? subject.subjectColor
                            : getColor(index)
                        }
                        onClick={() => handleSubjectClick(subject)}
                        onEdit={handleEditSubject}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  <NoDataFound title={t("Subject")} />
                </p>
              )}
            </div>
          </div>
        </>
      )}
      {/* Sidebar for Adding/Editing Subject */}
      <Sidebar
        title={editSubject ? t("Edit Subject") : t("Add New Subject")}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      >
        <AddNewSubject subject={editSubject} onClose={handleCloseSidebar} />
      </Sidebar>
      {/* Sidebar for Semester Management */}
      <Sidebar
        title="Semester Management"
        isOpen={isSemesterSidebarOpen}
        onClose={() => setIsSemesterSidebarOpen(false)}
        width="95%"
      >
        <SemesterManager
          classId={cid}
          onClose={() => setIsSemesterSidebarOpen(false)}
        />
      </Sidebar>
      {/* "Semester Required" Modal using Framer Motion animations */}

      <AnimatePresence>
        {noSemesterModalVisible && (
          <motion.div
            key="semesterRequiredModal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Modal
              open={noSemesterModalVisible} // ✅ Ensures only one instance
              footer={null}
              onCancel={() => setNoSemesterModalVisible(false)}
              width={550}
              className="rounded-xl shadow-lg"
            >
              <div className="flex flex-col p-6">
                {/* Icon & Title */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaExclamationCircle className="text-purple-600 text-4xl" />
                  </div>
                  <Title level={3} className="text-purple-800">
                    {t("Semester Required")}
                  </Title>
                </div>

                {/* Left-Aligned Description */}
                <Text type="secondary" className="text-left text-gray-600">
                  {t(
                    "No semester is found for this class or no valid semester is selected. Before proceeding with subjects, modules, assignments, quizzes, etc., please create a semester."
                  )}
                </Text>

                {/* Bullet Points with Check Icon */}
                <ul className="list-none text-gray-700 pl-6 space-y-2 mt-3">
                  <li className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>{t("Use a descriptive semester title.")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>
                      {t(
                        "Select valid start and end dates within the academic year."
                      )}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>
                      {t("Ensure the end date is after the start date.")}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span>{t("Fill out all required fields.")}</span>
                  </li>
                </ul>

                {/* Buttons (Right-Aligned) */}
                <div className="flex justify-end mt-6 space-x-3">
                  {/* Close Button */}
                  <Button
                    onClick={() => setNoSemesterModalVisible(false)}
                    className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
                  >
                    {t("Close")}
                  </Button>

                  {/* Create Semester Button (Purple Theme) */}
                  <Button
                    type="primary"
                    style={{
                      background: "linear-gradient(135deg, #9b59b6, #e84393)",
                      border: "none",
                      padding: "8px 16px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setNoSemesterModalVisible(false);
                      setIsSemesterSidebarOpen(true);
                    }}
                  >
                    {t("Create Semester")}
                  </Button>
                </div>
              </div>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedSection>
  );
}

export default MainSection;
