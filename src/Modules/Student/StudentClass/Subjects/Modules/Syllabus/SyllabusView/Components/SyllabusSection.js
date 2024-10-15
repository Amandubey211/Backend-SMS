// SyllabusSection.js
import React from "react";
import { useTranslation } from "react-i18next";
import { gt } from "../../../../../../../../Utils/translator/translation";

const SyllabusSection = ({ syllabus }) => {
  const { title, content } = syllabus;
  const {t}=useTranslation();
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
        <p className="text-gray-500 mt-4">{t("No syllabus data available",gt.stdSyllabus)}</p>
      )}
    </div>
  );
};

export default SyllabusSection;
