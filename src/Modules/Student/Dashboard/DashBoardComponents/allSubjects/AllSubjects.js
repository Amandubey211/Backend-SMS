import React from "react";
import { GoAlertFill } from "react-icons/go";
import subjectIcon from '../../../../../Assets/DashboardAssets/subject.webp'
const AllSubjects = ({ subjects }) => {
  // Colors to cycle through for the progress bars
  const progressBarColors = [
    "#FF7AA5",
    "#5278FF",
    "#FBB778",
    "#33C4FE",
    "#FF7AA5",
  ];

  return (
    <div className="px-1">
      <div className="mt-1">
        {subjects && subjects.length > 0 ? (
          <div className="mt-4">
            {subjects.slice(0, 2)?.map((subject, index) => {
              const progressBarColor =
                progressBarColors[index % progressBarColors.length];
              return (
                <div
                  key={subject._id}
                  className="subject-card mb-1 p-4 shadow-md rounded-lg"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0px 8px 15px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0px 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={subjectIcon||
                        "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
                      }
                      alt={"subject"}
                      className="w-16 h-16 rounded mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {subject?.subjectName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Started: {subject?.started?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${subject?.percentageValue}%`,
                        backgroundColor: progressBarColor,
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{`${subject?.completedModule}/${subject?.totalModule} Modules`}</span>
                    <span>{`${subject?.percentageValue}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-2xl mt-4 mb-8">
            <GoAlertFill className="text-[4rem]" />
            <span className="mt-2 text-xl font-semibold text-center">
              No Data Found
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubjects;
