import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useParams } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";
import { baseUrl } from "../../../../../../config/Common";
import Spinner from "../../../../../../Components/Common/Spinner";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const StudentClassMates = () => {
  const { selectedClass, selectedClassName } = useSelector(
    (state) => ({
      selectedClass: state.Common.selectedClass,
      selectedClassName: state.Common.selectedClassName,
    }),
    shallowEqual
  );
  const { cid } = useParams();
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useNavHeading(selectedClassName, "Classmates");

  const fetchClassmates = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("student:token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `${baseUrl}/student/my_classmates/${selectedClass}`,
        {
          headers: { Authentication: token },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch classmates, status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status && data.data) {
        setClassmates(data.data);
      } else {
        throw new Error("No classmates data available");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchClassmates();
    } else {
      setError("Class ID is undefined");
      setLoading(false);
    }
  }, [cid, selectedClass]);

  // Render loading spinner while fetching data
  if (loading) return <Spinner />;

  // Render error state with a retry button
  if (error) {
    return (
      <Layout title="Error">
        <DashLayout>
          <div className="p-4 flex flex-col items-center justify-center">
            <p className="text-red-500 text-lg mb-4">
              {error || "Something went wrong"}
            </p>
            <button
              onClick={fetchClassmates}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              aria-label="Retry fetching classmates"
            >
              Retry
            </button>
          </div>
        </DashLayout>
      </Layout>
    );
  }

  return (
    <Layout title="My Classmates">
      <DashLayout>
        <div className="p-4">
          <div className="flex items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">My Classmates</h2>
            <div
              className="flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-full w-[25px] h-[25px] border border-gray-300"
              aria-label={`Number of classmates: ${classmates.length}`}
            >
              <p className="text-lg font-semibold text-purple-500">
                {classmates.length || 0}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {classmates.length > 0 ? (
              classmates.map((classmate, index) => (
                <ProfileCard key={index} profile={classmate} />
              ))
            ) : (
              <NoDataFound title="No Classmates Found" />
            )}
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentClassMates;
