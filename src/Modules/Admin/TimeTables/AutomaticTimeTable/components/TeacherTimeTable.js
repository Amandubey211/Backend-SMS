import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty } from "antd";
import { fetchTimeTablesForTeacher } from "../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk";

const TeacherTimeTable = ({ selectedTeacher }) => {
  const dispatch = useDispatch();
  const { loading, ascTeacherTimeTable } = useSelector(
    (state) => state?.admin?.ascTimeTable
  );

  useEffect(() => {
    if (selectedTeacher) {
      dispatch(
        fetchTimeTablesForTeacher({
          teacherId: selectedTeacher,
        })
      );
    }
  }, [dispatch, selectedTeacher]);

  // Flatten all subjectsTiming from all timetable entries
  const allSubjectsTiming = ascTeacherTimeTable
    ? Array.isArray(ascTeacherTimeTable)
      ? ascTeacherTimeTable.flatMap(timetable => 
          Array.isArray(timetable?.subjectsTiming) 
            ? timetable.subjectsTiming 
            : []
        )
      : Array.isArray(ascTeacherTimeTable?.subjectsTiming)
        ? ascTeacherTimeTable.subjectsTiming
        : []
    : [];

  // Extract unique class-section combinations
  const uniqueClassesSections = Array.from(
    new Set(
      allSubjectsTiming
        .filter(item => item?.class && item?.section)
        .map(item => `${item.class}::${item.section}`)
    )
  );

  // Extract unique days from all entries
  const uniqueDays = Array.from(
    new Set(
      allSubjectsTiming
        .flatMap(item => item?.days || [])
        .filter(day => day && typeof day === 'string')
    )
  ).sort(); // Sort days for consistent order

  // Create dataSource for the table
  const dataSource = uniqueClassesSections.map((clsSection) => {
    const [className, sectionName] = clsSection.split("::");
    const row = { key: clsSection, classSection: `${className} ${sectionName}` };

    uniqueDays.forEach((day) => {
      // Find all subjects for this class-section on this day
      const daySubjects = allSubjectsTiming
        .filter(
          item =>
            item?.class === className &&
            item?.section === sectionName &&
            item?.days?.includes(day)
        );

      // Sort subjects by start time
      daySubjects.sort((a, b) => {
        const timeA = a.timing?.startTime || "00:00";
        const timeB = b.timing?.startTime || "00:00";
        return timeA.localeCompare(timeB);
      });

      // Format subjects with their time slots
      row[day] = daySubjects.length > 0
        ? daySubjects.map((subject, idx) => (
            <div key={idx} className="flex flex-col justify-center items-center">
              <span>{subject.subjectName || 'No Subject'}</span> 
              <span>(
              {subject.timing?.startTime || '??'}-{subject.timing?.endTime || '??'}
              )</span>
            </div>
          ))
        : "-";
    });

    return row;
  });

  // Define columns
  const columns = [
    {
      title: "Class & Section",
      dataIndex: "classSection",
      key: "classSection",
      fixed: "left",
      width: 150,
    },
    ...uniqueDays.map((day) => ({
      title: day.charAt(0).toUpperCase() + day.slice(1),
      dataIndex: day,
      key: day,
      render: (content) => content, // Render JSX content directly
    })),
  ];

  const teacherName = allSubjectsTiming[0]?.teacherId?.fullName 
    || ascTeacherTimeTable?.teacherId?.fullName 
    || "Teacher";

  return (
    <div className="p-4">
      <p className="text-lg font-bold mb-4">
        {teacherName}'s TimeTable
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading timetable...</p>
        </div>
      ) : dataSource.length === 0 ? (
        <div className="flex items-center justify-center w-full h-64">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-600">
                No timetable available for selected teacher
              </span>
            }
          />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          className="mt-2 shadow-sm"
        />
      )}
    </div>
  );
};

export default TeacherTimeTable;