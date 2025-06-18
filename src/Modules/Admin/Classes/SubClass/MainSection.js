import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, NavLink } from "react-router-dom";

// Local Imports
import NavIconCard from "./Components/NavIconCard";
import ButtonGroup from "./Components/ButtonGroup";
import SubjectCard from "./SubjectCard";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewSubject from "./AddNewSubject";
import SemesterManager from "../Semesters/SemesterManager";
import NoDataFound from "../../../../Components/Common/NoDataFound";
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

import {
  Card,
  Skeleton,
  Button,
  Modal,
  Typography,
  Tabs,
  Badge,
  Input,
} from "antd";
// Framer Motion
import { AnimatePresence, motion } from "framer-motion";

import { gt } from "../../../../Utils/translator/translation";

// Framer Motion
const colors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
];

const getColor = (index) => colors[index % colors.length];
// CSS for Shimmer Animation on Icons
const shimmerStyles = `
  .shimmer-icon-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  .shimmer-icon-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(200, 200, 200, 0.2) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(200, 200, 200, 0.2) 100%
    );
    animation: shimmer 1.5s infinite;
  }
  
`;
// Shimmer Component for Subject Card
const SubjectCardShimmer = () => {
  return (
    <div className="p-4 rounded-lg shadow-md h-64">
      <div className="flex justify-between items-center mb-2">
        <Skeleton.Button active size="small" style={{ width: 80 }} />
      </div>
      <Skeleton paragraph={{ rows: 1 }} active />
      <div className="flex mt-[60px] justify-between items-center">
        <Skeleton.Avatar active size="large" shape="circle" />
        <Skeleton.Avatar
          active
          size="large"
          shape="square"
          style={{ height: 50, width: 50 }}
        />
      </div>
    </div>
  );
};

// Shimmer Component for NavIconCard (with Circle Placeholder Instead of Icon)
const NavIconCardShimmer = () => {
  return (
    <div className="p-4 rounded-lg bg-white shadow-md flex-1 w-[24%]">
      <div className="flex flex-col justify-center items-center gap-3">
        {/* Replace the icon with a circular skeleton placeholder */}
        <Skeleton.Avatar active size="large" shape="circle" />
        <div>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
      </div>
    </div>
  );
};
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
  const [isLoading, setIsLoading] = useState(false);
  // Semesters & selected semester
  const { semesters } = useSelector((state) => state.admin.semesters);
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );
  const isAdmin = role?.toLowerCase() === "admin";
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

  const publishedSubjects =
    classDetails?.subjects?.filter((s) => s.isPublished) || [];
  const draftSubjects =
    classDetails?.subjects?.filter((s) => !s.isPublished) || [];
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

    setIsLoading(true);
    console.log(isLoading);
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
      <style>{shimmerStyles}</style>
      {loading ? (
        <div className="p-4">
          {/* Shimmer for NavIconCards (with circle placeholder) */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {staticIconData.map((_, index) => (
              <NavIconCardShimmer key={index} />
            ))}
          </div>
          {/* Shimmer for Tabs and Subject Cards */}
          <div className="px-5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Skeleton.Button active size="large" style={{ width: 160 }} />
                <Skeleton.Button active size="large" style={{ width: 130 }} />
              </div>
              <div className="flex gap-2">
                <Skeleton.Button active shape="circle" size="large" />
                <Skeleton.Button active size="large" style={{ width: 120 }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <SubjectCardShimmer key={index} />
              ))}
            </div>
          </div>
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
              onAddNewSubject={handleAddNewSubject}
              onViewSemester={handleViewSemester}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              role={role}
              cid={cid}
              publishedCount={publishedSubjects?.length || 0}
              draftCount={draftSubjects?.length || 0}
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
        title={isAdmin ? t("Semester Management") : t("Select Semester")}
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
