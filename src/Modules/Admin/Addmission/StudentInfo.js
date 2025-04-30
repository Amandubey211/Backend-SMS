import React, { useState, useCallback, memo } from "react";
import { Button, Space } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AdminAdmissionForm from "./AdminAdmission/AdminAdmissionForm";
import StudentCard from "./Components/StudentCard";

const StudentInfo = memo(() => {
  const { t } = useTranslation("admAdmission");
  const [showStudentCard, setShowStudentCard] = useState(false);
  const [formData, setFormData] = useState(null);

  // Use useCallback to ensure this function is memoized and doesn't cause unnecessary re-renders
  const handleFormDataChange = useCallback((data) => {
    console.log(data , "formData");
    setFormData(data);
  }, []);

  return (
    <div className="h-full w-full">
      <div className="flex gap-2 h-screen">
        <div
          className={`p-4 bg-white rounded-lg overflow-y-auto transition-all duration-500 ${
            showStudentCard ? "w-3/4" : "w-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gradient">
              {t("Student Application")}
            </h2>
            <Space>
              <Button
                onClick={() => setShowStudentCard((prev) => !prev)}
                icon={
                  showStudentCard ? <EyeInvisibleOutlined /> : <EyeOutlined />
                }
              >
                {showStudentCard ? t("Hide Preview") : t("Show Preview")}
              </Button>
            </Space>
          </div>

          {/* Pass handleFormDataChange as a prop, which updates formData on submit */}
          <AdminAdmissionForm onFormDataChange={handleFormDataChange} />
        </div>

        {showStudentCard && (
          <div className="sticky top-0 w-1/4 p-4 bg-white rounded-lg shadow-md overflow-y-auto">
            <StudentCard
              studentInfo={formData?.candidateInformation || {}}
              academicInfo={formData?.academicSession || {}}
              imagePreview={formData?.profile}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default StudentInfo;
