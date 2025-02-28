import React from "react";
import { useTranslation } from "react-i18next";
import { MdAccessTime } from "react-icons/md";
import { gt } from "../../../../Utils/translator/translation";

const StudentDashFeeCard = ({ title, amount, buttonText, buttonAction }) => {
  const { t } = useTranslation();
  return (
    <div className="px-7 py-5 flex flex-1 flex-col justify-around items-center gap-2">
      <div className="border border-black flex items-center justify-center p-1.5 rounded-full">
        <MdAccessTime className="text-2xl text-red-400" />
      </div>
      <span className="text-sm">{t(title, gt.stdFinance)}</span>
      <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 inline-block text-transparent bg-clip-text">
        {amount}
      </span>
      {buttonText && (
        <button
          onClick={buttonAction}
          className="flex items-center border bg-gradient-to-r from-pink-500 to-purple-500 w-full justify-center rounded-full"
        >
          <span className="text-white m-1 ">
            {t(buttonText, gt.stdFinance)}
          </span>
        </button>
      )}
    </div>
  );
};

export default StudentDashFeeCard;
