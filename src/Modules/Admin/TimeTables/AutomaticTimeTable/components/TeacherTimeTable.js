import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { fetchTimeTablesForTeacher } from "../../../../../Store/Slices/Admin/asctimetable/asctimetablethunk";

const TeacherTimeTable = ({ selectedTeacher }) => {
  const dispatch = useDispatch();
  const { loading, ascTeacherTimeTable, error } = useSelector(
    (state) => state?.admin?.ascTimeTable
  );

  useEffect(() => {
    dispatch(
      fetchTimeTablesForTeacher({
        teacherId: selectedTeacher,
      })
    );
  }, [dispatch, selectedTeacher]);

  // Extract data from API response
  const timetable = ascTeacherTimeTable || {};
  const teacher = timetable.teacherId || {};
  const subjectsTiming = timetable.subjectsTiming || [];

  const timings = Array.from(
    new Set(
      subjectsTiming.map(
        (item) => `${item.timing.startTime} - ${item.timing.endTime}`
      )
    )
  );

  const classesSections = Array.from(
    new Set(
      subjectsTiming.map((item) => `${item.class} ${item.section}`)
    )
  );

  const dataSource = timings?.map((time) => {
    const row = { key: time, timing: time };

    classesSections.forEach((clsSection) => {
      const [className, sectionName] = clsSection.split(" ");
      const subject = subjectsTiming.find(
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
      
      <p className="text-lg font">
        {teacher?.fullName ? teacher?.fullName +`'s TimeTable` || "N/A" : ''}
      </p>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        bordered
        pagination={false}
        scroll={{ x: "max-content" }}
        className="mt-4"
      />
    </div>
  );
};

export default TeacherTimeTable;
