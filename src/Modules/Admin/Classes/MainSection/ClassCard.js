import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Tooltip } from "antd";
import { deleteClass } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import {
  setSelectedClassName,
  setSelectedClassId,
} from "../../../../Store/Slices/Common/User/reducers/userSlice";

import leftLogo from "../../../../Assets/ClassesAssets/ClassCardLeftLogo.png";
import RightLogo from "../../../../Assets/ClassesAssets/ClassCardRightLogo.png";
import centerLogo from "../../../../Assets/ClassesAssets/ClassCardCenterLogo.png";
import DeleteModal from "../../../../Components/Common/DeleteModal";

const ClassCard = ({ role, classData, onEdit }) => {
  const { t } = useTranslation("admClass");
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const loading = useSelector((state) => state.admin.class.loading);

  const {
    className,
    teachersCount,
    studentsCount,
    sectionsCount,
    groupsCount,
    _id: classId,
    classIcons,
  } = classData;

  const handleDeleteClick = () => setModalOpen(true);
  const handleConfirmDelete = () => {
    setModalOpen(false);
    dispatch(deleteClass(classId));
  };
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <div className="group p-1 pb-4 border rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl relative">
        {/* Top Logos */}
        <div className="flex justify-between items-center px-1">
          <img
            src={leftLogo}
            className="w-10 opacity-50 transition-opacity duration-300 group-hover:opacity-90"
            alt="class_logo"
          />
          <img
            src={RightLogo}
            className="w-10 opacity-50 transition-opacity duration-300 group-hover:opacity-90"
            alt="class_logo"
          />
        </div>

        {/* Admin Edit/Delete Icons */}
        {role === "admin" && (
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(classData)}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <TbEdit className="w-5 h-5 text-green-500" />
            </button>
            <button
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
              onClick={handleDeleteClick}
              className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        {/* Main Card Content */}
        <NavLink
          to={`/class/${classId}`}
          onClick={() => {
            dispatch(setSelectedClassName(className));
            dispatch(setSelectedClassId(classId));
          }}
          className="flex flex-col gap-1 justify-center items-center -mt-4 " 
        >
          {/* Tooltip with Truncated Title */}
          <Tooltip title={className}>
            <h2 className="text-xl font-bold text-purple-600 capitalize truncate w-full text-center px-5">
              {className}
            </h2>
          </Tooltip>
          {/* Centered Teachers Count */}
          <p className="text-center">
            {teachersCount} {t("Teachers")}
          </p>
          {/* Class Icon */}
          <img
            src={classIcons || centerLogo}
            className="w-20 h-20 object-contain mb-2"
            alt="center_logo"
          />
        </NavLink>

        {/* Bottom Stats Row */}
        <div className="flex justify-around items-center px-3">
          <div className="flex flex-col items-center gap-1">
            <p className="opacity-50">{t("Students")}</p>
            <span className="font-bold">{studentsCount}</span>
          </div>
          <div className="flex border-x px-4 border-opacity-45 border-black flex-col items-center gap-1">
            <p className="opacity-50">{t("Section")}</p>
            <span className="font-bold">{sectionsCount}</span>
          </div>
          <div className="flex items-center flex-col gap-1">
            <p className="opacity-50">{t("Group")}</p>
            <span className="font-bold">{groupsCount}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {role === "admin" && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title={className}
        />
      )}
    </>
  );
};

ClassCard.propTypes = {
  role: PropTypes.string.isRequired,
  classData: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ClassCard;
