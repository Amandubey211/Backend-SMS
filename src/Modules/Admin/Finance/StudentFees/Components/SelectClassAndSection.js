import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsNamesByClass } from "../../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllClasses } from "../../../../../Store/Slices/Admin/Class/actions/classThunk";
import { fetchStudentsByClassAndSectionNames } from "../../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { setSelectedStudentsIds } from "../../../../../Store/Slices/Finance/StudentFees/studentFeesSlice";


const SidebarClassSelection = () => {
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);
  const sectionsList = useSelector((state) => state.admin.group_section.sectionsList);
  const { studentsList } = useSelector((state) => state.admin.students);

  const [classAndSectionDetail, setClassAndSectionDetail] = useState([]);
  const [studentIds, setStudentIds] = useState([]);

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const handleClassSelect = (classId) => {
    setClassAndSectionDetail((prevDetails) => {
      const findClass = prevDetails.find((c) => c.classId === classId);

      if (findClass) {
        return prevDetails.filter((c) => c.classId !== classId);
      } else {
        dispatch(fetchSectionsNamesByClass(classId));
        return [...prevDetails, { classId, sections: [] }];
      }
    });
  };

  useEffect(() => {
    if (sectionsList.length > 0) {
      setClassAndSectionDetail((prev) =>
        prev.map((c) =>
          c.sections.length === 0
            ? {
              ...c,
              sections: sectionsList.map((s) => ({
                sectionId: s._id,
                sectionName: s.sectionName,
                students: [],
                selected: false,
              })),
            }
            : c
        )
      );
    }
  }, [sectionsList]);

  const handleSectionSelect = async (classId, sectionId) => {
    setClassAndSectionDetail((prevDetails) =>
      prevDetails.map((c) =>
        c.classId === classId
          ? {
            ...c,
            sections: c.sections.map((s) =>
              s.sectionId === sectionId
                ? { ...s, selected: !s.selected }
                : s
            ),
          }
          : c
      )
    );

    const selectedSection = classAndSectionDetail
      .find((c) => c.classId === classId)
      ?.sections.find((s) => s.sectionId === sectionId);

    if (!selectedSection?.selected) {
      const { payload } = await dispatch(fetchStudentsByClassAndSectionNames(sectionId));

      setClassAndSectionDetail((prevDetails) =>
        prevDetails.map((c) =>
          c.classId === classId
            ? {
              ...c,
              sections: c.sections.map((s) =>
                s.sectionId === sectionId
                  ? { ...s, students: payload }
                  : s
              ),
            }
            : c
        )
      );

      // Add all students to studentIds when section is selected
      setStudentIds((prev) => [...new Set([...prev, ...payload.map((std) => std._id)])]);
    } else {
      // Remove all students from studentIds when section is unselected
      setStudentIds((prev) =>
        prev.filter(
          (id) => !selectedSection.students.some((std) => std._id === id)
        )
      );
    }
  };

  // Handle individual student selection
  const handleStudentSelect = (studentId, isChecked) => {
    setStudentIds((prev) =>
      isChecked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  // Handle "Select All Students" checkbox
  const handleSelectAllStudents = (classId, sectionId, isChecked) => {
    setStudentIds((prev) => {
      const section = classAndSectionDetail
        .find((c) => c.classId === classId)
        ?.sections.find((s) => s.sectionId === sectionId);
  
      if (section) {
        const studentIdsToUpdate = section.students.map((std) => std._id);
  
        return isChecked
          ? [...new Set([...prev, ...studentIdsToUpdate])] 
          : prev.filter((id) => !studentIdsToUpdate.includes(id)); 
      }
      return prev;
    });
  };
  




  useEffect(() => {
    const selectedStudentIds = [];

    classAndSectionDetail?.forEach((sec) => {
      sec?.sections
        ?.filter((i) => i.selected)
        ?.forEach((sd) => {
          sd?.students?.forEach((std) => {
            selectedStudentIds.push(std._id);
          });
        });
    });

    setStudentIds(selectedStudentIds);
   let stdIds = selectedStudentIds.map((s)=>{
        return {studentId:s}
    })
    dispatch(setSelectedStudentsIds(stdIds))
  }, [classAndSectionDetail]);

  return (
    <div className="p-4 w-full ">
      {classList?.map((cls) => (
        <div key={cls._id} className="mb-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={classAndSectionDetail.some((c) => c.classId === cls._id)}
              onChange={() => handleClassSelect(cls._id)}
              className="w-6 h-6 cursor-pointer"
            />
            <span>{cls.className}</span>
          </label>

          {classAndSectionDetail.find((c) => c.classId === cls._id) && (
            <div className="ml-4 mt-2 flex flex-col items-start gap-2">
              {classAndSectionDetail
                .find((c) => c.classId === cls._id)
                ?.sections.map((sec) => (<>
                  <div key={sec.sectionId}>
                    <label className="flex items-center space-x-2 text-gray-800">
                      <input
                        type="checkbox"
                        checked={sec.selected}
                        onChange={() => handleSectionSelect(cls._id, sec.sectionId)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="cursor-pointer">{sec.sectionName}</span>
                    </label>

                  </div>
                  {classAndSectionDetail?.find((c) => c.classId === cls._id)?.sections?.find((i) => i?.sectionId == sec?.sectionId)?.selected & classAndSectionDetail?.find((c) => c.classId === cls._id)?.sections?.find((i) => i?.sectionId == sec?.sectionId)?.students?.length > 0 ?
                    <>
                      <label>
                        <input
                          type="checkbox"
                          checked={sec.students.every((s) => studentIds.includes(s._id))}
                          onChange={(e) => handleSelectAllStudents(cls._id, sec.sectionId, e.target.checked,classAndSectionDetail?.find((c) => c.classId === cls._id)?.sections?.find((i) => i?.sectionId == sec?.sectionId)?.students)}
                        />
                        <span className="text-sm m-1 cursor-pointer ">Select All Students</span>
                      </label>
                      <div className="flex w-[99%] flex-wrap gap-8 border border-gray-200 h-[10rem] rounded-lg p-2 overflow-y-auto">

                        {
                          classAndSectionDetail?.find((c) => c.classId === cls._id)?.sections?.find((i) => i?.sectionId == sec?.sectionId)?.students?.map((std) => (
                            <div className="w-auto h-[3rem] flex  items-start px-2 justify-center flex-col bg-purple-500  text-white text-sm rounded-lg">
                              <label key={std._id}>
                                <input
                                  type="checkbox"
                                  checked={studentIds.includes(std._id)}
                                  onChange={(e) => handleStudentSelect(std._id, e.target.checked)}
                                  className="w-4 h-4 cursor-pointer "
                                />
                                <span className="pl-2 cursor-pointer ">{std.firstName} {std.lastName}</span>
                              </label>

                              <p>{std?.Q_Id}</p>
                            </div>
                          ))

                        }

                      </div></> : null
                  }
                </>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarClassSelection;
