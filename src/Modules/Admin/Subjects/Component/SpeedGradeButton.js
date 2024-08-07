import React from "react";

import { AiOutlineRight } from "react-icons/ai";
import { BsLightningFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { setSelectedAssignmentname } from "../../../../Redux/Slices/Common/CommonSlice";
const SpeedGradeButton = ({ sgid, name }) => {
  const { cid, sid } = useParams();
  const dispatch = useDispatch();

  dispatch(setSelectedAssignmentname(name));
  return (
    <NavLink
      to={`/class/${cid}/${sid}/speedgrade/${sgid}`}
      className="flex items-center justify-center w-full mt-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
      aria-label="Speed Grade"
    >
      <BsLightningFill className="mr-2" aria-hidden="true" />
      <span>Speed Grade</span>
      <AiOutlineRight className="ml-2" aria-hidden="true" />
    </NavLink>
  );
};

export default SpeedGradeButton;
