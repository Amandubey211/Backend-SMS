import React from "react";
import { useTranslation } from "react-i18next";

const AddQuestionButton = ({ addNewQuestion }) => {
  const { t } = useTranslation('admModule');

  return (
    <div className="flex justify-end items-center px-5 gap-3 mt-3">
      <button
        className="bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200                
            rounded-md py-2 px-4 text-center transition"
      >
        <span className="text-gradient">{t("Reset")}</span>
      </button>
      <button
        onClick={addNewQuestion}
        className="px-6 py-2 text-white font-semibold rounded-md bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 transition"
      >
        {t("Submit Question")}
      </button>
    </div>
  );
};

export default AddQuestionButton;
