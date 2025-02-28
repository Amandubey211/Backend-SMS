import React from "react";

const TeacherDisplay = ({ data }) => {
  // Dummy teacher data for testing

  const visibleTeachers = data.teachers.slice(0, 3);
  const remainingCount = data.teachers.length - visibleTeachers.length;

  if (data?.teachers && data.teachers.length > 0) {
    return (
      <div className="ml-3 flex items-center">
        {data?.teachers?.map((teacher, index) => (
          <img
            key={index}
            src={teacher.profile || "default-profile-image.jpg"}
            alt={teacher.name}
            className="w-8 h-8 rounded-full object-cover -ml-2 first:ml-0"
          />
        ))}
        <p className="text-white text-sm ml-2">Teachers</p>
      </div>
    );
  } else if (data.teachers.length > 0) {
    //   Check dummy data if original is empty
    return (
      <div className="flex items-center ml-3">
        <div className="flex">
          {visibleTeachers.map((teacher, index) => (
            <img
              key={index}
              src={teacher.profile || "default-profile-image.jpg"}
              alt={teacher.name}
              className={`w-8 h-8 rounded-full object-cover border-2 border-white shadow-md 
                        -ml-4 first:ml-0`}
            />
          ))}
          {remainingCount > 0 && (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 text-white border-2 border-white text-sm font-medium -ml-4">
              +{remainingCount}
            </div>
          )}
        </div>
        <p className="text-white text-sm ml-3">Teachers</p>
      </div>
    );
  } else {
    return (
      <div className="ml-3">
        <p className="text-white font-semibold">No teacher assigned</p>
        <p className="text-white text-sm">Teacher</p>
      </div>
    );
  }
};

export default TeacherDisplay;
