// ProfileCard.js
import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { MdBlock, MdOutlinePublishedWithChanges } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  activeUser,
  deactiveUser,
} from "../../../../Store/Slices/Admin/Users/Staff/staff.action";
import DeleteConfirmatiomModal from "../../../../Components/Common/DeleteConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import profileIcon from "../../../../Assets/DashboardAssets/profileIcon.png";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const ProfileCard = ({ profile, onClick, editUser }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.admin.all_staff);
  const role = useSelector((store) => store.common.auth.role);

  // State for Modals and Tooltips
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameTooltipVisible, setIsNameTooltipVisible] = useState(false);
  const [isPositionTooltipVisible, setIsPositionTooltipVisible] =
    useState(false);

  // Handlers for Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handler to Deactivate Teacher
  const deleteTeacher = () => {
    const userData = { id: profile._id, role: profile.role };
    dispatch(deactiveUser(userData));
    setIsModalOpen(false);
  };

  // Handler to Activate Teacher
  const activateUser = (e, id, role) => {
    e.stopPropagation();
    const userData = { staffId: id, role, active: true };
    dispatch(activeUser(userData));
  };

  /**
   * Truncates the full name to the specified limit,
   * showing a single "..." ONLY as a clickable element.
   * This avoids double dots in the UI.
   */
  const getTruncatedName = (firstName, lastName, limit = 20) => {
    const fullName = `${firstName} ${lastName}`;
    if (fullName.length <= limit) {
      return <span>{fullName}</span>;
    }

    // We slice but do NOT add "..." here to avoid double dots
    const truncated = fullName.slice(0, limit);

    return (
      <div className="relative inline-block">
        <span>{truncated}</span>
        <span
          className="text-blue-600 font-bold cursor-pointer ml-1"
          onMouseEnter={() => setIsNameTooltipVisible(true)}
          onMouseLeave={() => setIsNameTooltipVisible(false)}
          aria-label={`Show full name: ${fullName}`}
        >
          ...
        </span>
        <AnimatePresence>
          {isNameTooltipVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-40 bg-white border border-gray-300 rounded-md shadow-lg p-2 mt-1 right-0"
            >
              <p className="text-sm font-medium text-gray-800">Full Name:</p>
              <p className="mt-1 text-gray-700 text-sm">{fullName}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Function to Truncate Positions
  const getTruncatedPositions = (positions, limit = 1) => {
    if (!Array.isArray(positions) || positions.length === 0) {
      return "No positions assigned";
    }
    if (positions.length <= limit) {
      return positions.join(", ");
    }
    const visible = positions.slice(0, limit).join(", ");
    const remaining = positions.slice(limit);
    const remainingCount = remaining.length;

    return (
      <div className="relative inline-block">
        <span>{visible} </span>
        <span
          className="text-blue-600 font-bold cursor-pointer"
          onMouseEnter={() => setIsPositionTooltipVisible(true)}
          onMouseLeave={() => setIsPositionTooltipVisible(false)}
          aria-label={`Show ${remainingCount} more positions`}
        >
          +{remainingCount}
        </span>
        <AnimatePresence>
          {isPositionTooltipVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-40 bg-white border border-gray-300 rounded-md shadow-lg p-2 mt-1 right-0"
            >
              <p className="text-sm font-medium text-gray-800">
                More Positions:
              </p>
              <ul className="mt-1 text-gray-700 text-sm list-disc list-inside">
                {remaining.map((pos, index) => (
                  <li key={index}>{pos}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
      <div
        onClick={() => onClick(profile)}
        className="block p-6 bg-white rounded-lg hover:shadow-lg transition cursor-pointer border"
      >
        {!profile?.active && (
          <span className="flex my-[-.5rem] text-red-600 font-bold text-sm">
            Deactivated
          </span>
        )}

        <div className="absolute right-0 top-0 flex flex-col px-4 py-2 gap-2 justify-start">
          {profile?.active && (
            <ProtectedAction
              requiredPermission={PERMISSIONS[`EDIT_${role.toUpperCase()}`]}
            >
              <button
                className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition"
                onClick={(event) => editUser(event, profile)}
                aria-label="Edit User"
              >
                {loading ? (
                  <FiLoader className="animate-spin w-[1rem] h-[1rem]" />
                ) : (
                  <CiEdit className="text-sm text-green-500" />
                )}
              </button>
            </ProtectedAction>
          )}

          {profile?.active ? (

            <ProtectedAction requiredPermission={PERMISSIONS[`DEACTIVE_${role.toUpperCase()}`]}>

              <button
                className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition"
                title="Deactivate"
                onClick={(event) => {
                  event.stopPropagation();
                  openModal();
                }}
                aria-label="Deactivate User"
              >
                <MdBlock className="text-sm text-red-500" />
              </button>
            </ProtectedAction>
          ) : (
            <ProtectedAction
              requiredPermission={PERMISSIONS[`ACTIVE_${role.toUpperCase()}`]}
            >
              <button
                className="bg-transparent p-2 rounded-full border hover:bg-gray-200 transition"
                title="Activate"
                onClick={(e) => activateUser(e, profile._id, profile.role)}
                aria-label="Activate User"
              >
                <MdOutlinePublishedWithChanges className="text-sm text-green-500" />
              </button>
            </ProtectedAction>
          )}
        </div>

        <div className="flex flex-col h-[80%] justify-center items-center py-3">
          <img
            className="object-cover rounded-full w-[100px] h-[100px] border"
            src={profile?.profile || profileIcon}
            alt={`${profile.firstName} ${profile.lastName}`}
          />
          <h3 className="text-lg font-medium">
            {getTruncatedName(profile.firstName, profile.lastName)}
          </h3>
          {role === "admin" && (
            <p className="text-gray-500 text-sm mt-1">
              {getTruncatedPositions(profile?.position)}
            </p>
          )}
        </div>

        <div className="p-4 text-center justify-center items-center border-t-2">
          <p className="text-gray-600">Phone: {profile.mobileNumber}</p>
        </div>
      </div>

      {/* Deactivation Confirmation Modal */}
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
