import React from "react";
import { useTranslation } from "react-i18next";

const TopicTitleInput = ({ value, onChange }) => {
  const { t } = useTranslation('admAccounts');

  return (
    <div className="flex flex-col w-full md:w-7/10">
      <label htmlFor="topicTitle" className="text-gray-500 mb-1">
        {t("Topic Title")}
      </label>
      <input
        id="topicTitle"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={t("Monthly examination")}
        className="p-2 border border-gray-300 rounded w-full"
      />
    </div>
  );
};

export default TopicTitleInput;
