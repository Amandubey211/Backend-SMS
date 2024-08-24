import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaCalendarAlt } from "react-icons/fa";
import useGetAdminDashboardData from "../../../../Hooks/AuthHooks/Staff/Admin/Dashboard/useGetAdminDashboardData";
import Fallback from "../../../../Components/Common/Fallback";
import { useSelector } from "react-redux";

const TotalStudentsGraphjs = () => {
  const { loading, error, dashboardData, fetchAdminDashboardData } =
    useGetAdminDashboardData();
  const role = useSelector((store) => store.Auth.role);
  const [selectedClass, setSelectedClass] = useState("");
  const [classData, setClassData] = useState({
    maleStudents: 0,
    femaleStudents: 0,
  });

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  useEffect(() => {
    if (role === "teacher" && selectedClass) {
      console.log("dashboardData", dashboardData);

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
        maleStudents: dashboardData?.studentData[0].maleStudents || 0,
        femaleStudents: dashboardData?.studentData[0].femaleStudents || 0,
      });
    }
  }, [selectedClass, dashboardData, role]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  if (loading) {
    return <Fallback />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (
    !dashboardData ||
    (classData.maleStudents === 0 && classData.femaleStudents === 0)
  ) {
    return (
      <div className="max-w-xs px-2 h-full">
        <h2 className="text-2xl font-semibold">Total Students</h2>
        <div className="flex flex-col items-center justify-center">
          <FaCalendarAlt className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-xl">No student data found</p>
        </div>
      </div>
    );
  }

  const data = {
    datasets: [
      {
        data: [classData.maleStudents || 0, classData.femaleStudents || 0],
        backgroundColor: ["#23C55E", "#8F77F3"],
        borderWidth: 0,
        cutout: "70%",
        borderRadius: 10,
        spacing: 5,
        hoverOffset: 10,
      },
    ],
    labels: ["Male Students", "Female Students"],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
  };

  return (
    <div className="max-w-xs px-2 py-4 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Total Students</h2>
        {role === "teacher" && (
          <div className="mb-4 md:mb-0">
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

      <div
        className="relative p-8 my-5 mb-12"
        style={{ width: "300px", height: "300px" }}
      >
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="block text-sm font-medium">Total Students</span>
            <span className="block text-xl font-bold">
              {classData.maleStudents + classData.femaleStudents}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-around mt-4 text-lg pl-10 w-[20rem] gap-2">
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#8F77F3] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">Female Students</span>
            <div className="font-bold text-gray-700">
              {classData.femaleStudents}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="w-16 h-1 bg-[#23C55E] rounded-full mb-1"></div>
          <div className="text-left">
            <span className="text-gray-700">Male Students</span>
            <div className="font-bold text-gray-700">
              {classData.maleStudents}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalStudentsGraphjs;
