import React from "react";

import { AiOutlineRight } from "react-icons/ai";
import { BsLightningFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { setSelectedAssignmentname } from "../../../../Redux/Slices/Common/CommonSlice";
import toast from "react-hot-toast";
const SpeedGradeButton = ({ sgid, name, isPublish, type }) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  dispatch(setSelectedAssignmentname(name));
  const HandleClick = () => {
    if (isPublish) {
      navigate(`/class/${cid}/${sid}/speedgrade/${type}/${sgid}`);
    } else {
      toast.error(`${type} Not Publish Yet`);
      return;
    }
  };
  return (
    <button
      onClick={HandleClick}
      className={`flex items-center justify-center w-full mt-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full ${
        !isPublish && "opacity-50 "
      }`}
      aria-label="Speed Grade"
    >
      <BsLightningFill className="mr-2" aria-hidden="true" />
      <span>Speed Grade</span>
      <AiOutlineRight className="ml-2" aria-hidden="true" />
    </button>
  );
};

export default SpeedGradeButton;
