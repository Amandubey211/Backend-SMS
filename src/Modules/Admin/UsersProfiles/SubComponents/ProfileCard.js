import React, { useState } from "react";
import { FiLoader, FiUserPlus } from 'react-icons/fi';
import profileIcon from '../../../../Assets/DashboardAssets/profileIcon.png';
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import { MdBlock, MdOutlinePublishedWithChanges } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { activeUser, deactiveUser } from "../../../../Store/Slices/Admin/Users/Staff/staff.action";

const ProfileCard = ({ profile, onClick, editUser }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.admin.all_staff);
  
  // Fetch user role from Redux store
  const role = useSelector((store) => store.common.auth.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const deleteTeacher = () => {
    const userData = { id: profile._id, role: profile.role };
    dispatch(deactiveUser(userData));
    setIsModalOpen(false);
  };

  const activateUser = (e, id, role) => {
    e.stopPropagation();
    const userData = { staffId: id, role, active: true };
    dispatch(activeUser(userData));
  };

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        onClick={() => onClick(profile)}
        className="block p-6 bg-white rounded-lg hover:shadow-lg transition cursor-pointer border"
      >
        {profile?.active ? null : (
          <span className="flex my-[-.5rem] text-red-600 font-bold text-sm">Deactivated</span>
        )}

        {/* Icons: Conditionally rendered if the role is not 'teacher' */}
        {role === "admin" && (
          <div className="absolute right-0 top-0 flex flex-col px-4 py-2 gap-2 justify-start">
            {profile?.active ? (
              <button
                className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition"
                onClick={(event) => editUser(event, profile)}
              >
                {loading ? (
                  <FiLoader className="animate-spin w-[1rem] h-[1rem]" />
                ) : (
                  <FiUserPlus className="text-sm text-green-500" />
                )}
              </button>
            ) : null}
            
            {profile?.active ? (
              <button
                className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition"
                title="Deactivate"
                onClick={(event) => {
                  event.stopPropagation();
                  openModal();
                }}
              >
                <MdBlock className="text-sm text-red-500" />
              </button>
            ) : (
              <button
                className="bg-transparent p-2 rounded-full border"
                title="Activate"
                onClick={(e) => activateUser(e, profile._id, profile.role)}
              >
                <MdOutlinePublishedWithChanges className="text-sm text-green-500" />
              </button>
            )}
          </div>
        )}

        {/* Profile Image and Details */}
        <div className="flex flex-col h-[80%] justify-center items-center py-3">
          <img
            className="object-cover rounded-full w-[100px] h-[100px] border"
            src={profile?.profile || profileIcon}
            alt={profile.firstName}
          />
          <h3 className="text-lg font-medium">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-gray-500">{profile.position}</p>
        </div>

        {/* Contact Info */}
        <div className="p-4 text-center justify-center items-center border-t-2">
          <p className="text-gray-600">Phone: {profile.mobileNumber}</p>
        </div>
      </div>

      {/* Deactivate Modal */}
      {!loading && (
        <DeleteConfirmatiomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={deleteTeacher}
          text={"Deactivate"}
        />
      )}
    </div>
  );
};

export default ProfileCard;
