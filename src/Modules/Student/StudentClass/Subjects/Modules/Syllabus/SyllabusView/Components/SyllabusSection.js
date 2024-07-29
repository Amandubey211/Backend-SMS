// SyllabusSection.js
import React from "react";

const SyllabusSection = ({ syllabus }) => {
  const { title, content } = syllabus;
  
  return (
    <div className="p-3 bg-white mb-6">
      {title && content ? (
        <>
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div
            className="text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <p className="text-gray-500 mt-4">No syllabus data available.</p>
      )}
    </div>
  );
};

export default SyllabusSection;
