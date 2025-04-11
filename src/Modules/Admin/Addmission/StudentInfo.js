import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Avatar } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AdminAdmissionForm from "./AdminAdmission/AdminAdmissionForm";
import StudentCard from "./Components/StudentCard";

const StudentInfo = () => {
  const { t } = useTranslation("admAdmission");
  const classList = useSelector((store) => store.admin.class.classes);

  // State for toggling the student card view, search and class filters, and form data
  const [showStudentCard, setShowStudentCard] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({});

  // Default configuration with sample student data.
  // const defaultStudents = [
  //   {
  //     _id: "stu1",
  //     candidateInformation: {
  //       firstName: "Alice",
  //       lastName: "Johnson",
  //       phoneNumber: "555-1111",
  //     },
  //     classId: "class1",
  //     profilePicture: "path/to/alice.png",
  //   },
  //   {
  //     _id: "stu2",
  //     candidateInformation: {
  //       firstName: "Bob",
  //       lastName: "Smith",
  //       phoneNumber: "555-2222",
  //     },
  //     classId: "class2",
  //     profilePicture: "path/to/bob.png",
  //   },
  //   {
  //     _id: "stu3",
  //     candidateInformation: {
  //       firstName: "Charlie",
  //       lastName: "Williams",
  //       phoneNumber: "555-3333",
  //     },
  //     classId: "class1",
  //     profilePicture: "path/to/charlie.png",
  //   },
  //   {
  //     _id: "stu4",
  //     candidateInformation: {
  //       firstName: "Dana",
  //       lastName: "Lee",
  //       phoneNumber: "555-4444",
  //     },
  //     classId: "class3",
  //     profilePicture: "", // No image provided, so default icon will show.
  //   },
  // ];

  // // Wrap the form data change callback in useCallback for stability and perform a deep equality check.
  const handleFormDataChange = useCallback((newData) => {
    setFormData((prevData) => {
      // Compare previous form data with the new data.
      if (JSON.stringify(prevData) === JSON.stringify(newData)) {
        return prevData;
      }
      return {
        ...newData,
        attachments: {
          ...newData.attachments,
          mandatory: {
            ...newData.attachments?.mandatory,
            studentPicture:
              newData.attachments?.mandatory?.studentPicture?.preview || null,
          },
        },
      };
    });
  }, []);

  // // Update search query when user types.
  // const handleSearch = (value) => {
  //   console.log("Searching for:", value);
  //   setSearchQuery(value);
  // };

  // // Update the selected class filter.
  // const handleClassChange = (value) => {
  //   setSelectedClass(value);
  //   console.log("Selected class:", value);
  // };

  // Compute filtered students.
  // const filteredStudents = useMemo(() => {
  //   return defaultStudents.filter((student) => {
  //     const fullName =
  //       `${student.candidateInformation.firstName} ${student.candidateInformation.lastName}`.toLowerCase();
  //     const matchesSearch = fullName.includes(searchQuery.toLowerCase());
  //     const matchesClass = selectedClass
  //       ? student.classId === selectedClass
  //       : true;
  //     return matchesSearch && matchesClass;
  //   });
  // }, [defaultStudents, searchQuery, selectedClass]);

  // Build auto-complete options with custom labels.
  // const searchOptions = useMemo(() => {
  //   return filteredStudents.map((student) => {
  //     const fullName = `${student.candidateInformation.firstName} ${student.candidateInformation.lastName}`;
  //     const classObj = classList.find((cls) => cls._id === student.classId);
  //     const className = classObj ? classObj.className : "N/A";
  //     return {
  //       value: student._id,
  //       label: (
  //         <div style={{ display: "flex", alignItems: "center" }}>
  //           <Avatar
  //             src={student.profilePicture || null}
  //             icon={!student.profilePicture && <UserOutlined />}
  //           />
  //           <div style={{ marginLeft: 8 }}>
  //             <div style={{ fontWeight: "bold" }}>{fullName}</div>
  //             <div style={{ fontSize: 12, color: "#888" }}>{className}</div>
  //             <div style={{ fontSize: 12, color: "#888" }}>
  //               Admission No: {student._id}
  //             </div>
  //           </div>
  //         </div>
  //       ),
  //     };
  //   });
  // }, [filteredStudents, classList]);

  return (
    <div className="h-full w-full">
      <div className="flex gap-2 h-screen">
        {/* Left Section: Form, Header (with search and class filters) */}
        <div
          className={`p-1 bg-white rounded-lg overflow-y-auto transition-all duration-500 ${
            showStudentCard ? "w-75%" : "w-full"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between px-2 pt-2 items-center">
            <h2 className="text-lg font-semibold text-gradient">Application</h2>
            <div className="flex gap-4 items-center">
              <Button onClick={() => setShowStudentCard((prev) => !prev)}>
                {showStudentCard ? (
                  <>
                    <EyeInvisibleOutlined className="mr-2" />
                    {t("Hide Student Card")}
                  </>
                ) : (
                  <>
                    <EyeOutlined className="mr-2" />
                    {t("Show Student Card")}
                  </>
                )}
              </Button>
            </div>
          </div>
          {/* Admin Admission Form */}
          <AdminAdmissionForm onFormDataChange={handleFormDataChange} />
        </div>
        {/* Right Section: Student Card from form data */}
        {showStudentCard && (
          <div className="sticky top-4 w-25% tr ansition-all duration-300">
            <StudentCard
              studentInfo={formData?.candidateInformation || {}}
              imagePreview={formData?.attachments?.mandatory?.studentPicture}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInfo;
