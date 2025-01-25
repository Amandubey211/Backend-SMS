// src/components/Components/RubricHeader.js

import React from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";

const RubricHeader = ({ onAddRubric }) => {
  const { t } = useTranslation("admModule");

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg font-semibold">{t("Rubrics")}</h1>
      <ProtectedAction requiredPermission="Add Rubric">
        <button
          onClick={onAddRubric}
          className="flex items-center gap-2 font-semibold p-2 rounded-md bg-gradient-to-r from-pink-100 to-purple-100 hover:shadow-md transition-shadow duration-300"
        >
          <HiOutlinePlus className="text-red-600 text-2xl" />
          <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
            {t("Add New Rubric")}
          </span>
        </button>
      </ProtectedAction>
    </div>
  );
};

export default RubricHeader;
