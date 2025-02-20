import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AcademicYearTable from "./Components/AcademicYearTable";
import {
  fetchAcademicYear,
  updateAcademicYear,
} from "../../../Store/Slices/Common/AcademicYear/academicYear.action";
import Spinner from "../Spinner";
import { setSeletedAcademicYear } from "../../../Store/Slices/Common/AcademicYear/academicYear.slice";
import Cookies from "js-cookie";
import { setLocalCookies } from "../../../Utils/academivYear";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const MainSection = () => {
  const dispatch = useDispatch();
  const { academicYears, loading, seletedAcademicYear } = useSelector(
    (store) => store.common.academicYear
  );
  const handleCheckboxChange = async (selectedYear) => {
    //need custom popup
    alert("After select the year need to reload the page");
    setLocalCookies("say", selectedYear._id);

    dispatch(setSeletedAcademicYear(selectedYear));
    window.location.reload();
  };
  useEffect(() => {
    dispatch(fetchAcademicYear());
  }, [dispatch]);

  return (
    <div className=" min-h-screen flex w-full">
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full">
          <AcademicYearTable
            academicYears={academicYears}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
      )}
    </div>
  );
};

export default MainSection;
