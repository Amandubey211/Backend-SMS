import React from "react";
import { GoAlertFill } from "react-icons/go";

const AllSubjects = ({ subjects }) => {
  // Colors to cycle through for the progress bars
  const progressBarColors = ["#FF7AA5", "#5278FF", "#FBB778", "#33C4FE", "#FF7AA5"];

  return (
    <div className="px-1">
      <div className="mt-4">
        {subjects && subjects.length > 0 ? (
          <div className="mt-4">
            {subjects.slice(0, 5).map((subject, index) => {
              // Extract values from subject data
              const subjectName = subject?.name || "Unnamed Subject";
              const thumbnail =
                (subject.modules && subject.modules[0]?.thumbnail) ||
                "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp" || 
                "https://via.placeholder.com/150";
              const totalModules = subject?.modules?.length || 0;

              // Calculate completed modules and progress based on API data
              const completedModules = subject?.modules?.reduce((acc, module) => {
                // We consider a module "completed" if it has chapters
                return acc + (module?.chapters && module?.chapters.length > 0 ? 1 : 0);
              }, 0) || 0;

              // Calculate progress percentage dynamically
              const progress =
                totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

              // Select progress bar color in a loop based on the index
              const progressBarColor = progressBarColors[index % progressBarColors.length];

              return (
                <div
                  key={subject._id}
                  className="subject-card mb-4 p-4 shadow-md rounded-lg"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={thumbnail}
                      alt={subjectName}
                      className="w-16 h-16 rounded mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">{subjectName}</h3>
                      <p className="text-sm text-gray-500">Started: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressBarColor,
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{`${completedModules}/${totalModules} Modules`}</span>
                    <span>{`${progress}%`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full h-full text-gray-500 items-center justify-center flex-col text-2xl mt-4 mb-8">
            <GoAlertFill className="text-[4rem]" />
            <span className="mt-2 text-xl font-semibold text-center">No Data Found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSubjects;
