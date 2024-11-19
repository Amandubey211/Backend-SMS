import React from "react";
import { useTranslation } from "react-i18next";

const SyllabusSection = ({ title, content }) => {
  const { t } = useTranslation('admModule');

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
        <p className="text-gray-500 mt-4">{t("No syllabus data available.")}</p>
      )}
    </div>
  );
};

export default SyllabusSection;
