import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";


const SchoolTimeTable = () => {
  // Dummy data for classes, sections, and their schedules
  const schoolName = "Bright Future Academy";
  const timetableData = [
    {
      className: "Class 1",
      sections: [
        {
          name: "A",
          schedule: {
            "9:00 AM - 9:45 AM": { subject: "Math", teacher: "Mr. Smith" },
            "9:45 AM - 10:30 AM": { subject: "English", teacher: "Ms. Johnson" },
          },
        },
        {
          name: "B",
          schedule: {
            "9:00 AM - 9:45 AM": { subject: "Science", teacher: "Mr. Brown" },
            "9:45 AM - 10:30 AM": { subject: "History", teacher: "Mrs. Davis" },
          },
        },
      ],
    },
    {
      className: "Class 2",
      sections: [
        {
          name: "A",
          schedule: {
            "10:00 AM - 10:45 AM": { subject: "Geography", teacher: "Mr. Lee" },
            "10:45 AM - 11:30 AM": { subject: "Computer Science", teacher: "Ms. Taylor" },
          },
        },
      ],
    },
  ];

  const allTimings = [
    "9:00 AM - 9:45 AM",
    "9:45 AM - 10:30 AM",
    "10:00 AM - 10:45 AM",
    "10:45 AM - 11:30 AM",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* School Name */}
      <h1 className="text-3xl font-bold text-center mb-6">{schoolName}</h1>

      {/* Timetable */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Section</th>
            {allTimings.map((time, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-center">
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timetableData.map((classData, classIndex) =>
            classData.sections.map((section, sectionIndex) => (
              <tr key={`${classIndex}-${sectionIndex}`} className="hover:bg-gray-50">
                {/* Class Name with merged rows */}
                {sectionIndex === 0 && (
                  <td
                    className="border border-gray-300 px-4 py-2 font-semibold"
                    rowSpan={classData.sections.length}
                  >
                    {classData.className}
                  </td>
                )}

                {/* Section Name */}
                <td className="border border-gray-300 px-4 py-2">{section.name}</td>

                {/* Timings */}
                {allTimings.map((time, index) => (
                  <td
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {section.schedule[time] ? (
                      <>
                        <div className="font-semibold">{section.schedule[time].subject}</div>
                        <div className="text-sm text-gray-500">
                          {section.schedule[time].teacher}
                        </div>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolTimeTable;

