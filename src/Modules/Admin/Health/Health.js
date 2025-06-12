import React, { useEffect, useState } from "react";
import { FaHeartbeat } from "react-icons/fa";
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

// Utility function to detect if a string contains HTML tags
const isHTML = (str) => {
    if (!str || typeof str !== "string") return false;
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
};

// Function to check if an image URL is valid (basic check for now)
const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    // Basic check for URL format; you can enhance this with an actual fetch if needed
    return url.startsWith("http") && (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg") || url.endsWith(".gif"));
};

// Function to clean editor content for display (only applied to HTML content)
const cleanEditorContent = (content) => {
    // Handle empty or invalid content
    if (!content || typeof content !== "string" || content.trim() === "") {
        return "No Medical Conditions Reported";
    }

    // Parse the content as HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Remove uploaded-image-wrapper and handle broken/missing images
    const imageWrappers = doc.querySelectorAll(".uploaded-image-wrapper");
    imageWrappers.forEach((wrapper) => {
        const img = wrapper.querySelector("img");
        if (img) {
            const imgSrc = img.getAttribute("src");
            if (isValidImageUrl(imgSrc)) {
                // Keep the img tag if the URL seems valid
                wrapper.parentNode.replaceChild(img, wrapper);
            } else {
                // Remove the entire wrapper if the image is broken
                wrapper.parentNode.removeChild(wrapper);
            }
        } else {
            // Remove the wrapper if there's no img tag inside
            wrapper.parentNode.removeChild(wrapper);
        }
    });

    // Remove uploaded-file-wrapper and keep only the link
    const fileWrappers = doc.querySelectorAll(".uploaded-file-wrapper");
    fileWrappers.forEach((wrapper) => {
        const link = wrapper.querySelector("a");
        if (link) {
            const linkHref = link.getAttribute("href");
            if (linkHref && linkHref.startsWith("http")) {
                wrapper.parentNode.replaceChild(link, wrapper);
            } else {
                wrapper.parentNode.removeChild(wrapper);
            }
        } else {
            wrapper.parentNode.removeChild(wrapper);
        }
    });

    // Get the cleaned HTML
    const cleanedContent = doc.body.innerHTML;

    // Check if the cleaned content is effectively empty
    const cleanedPlainText = doc.body.textContent.trim();
    if (!cleanedPlainText) {
        return "No Medical Conditions Reported";
    }

    return cleanedContent;
};

// Utility function to strip HTML tags and truncate text (used in student card)
const stripHTMLAndTruncate = (text, length) => {
    if (!text || text === "No Medical Conditions Reported") return text;
    const plainText = text.replace(/<[^>]+>/g, "");
    return plainText.length > length ? plainText.substring(0, length) + "..." : plainText;
};

// Helper function to determine how to render medicalCondition
const renderMedicalCondition = (medicalCondition, truncate = false, maxLength = 50) => {
    // Handle null, undefined, or empty string
    if (!medicalCondition || medicalCondition.trim() === "") {
        return "No Medical Conditions Reported";
    }

    // Check if the content is HTML
    if (isHTML(medicalCondition)) {
        const cleanedContent = cleanEditorContent(medicalCondition);
        // If cleaned content is the default message, return it as plain text
        if (cleanedContent === "No Medical Conditions Reported") {
            return cleanedContent;
        }
        // If truncation is required (for student card), strip HTML and truncate
        if (truncate) {
            return stripHTMLAndTruncate(cleanedContent, maxLength);
        }
        // Otherwise, return the cleaned HTML
        return cleanedContent;
    }

    // If it's plain text, return as-is
    return medicalCondition;
};

