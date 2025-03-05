import React, { useEffect, useState, memo } from "react";
import { Doughnut } from "react-chartjs-2";
import { PiStudentBold } from "react-icons/pi"; // No data/error icon
import Spinner from "../../../../Components/Common/Spinner"; // Import default spinner
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardData } from "../../../../Store/Slices/Admin/Dashboard/adminDashboard.action"; // Import the action
import { useTranslation } from "react-i18next";

const TotalStudentsGraphjs = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("dashboard");

  const role = useSelector((store) => store?.common?.auth?.role);
  const {
    loadingDashboard: loading,
    errorDashboard: error,
    dashboardData,
  } = useSelector((state) => state?.admin?.adminDashboard);

  const [selectedClass, setSelectedClass] = useState("");
  const [classData, setClassData] = useState({
    maleStudents: 0,
    femaleStudents: 0,
  });

  useEffect(() => {
    if (role === "teacher" && selectedClass) {
      const selectedClassData = dashboardData?.studentData?.find(
        (classItem) => classItem.classId === selectedClass
      );

      if (selectedClassData) {
        setClassData({
          maleStudents: selectedClassData.maleStudents || 0,
          femaleStudents: selectedClassData.femaleStudents || 0,
        });
      } else {
        setClassData({
          maleStudents: 0,
          femaleStudents: 0,
        });
      }
    } else {
      setClassData({
        maleStudents: dashboardData?.studentData?.[0]?.maleStudents || 0,
        femaleStudents: dashboardData?.studentData?.[0]?.femaleStudents || 0,
      });
    }
  }, [selectedClass, role, dashboardData]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-2 py-4">
      <div className="flex flex-row items-center w-full justify-between">
        <div>
        <h2 className="text-2xl font-semibold mb-4 text-left w-full">
        {t("Total Students")}
      </h2>
        </div>
        <div>
        {role == "teacher" && (
              <div className="">
                <select
                  id="classSelection"
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="p-2 border rounded-md"
                >
                  {dashboardData?.studentData?.map((classItem) => (
                    <option key={classItem.classId} value={classItem.classId}>
                      {classItem.className}
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>
      </div>
   
    
      {/* Conditionally render spinner, error, no data message, or the pie chart */}
      <div
        className="relative w-[300px] h-[300px] flex items-center justify-center"
        style={{ minWidth: "300px", minHeight: "300px" }} // Fixed dimensions
      >
        {loading ? (
          <Spinner /> // Centered spinner with fixed dimensions
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <PiStudentBold className="text-6xl mb-4" />
            <p className="text-xl">Error: {error}</p>
          </div>
        ) : (
          <>
         

            {/* Pie chart */}
            <div
              className="relative my-5"
              style={{ width: "300px", height: "300px" }}
            >
              <Doughnut
                data={{
                  datasets: [
                    {
                      data: [
                        classData?.maleStudents || 0,
                        classData?.femaleStudents || 0,
                      ],
                      backgroundColor: ["#23C55E", "#8F77F3"],
                      borderWidth: 0,
                      cutout: "70%",
                      borderRadius: 10,
                      spacing: 5,
                      hoverOffset: 10,
                    },
                  ],
                  labels: ["Male Students", "Female Students"],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed !== null) {
                            label += context.parsed;
                          }
                          return label;
                        },
                      },
                    },
                  },
                  hover: {
                    mode: "nearest",
                    intersect: true,
                  },
                }}
              />
              {/* Centered total students count */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-sm font-medium">
                    {t("Total Students")}
                  </span>
                  <span className="block text-xl font-bold">
                    {classData.maleStudents + classData.femaleStudents}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-around mt-16 text-lg w-[22rem] gap-2">
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">{t("Female Students")}</span>
            <div className="font-bold text-gray-700">
              {classData?.femaleStudents ||0}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">{t("Male Students")}</span>
            <div className="font-bold text-gray-700">
              {classData?.maleStudents || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TotalStudentsGraphjs);
