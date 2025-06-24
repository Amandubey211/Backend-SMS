import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Empty, Spin, Badge } from "antd";
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

  const allSubjectsTiming = ascTeacherTimeTable
    ? Array.isArray(ascTeacherTimeTable)
      ? ascTeacherTimeTable.flatMap((timetable) =>
          Array.isArray(timetable?.subjectsTiming)
            ? timetable.subjectsTiming
            : []
        )
      : Array.isArray(ascTeacherTimeTable?.subjectsTiming)
      ? ascTeacherTimeTable.subjectsTiming
      : []
    : [];

  const uniqueClassesSections = Array.from(
    new Set(
      allSubjectsTiming
        .filter((item) => item?.class && item?.section)
        .map((item) => `${item.class}::${item.section}`)
    )
  );

  // Define the correct day order
  const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Get unique days and sort them according to dayOrder
  const uniqueDays = Array.from(
    new Set(
      allSubjectsTiming
        .flatMap((item) => item?.days || [])
        .filter((day) => day && typeof day === "string")
        .map(day => day.toLowerCase()) // Normalize to lowercase
    )
  ).sort((a, b) => {
    const indexA = dayOrder.indexOf(a);
    const indexB = dayOrder.indexOf(b);
    
    // Handle days not in the predefined order
    if (indexA === -1) return 1; // Push unknown days to end
    if (indexB === -1) return -1; 
    
    return indexA - indexB;
  });

  const dataSource = uniqueClassesSections.map((clsSection) => {
    const [className, sectionName] = clsSection.split("::");
    const row = { key: clsSection, classSection: `${className} ${sectionName}` };

    uniqueDays.forEach((day) => {
      const daySubjects = allSubjectsTiming
        .filter(
          (item) =>
            item?.class === className &&
            item?.section === sectionName &&
            item?.days?.some(d => d.toLowerCase() === day) // Case-insensitive match
        )
        .sort((a, b) => {
          const timeA = a.timing?.startTime || "00:00";
          const timeB = b.timing?.startTime || "00:00";
          return timeA.localeCompare(timeB);
        });

      row[day] = daySubjects.length > 0
        ? daySubjects.map((subject, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-md p-2 my-1 shadow-sm"
            >
              <Badge
                count={subject.subjectName || "No Subject"}
                style={{ backgroundColor: "#673ab7", borderRadius: '6px' }}
              />
              <span className="text-sm text-gray-600 mt-1">
                {subject.timing?.startTime || "??"} -{" "}
                {subject.timing?.endTime || "??"}
              </span>
            </div>
          ))
        : "-";
    });

    return row;
  });

  const columns = [
    {
      title: "Class & Section",
      dataIndex: "classSection",
      key: "classSection",
      fixed: "left",
      width: 180,
      render: (text) => (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-center py-2 px-3 rounded-md shadow">
          {text}
        </div>
      ),
    },
    ...uniqueDays.map((day) => ({
      title: (
        <div className="flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2 px-3 rounded-md">
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </div>
      ),
      dataIndex: day,
      key: day,
      render: (content) => <div className="space-y-2">{content}</div>,
    })),
  ];

  const teacherName =
    allSubjectsTiming[0]?.teacherId?.fullName ||
    ascTeacherTimeTable?.teacherId?.fullName ||
    "Teacher";

  return (
    <div className="rounded-md shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : dataSource.length === 0 ? (
        <div className="flex items-center justify-center w-full h-64">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-600">
                No timetable available 
              </span>
            }
          />
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 rounded-t-md">
            <h1 className="text-2xl font-semibold">{teacherName}'s Timetable</h1>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            scroll={{ x: "max-content" }}
            className="mt-4 bg-white rounded-b-md shadow-md"
          />
        </>
      )}
    </div>
  );
};

export default TeacherTimeTable;