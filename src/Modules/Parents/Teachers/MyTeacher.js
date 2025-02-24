import React, { useEffect } from 'react';
import TeacherCards from '../../../Components/Parents/Teachers/TeacherCard';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../../Store/Slices/Parent/Children/children.action'; // Import the thunk
import Spinner from '../../../Components/Common/Spinner';
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";


const MyTeacher = () => {
    const { t } = useTranslation('prtChildrens');
    const { ssid: studentId } = useParams();
    const dispatch = useDispatch();

    // Access the teacher-related data from Redux state
    const { teachers = [], loading, error } = useSelector((state) => state.Parent.children); // Default empty array for teachers

    // Fetch teachers when component mounts or when studentId changes
    useEffect(() => {
        if (studentId) {
            dispatch(fetchTeachers(studentId));
        }
    }, [dispatch, studentId]);

    const TeacherCardSkeleton = ({ count }) => {
        return (
          <div className="h-full w-full p-4">
            {/* Title Skeleton (Single Instance) */}
            <div className="flex items-center justify-start mb-4">
              <Skeleton.Input active size="small" style={{ width: "150px", height: "20px" }} /> {/* "Child Instructors" Text */}
              <div
                className="ml-2 flex items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)",
                  width: "32px",
                  height: "32px",
                }}
              >
              </div>
            </div>
      
            {/* Teacher Card Skeletons (Exact Count) */}
            <div className="flex flex-wrap justify-start gap-6">
              {[...Array(count)].map((_, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center"
                  style={{
                    minWidth: "260px",
                    maxWidth: "100%",
                    height: "19rem", // Increased height
                    padding: "20px",
                    textAlign: "center",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Profile Image */}
                  <Skeleton.Avatar active size={90} shape="circle" />
      
                  {/* Name */}
                  <Skeleton.Input active size="small" style={{ width: "80%", height: "18px", marginTop: "15px" }} />
      
                  {/* Role */}
                  <Skeleton.Input active size="small" style={{ width: "80%", height: "18px", marginTop: "10px" }} />
      
                  {/* Divider */}
                  <div className="w-full border-t my-3"></div>
      
                  {/* Phone Label */}
                  <Skeleton.Input active size="small" style={{ width: "30%", height: "14px", marginTop: "13px" }} />
      
                  {/* Phone Number */}
                  <Skeleton.Input active size="small" style={{ width: "50%", height: "16px", marginTop: "10px" }} />
                </div>
              ))}
            </div>
          </div>
        );
      };
 
    // Handling the loading state
    if (loading) {
        return <TeacherCardSkeleton count={teachers?.length || 2} />;
    }


    // Handling error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">{error}: {t("Unable to Fetch Instructors")}</p>
            </div>
        );
    }

    // Handling case where no teachers are found
    if (teachers?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaChalkboardTeacher className="text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500">{t("No Instructors Found")}!</p>
            </div>
        );
    }

    // Render teacher cards if teachers are available
    return (
        <div className="h-full w-full p-4">
            <div className="text-lg font-medium mb-4 flex items-center">
                {t("Child Instructors")}
                <div
                    className="ml-2 flex items-center justify-center rounded-full"
                    style={{
                        background: 'linear-gradient(to right, #FAECF0 0%, #F3EBFB 100%)',
                        width: '32px',
                        height: '32px',
                    }}
                >
                    <span
                        style={{
                            background: 'linear-gradient(to right, #C83B62 0%, #7F35CD 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                        className="text-lg font-semibold"
                    >
                        {teachers?.length.toString().padStart(2, '0')} {/* Optional chaining to prevent errors */}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap justify-start">
                {teachers?.map((instructor) => (
                    <TeacherCards key={instructor?.id} instructor={instructor} />
                ))}
            </div>
        </div>
    );
};

export default MyTeacher;
