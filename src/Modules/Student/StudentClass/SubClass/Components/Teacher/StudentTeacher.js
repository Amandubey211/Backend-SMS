import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { stdClassTeacher } from "../../../../../../Store/Slices/Student/MyClass/Class/classTeacher/classTeacher.action";
import Spinner from "../../../../../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go";


const StudentTeacher = () => {

  const dispatch = useDispatch();
  const { teacherData, loading, error } = useSelector((store) => store?.student?.studentClassTeacher);
  const { classId } = useParams();
  // useNavHeading(selectedClassName, "Teachers");

  useEffect(() => {
    dispatch(stdClassTeacher({ classId }))
  }, [dispatch, classId]);

  return (
    <Layout title="My Class Teachers">
      <DashLayout>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">My Class Teachers </h2>
            <div className="flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-full w-[25px] h-[25px] border border-gray-300">
              <p className="text-lg font-semibold text-purple-500">
                {teacherData?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {loading ? (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <Spinner />
              </div>
            ) : error ? (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <GoAlertFill className="inline-block w-12 h-12 mb-3" />
                <p className="text-lg font-semibold">{error}</p>
              </div>
            ) : teacherData?.length > 0 ? (
              teacherData.map((teacher, index) => (
                <ProfileCard key={index} profile={teacher} />
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <NoDataFound title="Teachers" />
              </div>
            )}
          </div>
        </div>
      </DashLayout>
    </Layout>
  );
};

export default StudentTeacher;
