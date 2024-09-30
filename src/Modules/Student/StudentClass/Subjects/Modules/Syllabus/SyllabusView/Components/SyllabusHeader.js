import React from "react";
import { gt } from "../../../../../../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";

const SyllabusHeader = () => {
  const {t}=useTranslation();
  return (
    <div className="flex items-center justify-between ps-4">
      <h1 className="text-lg font-semibold">{t("Subject Syllabus",gt.stdSyllabus)}</h1>
    </div>
  );
};

export default SyllabusHeader;
