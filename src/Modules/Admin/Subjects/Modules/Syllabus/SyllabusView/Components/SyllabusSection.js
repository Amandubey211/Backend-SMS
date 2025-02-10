import React from "react";
import { useTranslation } from "react-i18next";

const SyllabusSection = ({ title, content }) => {
  const { t } = useTranslation("admModule");

  return (
    <div className="p-5 mb-6 mt-5 ">
      {title && content ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
          <div
            className="text-gray-700 leading-8 text-justify"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <p className="text-gray-500 mt-4">{t("No syllabus data available.")}</p>
      )}
    </div>
  );
};

export default SyllabusSection;
