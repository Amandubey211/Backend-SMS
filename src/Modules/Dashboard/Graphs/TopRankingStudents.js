import React from "react";
import TopRanker from "../../../Assets/DashboardAssets/Aman dubey.png";

const TopRankingStudents = () => {
  const topStudents = [
    {
      id: 1,
      name: "Theresa Webb",
      roll: 210,
      marks: 490,
      img: TopRanker,
      rank: 1,
      crown: true,
    },
    {
      id: 2,
      name: "Guy Hawkins",
      roll: 115,
      marks: 480,
      img: TopRanker,
      rank: 2,
    },
    {
      id: 3,
      name: "Guy Hawkins",
      roll: 115,
      marks: 479,
      img: TopRanker,
      rank: 3,
    },
    {
      id: 4,
      name: "Guy Hawkins",
      roll: 29,
      marks: 479,
      img: TopRanker,
      rank: 4,
    },
    {
      id: 5,
      name: "Guy Hawkins",
      roll: 29,
      marks: 479,
      img: TopRanker,
      rank: 5,
    },
    {
      id: 6,
      name: "Theresa Webb",
      roll: 29,
      marks: 479,
      img: TopRanker,
      rank: 6,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-4 rounded-lg ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Top Ranking Students</h2>
        <div className="relative">
          <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option>Class: 5</option>
            {/* Add other class options here */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {topStudents.slice(0, 3).map((student, index) => (
          <div key={index} className="text-center p-4 border rounded-lg">
            <div className="mb-2">
              <img
                className="w-16 h-16 rounded-full mx-auto"
                src={student.img}
                alt={student.name}
              />
            </div>
            <h3 className="text-lg font-medium">
              {index === 0 ? "Top 1" : `Top ${index + 2}`}
            </h3>
            <p>{student.name}</p>
            <p>Roll: {student.roll}</p>
            <span
              style={{
                background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
              }}
              className="px-2 rounded-sm"
            >
              <span
                style={{
                  background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Marks: {student.marks}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div>
        {topStudents.slice(3).map((student, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-t"
          >
            <span>{student.rank}</span>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src={student.img}
                alt={student.name}
              />
              <span>{student.name}</span>
            </div>
            <div
              className="rounded-sm"
              style={{
                background: "linear-gradient(to right, #fce7f3, #e9d5ff)",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(to right, #f43f5e, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="px-3"
              >
                Marks: {student.marks}
              </span>
            </div>

            <span>Roll: {student.roll}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRankingStudents;
