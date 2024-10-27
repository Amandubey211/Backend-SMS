import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import AcademicYearTable from "./Components/AcademicYearTable";
import { setAcademicYear } from "../../../Store/Slices/Common/Auth/reducers/authSlice";
import { baseUrl } from "../../../config/Common";
import { fetchAcademicYear } from "../../../Store/Slices/Common/AcademicYear/academicYear.action";


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const MainSection = () => {
  const dispatch = useDispatch();
  const {academicYears,loading,error} = useSelector((store)=>store.common.academicYear)
  const handleCheckboxChange = async (selectedYear) => {
  };
  useEffect(() => {
    
    dispatch(fetchAcademicYear())
  }, [dispatch]);

  return (
    <div className=" min-h-screen flex w-full">
      <div className="w-full">
        <AcademicYearTable
          academicYears={academicYears}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default MainSection;
