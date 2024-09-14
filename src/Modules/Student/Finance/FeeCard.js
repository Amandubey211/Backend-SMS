import React from "react";
import { MdAccessTime } from "react-icons/md";
import { gt } from "../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";

const FeeCard = ({ title, amount, buttonText, buttonAction }) => {
  const { t } = useTranslation();
  return (

    <div className="px-7 py-2 flex flex-1 flex-col justify-around items-center gap-3 border border-gray-300 rounded-lg">
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
          className="flex items-center border border-blue-800 w-full justify-center px-5 rounded-full"
        >
          <span className="text-blue-800 m-1 ">{t(buttonText, gt.stdFinance)}</span>
        </button>
      )}
    </div>
  );
};

export default FeeCard;
