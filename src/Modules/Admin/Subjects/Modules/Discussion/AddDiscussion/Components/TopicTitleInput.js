import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TopicTitleInput = ({ value, onChange, error, inputRef }) => {
  const { t } = useTranslation("admAccounts");

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
        ref={inputRef}
        className={`p-2 border rounded w-full ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default TopicTitleInput;
