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

const StudentClassMates = () => {
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
  }

  useEffect(() => {
    dispatch(stdClassmate({ classId }));
  }, [dispatch, classId]);


  const handleProfileClick = (classmate) => {
    setSelectedClassmate(classmate); // Set selected classmate for modal
  };

  const closeModal = () => {
    setSelectedClassmate(null); // Close modal
  };

  return (
    <Layout title="My Classmates">
      <DashLayout>
        <div className="p-4">
          <div className="flex items-center mb-4 gap-3">
            <h2 className="text-xl text-gray-600 font-semibold">My Classmates</h2>
            <div
              className="flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-full w-[25px] h-[25px] border border-gray-300"
              aria-label={`Number of classmates: ${classmateData?.length || 0}`}
            >
              <p className="text-lg font-semibold text-purple-500">
                {classmateData?.length || 0}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="w-full flex flex-col items-center justify-center py-20">
              <GoAlertFill className="inline-block w-12 h-12 mb-3" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          ) : classmateData?.length > 0 ? (
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
            <div className="w-full flex flex-col items-center justify-center py-20">
              <NoDataFound title="No Classmates Found" />
            </div>
          )}
        </div>

        {/* Render the modal if a classmate is selected */}
        {selectedClassmate && (
          <ClassmateModal
            classmate={selectedClassmate}
            onClose={closeModal}
          />
        )}
        {!loading && showError && (
          <OfflineModal error={error} onDismiss={handleDismiss} />
        )}
      </DashLayout>
    </Layout>
  );
};
export default StudentClassMates;
