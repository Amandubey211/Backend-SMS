import React, { useState } from "react";
import leftLogo from "../../../../Assets/ClassesAssets/ClassCardLeftLogo.png";
import RightLogo from "../../../../Assets/ClassesAssets/ClassCardRightLogo.png";
import centerLogo from "../../../../Assets/ClassesAssets/ClassCardCenterLogo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedClass } from "../../../../Redux/Slices/Common/CommonSlice";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import Sidebar from "../../../../Components/Common/Sidebar";
import AddNewClass from "./AddNewClass";
import useCreateClass from "../../../../Hooks/AuthHooks/Staff/Admin/Class/useCreateClass";

const ClassCard = ({
  className,
  teachersCount,
  students,
  sections,
  groups,
  classId,
}) => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { deleteClass, loading } = useCreateClass();

  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleDelete = (clasId) => {
    deleteClass(classId)

  };
  return (
    <>
      <div className="group p-1 pb-4 border rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
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
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleSidebarOpen}
            className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
          >
            <TbEdit className="w-5 h-5  text-green-500" />
          </button>
          <button
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
            onClick={() => handleDelete(classId)}
            className="bg-white p-1 rounded-full shadow hover:bg-gray-200"
          >
            <RiDeleteBin6Line className="w-5 h-5 text-red-500" />
          </button>
        </div>
        <NavLink
          to={`/class/${classId}`}
          onClick={() => dispatch(setSelectedClass(className))}
          className="flex flex-col gap-1 justify-center items-center -mt-4"
        >
          <h2 className="text-xl font-bold text-purple-600 capitalize">
            {className}
          </h2>
          <p>{teachersCount} Teachers</p>
          <img src={centerLogo} className="w-20" alt="center_logo" />
        </NavLink>
        <div className="flex justify-between items-center px-3">
          <div className="flex flex-col items-center gap-1">
            <p className="opacity-50">Students</p>
            <span className="font-bold">{students}</span>
          </div>
          <div className="flex border-x px-4 border-opacity-45 border-black flex-col items-center gap-1">
            <p className="opacity-50">Section</p>
            <span className="font-bold">{sections}</span>
          </div>
          <div className="flex items-center flex-col gap-1">
            <p className="opacity-50">Group</p>
            <span className="font-bold">{groups}</span>
          </div>
        </div>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Update Class"
      >
        <AddNewClass className={className} classId={classId} isUpdate={true} />
      </Sidebar>
    </>
  );
};

export default ClassCard;
