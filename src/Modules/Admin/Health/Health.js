import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHeartbeat, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

const Health = () => {
    const { t } = useTranslation("admAccounts");
    const { allStudents, loading } = useSelector(
        (store) => store.admin.all_students
    );
    const { role } = useSelector((store) => store.common.auth);
    const dispatch = useDispatch();
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [expandedCard, setExpandedCard] = useState(null);

    const handleModalClose = () => setIsHealthModalOpen(false);

    useNavHeading("Admin", "Health");
    useEffect(() => {
        dispatch(fetchAllStudents());
        dispatch(fetchAllClasses());
    }, [dispatch]);

    const [filters, setFilters] = useState({
        classId: "",
        sectionId: "",
        groupId: "",
    });

    useEffect(() => {
        dispatch(fetchAllStudents(filters));
    }, [filters, dispatch]);

    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const filteredStudents = allStudents?.filter((student) => {
        const matchesClass = filters.classId
            ? student.classId === filters.classId
            : true;
        const matchesSection = filters.sectionId
            ? student.sectionId === filters.sectionId
            : true;
        const matchesGroup = filters.groupId
            ? student.groups?.some((group) => group._id === filters.groupId)
            : true;
        return matchesClass && matchesSection && matchesGroup;
    });

    const lowRiskCount = filteredStudents?.filter(
        (student) => student.healthRisk === "Low"
    ).length;
    const mediumRiskCount = filteredStudents?.filter(
        (student) => student.healthRisk === "Medium"
    ).length;
    const highRiskCount = filteredStudents?.filter(
        (student) => student.healthRisk === "High"
    ).length;

    const truncateText = (text, length) => {
        if (!text) return "No medical conditions reported";
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    const handleEditClick = (student) => {
        setStudentData(student);
        setIsHealthModalOpen(true);
    };

    const toggleCardExpansion = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };
    return (
        <Layout title={t("Health Management")}>
            <DashLayout>
                <div className="w-full max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <StudentsFilter onFilterChange={handleFilterChange} filters={filters} />
                    </div>

                    <div className="w-full">
                        <h2 className="text-xl font-semibold mb-4 text-left">Student Health Profile Card</h2>

                        <div className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div
                                    className="bg-gradient-to-r from-[#EDE7F6] to-[#eac6e8] text-[#673AB7] rounded-lg p-4 sm:p-6 shadow-sm flex"
                                >
                                    <FaHeartbeat className="text-2xl mr-2 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base text-black">LOW RISK FLAG</p>
                                        <p className="text-xl sm:text-2xl">{lowRiskCount} Students</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-gradient-to-r from-[#EDE7F6] to-[#eac6e8] text-[#673AB7] rounded-lg p-4 sm:p-6 shadow-sm flex"
                                >
                                    <FaHeartbeat className="text-2xl mr-2 text-orange-600" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base text-black">MEDIUM RISK FLAG</p>
                                        <p className="text-xl sm:text-2xl">{mediumRiskCount} Students</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-gradient-to-r from-[#EDE7F6] to-[#eac6e8] text-[#673AB7] rounded-lg p-4 sm:p-6 shadow-sm flex"
                                >
                                    <FaHeartbeat className="text-2xl mr-2 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base text-black">HIGH RISK FLAG</p>
                                        <p className="text-xl sm:text-2xl">{highRiskCount} Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex w-full h-[80vh] flex-col items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <ProtectedSection requiredPermission={PERMISSIONS.VIEW_STUDENT} title={"All Students"}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {filteredStudents?.length > 0 ? (
                                        filteredStudents?.map((student) => (
                                            <div
                                                key={student?._id}
                                                className={`rounded-lg shadow-md border bg-white self-start ${expandedCard === student._id
                                                    ? "border-[#673AB7] border-2"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="p-4 sm:p-6 flex flex-col">
                                                    <div className="flex justify-end mb-2">
                                                        {expandedCard === student._id ? (
                                                            <FaChevronUp
                                                                className="text-gray-500 text-sm sm:text-base cursor-pointer"
                                                                onClick={() => toggleCardExpansion(student._id)}
                                                            />
                                                        ) : (
                                                            <FaChevronDown
                                                                className="text-gray-500 text-sm sm:text-base cursor-pointer"
                                                                onClick={() => toggleCardExpansion(student._id)}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex items-start mb-4">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                                                            <img
                                                                src={student?.profile}
                                                                alt="Student"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-4 flex flex-col">
                                                            <div className="flex items-center">
                                                                <h2 className="text-lg font-semibold text-gray-800 mr-2">
                                                                    {student?.firstName} {student?.lastName}
                                                                </h2>
                                                                <span
                                                                    className={`px-2 py-0.5 mb-2 rounded-full text-xs font-semibold ${student.healthRisk === "Low"
                                                                        ? "bg-[#4CAF50] text-white"
                                                                        : student.healthRisk === "Medium"
                                                                            ? "bg-[#FF9800] text-white"
                                                                            : "bg-[#F44336] text-white"
                                                                        }`}
                                                                >
                                                                    {student.healthRisk}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Age: {student?.age} | Class: {student?.className} ({student?.sectionName}) | Blood: {student?.bloodGroup}
                                                            </p>
                                                            <div className="text-sm text-gray-700 mt-2">
                                                                <p>
                                                                    {expandedCard === student._id
                                                                        ? student?.medicalCondition || "No medical conditions reported"
                                                                        : truncateText(student?.medicalCondition, 50)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {expandedCard === student._id && (
                                                        <div className="mt-2">
                                                            <h3 className="text-md font-semibold text-gray-800 mb-1">Medical History</h3>
                                                            <p className="text-sm text-gray-700 mb-2">
                                                                {student?.medicalCondition || "No medical conditions reported"}
                                                            </p>
                                                            <h3 className="text-md font-semibold text-gray-800 mb-1">Emergency Contacts</h3>
                                                            <div className="flex flex-col gap-2 mb-2 p-3 border rounded-lg shadow-sm bg-zinc-100 border-black">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-black text-sm">Emergency Contact:</span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {student?.emergencyNumber || "Not provided"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-black text-sm">Guardian Name:</span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {student?.guardianName || "Guardian Name"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-black text-sm">Relation:</span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {student?.guardianRelationToStudent || "Not provided"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-black text-sm">Guardian Contact:</span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {student?.guardianContactNumber || student?.fatherInfo?.cell1}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                            <div className="flex justify-end">
                                                                <button
                                                                    onClick={() => handleEditClick(student)}
                                                                    className="px-4 py-1 bg-[#673AB7] text-white rounded-lg text-sm hover:bg-[#5e35b1]"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-lg sm:text-2xl col-span-2">
                                            <NoDataFound />
                                        </div>
                                    )}
                                </div>
                            </ProtectedSection>
                        )}
                        <Sidebar
                            isOpen={isHealthModalOpen}
                            onClose={handleModalClose}
                            title={t("Update Student Information")}
                            width="60%"
                        >
                            <EditHealthModal
                                isOpen={isHealthModalOpen}
                                onClose={handleModalClose}
                                studentData={studentData}
                            />
                        </Sidebar>
                    </div>
                </div>
            </DashLayout>
        </Layout>
    );
};

export default Health;