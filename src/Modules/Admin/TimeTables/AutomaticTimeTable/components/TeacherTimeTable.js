import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchTimeTablesForTeacher } from '../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk';


const TeacherTimeTable = ({selectedTeacher}) => {
    const dispatch = useDispatch();
    const { loading, success, ascTeacherTimeTable, error } = useSelector(
      (state) => state?.admin?.ascTimeTable
    );
console.log(ascTeacherTimeTable)
    useEffect(() => {
        dispatch(
          fetchTimeTablesForTeacher({
            teacherId: selectedTeacher,
             })
        );
      }, [dispatch, selectedTeacher]);
  return (
    <div>
      <h1>{selectedTeacher}</h1>
      </div>
  )
}

export default TeacherTimeTable