const Health = () => {
    const { t } = useTranslation("admAccounts");
    const { allStudents, loading } = useSelector(
        (store) => store.admin.all_students
    );
    const dispatch = useDispatch();
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleModalClose = () => setIsHealthModalOpen(false);
    const handleDetailsModalClose = () => setIsDetailsModalOpen(false);

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

    const handleEditClick = (student) => {
        setStudentData(student);
        setIsHealthModalOpen(true);
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
        setIsDetailsModalOpen(true);
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
                                <div className="flex flex-wrap -mx-2">
                                    {filteredStudents?.length > 0 ? (
                                        filteredStudents?.map((student) => {
                                            const displayMedicalCondition = renderMedicalCondition(student?.medicalCondition, true);
                                            return (
                                                <div
                                                    key={student?._id}
                                                    className="w-full sm:w-1/2 px-2 mb-4 sm:mb-6 border border-gray-200 rounded-lg shadow-md bg-white"
                                                >
                                                    <div className="p-4 sm:p-6 flex flex-col">
                                                        <div className="flex items-start mb-4">
                                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                                                                <img
                                                                    src={student?.profile}
                                                                    alt="Student"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="ml-4 flex flex-col flex-grow">
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
                                                                    {isHTML(displayMedicalCondition) ? (
                                                                        <div
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: DOMPurify.sanitize(displayMedicalCondition),
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <p>{displayMedicalCondition}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleViewDetails(student)}
                                                                className="px-4 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                                                            >
                                                                View Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditClick(student)}
                                                                className="px-4 py-1 bg-[#673AB7] text-white rounded-lg text-sm hover:bg-[#5e35b1]"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex w-full text-gray-500 h-[90vh] items-center justify-center flex-col text-lg sm:text-2xl">
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
                            ignoreClickOutsideSelectors={[
                                ".jodit-ui-list__box",
                                ".jodit-popup",
                                ".jodit-toolbar-button",
                            ]}
                            width="60%"
                        >
                            <EditHealthModal
                                isOpen={isHealthModalOpen}
                                onClose={handleModalClose}
                                studentData={studentData}
                            />
                        </Sidebar>
                        <Sidebar
                            isOpen={isDetailsModalOpen}
                            onClose={handleDetailsModalClose}
                            title={t("Student Health Details")}
                            width="60%"
                        >
                            {selectedStudent && (
                                <div className="p-4 min-h-0 h-auto">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Age: {selectedStudent.age} | Class: {selectedStudent.className} ({selectedStudent.sectionName}) | Blood: {selectedStudent.bloodGroup} | Height: {selectedStudent?.height || "N/A"} cm  | Weight: {selectedStudent?.weight || "N/A"} kg
                                    </p>
                                    <h3 className="text-md font-semibold text-gray-800 mb-1">Medical History</h3>
                                    <div className="text-sm text-gray-700 mb-4">
                                        {(() => {
                                            const displayMedicalCondition = renderMedicalCondition(selectedStudent.medicalCondition);
                                            return isHTML(displayMedicalCondition) ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(displayMedicalCondition),
                                                    }}
                                                />
                                            ) : (
                                                <p>{displayMedicalCondition}</p>
                                            );
                                        })()}
                                    </div>
                                    <h3 className="text-md font-semibold text-gray-800 mb-1">Emergency Contacts</h3>
                                    <div className="flex flex-col gap-2 mb-4 p-3 border rounded-lg shadow-sm bg-zinc-100 border-black">
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-sm">Emergency Contact:</span>
                                            <span className="text-sm text-gray-600">
                                                {selectedStudent.emergencyNumber || "Not provided"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-sm">Guardian Name:</span>
                                            <span className="text-sm text-gray-600">
                                                {selectedStudent.guardianName || "Guardian Name"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-sm">Relation:</span>
                                            <span className="text-sm text-gray-600">
                                                {selectedStudent.guardianRelationToStudent || "Not provided"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-black text-sm">Guardian Contact:</span>
                                            <span className="text-sm text-gray-600">
                                                {selectedStudent.guardianContactNumber || selectedStudent.fatherInfo?.cell1}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Sidebar>
                    </div>
                </div>
            </DashLayout>
        </Layout>
    );
};

export default Health;