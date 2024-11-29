// src/components/Components/AddNewCriteriaForm.js

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRubricField } from "../../../../../../Store/Slices/Admin/Class/Rubric/rubricSlice";
import { useTranslation } from "react-i18next";

const AddNewCriteriaForm = ({ editMode }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("admModule");

  const { criteria, criteriaToEdit } = useSelector(
    (state) => state.admin.rubrics
  );
  const [criteriaData, setCriteriaData] = useState({
    title: "",
    description: "",
    ratings: [],
  });

  const formRef = useRef(null);

  useEffect(() => {
    if (criteriaToEdit) {
      setCriteriaData(criteriaToEdit);
    }
  }, [criteriaToEdit]);

  const handleAddCriteria = () => {
    const newCriteria = { ...criteriaData };

    const updatedCriteria = editMode
      ? criteria?.map((crit, index) =>
          index === criteriaToEdit.index ? newCriteria : crit
        )
      : [...criteria, newCriteria];
    dispatch(setRubricField({ field: "criteria", value: updatedCriteria }));
    dispatch(setRubricField({ field: "isSidebarOpen", value: false }));
    dispatch(setRubricField({ field: "editMode", value: false }));
    dispatch(setRubricField({ field: "criteriaToEdit", value: null }));
    setCriteriaData({ title: "", description: "", ratings: [] });
  };

  return (
    <div className="flex flex-col z-50 h-full p-4" ref={formRef}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t("Criteria Title")}
        </label>
        <input
          type="text"
          value={criteriaData.title}
          onChange={(e) =>
            setCriteriaData({ ...criteriaData, title: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={t("Type here")}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t("Description")}
        </label>
        <textarea
          value={criteriaData.description}
          onChange={(e) =>
            setCriteriaData({ ...criteriaData, description: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder={t("Type here")}
        />
      </div>

      <div className="mt-auto mb-6">
        <button
          onClick={handleAddCriteria}
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {editMode ? t("Update Criteria") : t("Add Criteria")}
        </button>
      </div>
    </div>
  );
};

export default AddNewCriteriaForm;
