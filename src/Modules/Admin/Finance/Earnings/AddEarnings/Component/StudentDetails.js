import React, { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {  fetchSectionsNamesByClass } from "../../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchStudentsByClassAndSectionNames } from "../../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { SelectDynamicInput } from "./SelectDynamicInput";
import { fetchAllClasses } from "../../../../../../Store/Slices/Admin/Class/actions/classThunk";

const StudentDetails = ({setStudentDetail} ) => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchAllClasses())
  },[])
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const {studentsList,loading} = useSelector((state) => state.admin.students);
  const classList = useSelector((state) => state.admin.class.classes);
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "classId") {
      dispatch(fetchSectionsNamesByClass(value));
      dispatch(fetchStudentsByClassAndSectionNames(value));
      setStudentDetail((prev) => ({...prev, classId:value}));

    }
    if (name == "sectionId") {
      dispatch(fetchStudentsByClassAndSectionNames(value));
      setStudentDetail((prev) => ({...prev, sectionId:value}));
    }
    if (name == "studentId"){
      setStudentDetail((prev) => ({...prev, studentId:value}));
    }

  };
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Student Details
      </h2>
      <div className="grid grid-cols-3 gap-6">
        <SelectDynamicInput
          label="Class"
          name="classId"
          options={classList}
          forWhom='class'
          onChange={handleInputChange}
          
        />
        <SelectDynamicInput
          label="Section"
          name="sectionId"
          options={sectionList || []}
          forWhom='section'
          onChange={handleInputChange}
        />
            <SelectDynamicInput
          label="Student"
          name="studentId"
          options={studentsList || []}
          forWhom='student'
          onChange={handleInputChange}
         disabled = {loading}
        />
      </div>
    </div>
  );
};

export default StudentDetails;
