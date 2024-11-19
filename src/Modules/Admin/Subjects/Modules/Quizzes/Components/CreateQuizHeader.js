import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateQuizHeader = ({ activePage }) => {
  const { t } = useTranslation('admModule');
  const { sid, cid } = useParams();
  
  return (
    <div className="flex justify-between p-4 items-center border-b">
      <h1 className="text-lg">
        {activePage === "instructions" ? t("All Quizzes") : t("Best Of Luck👍")}
      </h1>
      <NavLink
        to={`/class/${cid}/${sid}/create_quiz`}
        className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-md shadow"
      >
        + {t("Add New Quiz")}
      </NavLink>
    </div>
  );
};

export default CreateQuizHeader;
