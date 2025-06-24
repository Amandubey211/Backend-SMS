import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import DashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useParams } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import NoDataFound from "../../../../../../Components/Common/NoDataFound";
// import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";
import { stdClassmate } from "../../../../../../Store/Slices/Student/MyClass/Class/classMates/classmate.action";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../../../Components/Common/Spinner";
import { GoAlertFill } from "react-icons/go";
import ClassmateModal from "./ClassmateModal";
import { setShowError } from "../../../../../../Store/Slices/Common/Alerts/alertsSlice";
import OfflineModal from "../../../../../../Components/Common/Offline";
import SidebarSlide from "../../../../../../Components/Common/SidebarSlide";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const StudentClassMates = () => {
  const { classData } = useSelector((store) => store?.student?.studentClass);

  const className = classData?.className;

  useNavHeading(` ${className}`, "Classmates");

  const { classmateData, loading, error } = useSelector(
    (store) => store?.student?.studentClassmate
  );
  const { showError } = useSelector((store) => store?.common?.alertMsg);

  const dispatch = useDispatch();
  const { classId } = useParams();
  const [selectedClassmate, setSelectedClassmate] = useState(null); // Modal state
  // useNavHeading(selectedClassName, "Classmates");

  const handleDismiss = () => {
    dispatch(setShowError(false));
  };

  useEffect(() => {
    dispatch(stdClassmate({ classId }));
  }, [dispatch, classId]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleProfileClick = (classmate) => {
    setSelectedClassmate(classmate);
    setIsSidebarOpen(true); // Set selected classmate for modal
  };

  const closeModal = () => {
    setSelectedClassmate(null);
    setIsSidebarOpen(false);
    // Close modal
  };

  return (
    <Layout title="My Classmate">
      <DashLayout>
        <div className="p-4">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
          ) : //  : error ? (
          //   <div className="w-full flex flex-col items-center justify-center py-20">
          //     <GoAlertFill className="inline-block w-12 h-12 mb-3" />
          //     <p className="text-lg font-semibold">{error}</p>
          //   </div>
          // )
          classmateData?.length > 0 ? (
            <div className="flex flex-wrap -mx-2">
              {classmateData?.map((classmate, index) => (
                <ProfileCard
                  key={index}
                  profile={classmate}
                  onClick={() => handleProfileClick(classmate)} // Open modal on click
                />
              ))}
            </div>
          ) : (
            !loading &&
            classmateData?.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-20">
                <NoDataFound title="Classmates" />
              </div>
            )
          )}
        </div>

        {/* Render the modal if a classmate is selected */}
        {selectedClassmate && (
          <SidebarSlide
            isOpen={isSidebarOpen}
            onClose={closeModal}
            title={
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
                Classmate
              </span>
            }
            width="40%"
            height="100%"
          >
            <ClassmateModal classmate={selectedClassmate} />
          </SidebarSlide>
        )}
        {!loading && showError && (
          <OfflineModal error={error} onDismiss={handleDismiss} />
        )}
      </DashLayout>
    </Layout>
  );
};
export default StudentClassMates;
