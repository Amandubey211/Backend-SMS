import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { fetchTimeTablesForTeacher } from "../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk";

const TeacherTimeTable = ({ selectedTeacher }) => {
  const dispatch = useDispatch();
  const { loading, ascTeacherTimeTable, error } = useSelector(
    (state) => state?.admin?.ascTimeTable
  );

  // Dummy data for demonstration
  const mockAscTeacherTimeTable = {
    schoolId: "67b425757192bddd9b23b95b",
    teacherId: "64c3a123e456ddefa8912345",
    subjectsTiming: [
      {
        subjectId: "64d6cba4a12345c8e6789a01",
        subjectName: "Mathematics",
        class: "10th",
        section: "A",
        timing: { startTime: "9:00 AM", endTime: "10:00 AM" },
      },
      {
        subjectId: "64d6cba4a12345c8e6789a02",
        subjectName: "Physics",
        class: "11th",
        section: "B",
        timing: { startTime: "10:15 AM", endTime: "11:15 AM" },
      },
      {
        subjectId: "64d6cba4a12345c8e6789a03",
        subjectName: "Chemistry",
        class: "12th",
        section: "A",
        timing: { startTime: "11:30 AM", endTime: "12:30 PM" },
      },
    ],
    academicYear: "64d6cba4a12345c8e6789a04",
  };

  // Use fetched data or mock data
  const timetable = mockAscTeacherTimeTable;

  useEffect(() => {
    dispatch(
      fetchTimeTablesForTeacher({
        teacherId: selectedTeacher,
      })
    );
  }, [dispatch, selectedTeacher]);

  // Prepare data for Ant Design Table
  const timings = Array.from(
    new Set(timetable?.subjectsTiming.map((item) => item.timing.startTime + " - " + item.timing.endTime))
  );

  const classesSections = Array.from(
    new Set(timetable?.subjectsTiming.map((item) => `${item.class} ${item.section}`))
  );

  const dataSource = timings.map((time) => {
    const row = { key: time, timing: time };

    classesSections.forEach((clsSection) => {
      const [className, sectionName] = clsSection.split(" ");
      const subject = timetable.subjectsTiming.find(
        (item) =>
          `${item.class} ${item.section}` === clsSection &&
          `${item.timing.startTime} - ${item.timing.endTime}` === time
      );
      row[clsSection] = subject ? subject.subjectName : "-";
    });

    return row;
  });

  const columns = [
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
      fixed: "left",
    },
    ...classesSections.map((clsSection) => ({
      title: clsSection,
      dataIndex: clsSection,
      key: clsSection,
    })),
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Teacher Timetable</h1>
      <p className="text-lg">Teacher ID: {selectedTeacher}</p>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
        className="mt-4"
      />
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
};

export default TeacherTimeTable;
