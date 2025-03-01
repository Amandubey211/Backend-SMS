import React from "react";
const data= {
  teachers: [
    { name: "Alice Johnson", profile: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Bob Smith", profile: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Charlie Brown", profile: "https://randomuser.me/api/portraits/men/46.jpg" },
    { name: "David Williams", profile: "https://randomuser.me/api/portraits/men/47.jpg" },
    { name: "David Williams", profile: "https://randomuser.me/api/portraits/men/47.jpg" },
    { name: "David Williams", profile: "https://randomuser.me/api/portraits/men/47.jpg" },
  ]
};

const TeacherDisplay = () => {
  if (!data?.teachers || data?.teachers?.length === 0) {
    return (
      <div className="ml-3">
        <p className="text-white font-semibold">No teacher assigned</p>
        <p className="text-white text-sm">Teacher</p>
      </div>
    );
  }

  const visibleTeachers = data.teachers.slice(0, 3);
  const remainingCount = data.teachers.length - visibleTeachers.length;

  // Function to truncate text and show tooltip
  const truncateText = (text, length = 10) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="ml-3 flex items-center">
      <div className="flex -space-x-3"> {/* ✅ Overlapping images */}
        {visibleTeachers.map((teacher, index) => (
          <img
            key={index}
            src={teacher.profile || "default-profile-image.jpg"}
            alt={teacher.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
            title={teacher.name} // Tooltip on hover
          />
        ))}
        {remainingCount > 0 && (
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 text-white border-2 border-white text-sm font-medium"
            title={`+${remainingCount} more`}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      {/* ✅ Show teacher’s name (truncated with tooltip) if only one, otherwise show teacher count */}
      <p
  className="text-white text-sm ml-3 bg-gray-600 px-2 py-1 rounded-lg max-w-[150px] truncate"
  title={data.teachers.length === 1 ? data.teachers[0].name : `${data.teachers.length} Teachers`}
>
  {data.teachers.length === 1
    ? truncateText(data.teachers[0].name, 15)
    : `${data.teachers.length} Teachers`}
</p>

    </div>
  );
};

export default TeacherDisplay;
