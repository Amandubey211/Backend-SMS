import React from "react";
import InformationItem from "./InformationItem";
import { MdOutlineLocationOn, MdMale, MdTempleHindu, MdEmail, MdBloodtype, MdCake, MdPhone } from "react-icons/md";
import { useTranslation } from "react-i18next";

const InformationSection = ({ student }) => {
  const { t } = useTranslation('admAccounts');

  return (
    <div className="flex flex-col h-full w-full p-2 ">
      <h2 className="text-base font-semibold text-gray-600">
        {t("Student Information")}
      </h2>

      <div className="flex flex-row w-full">
        <div className="flex-1">
          <InformationItem
            icon={MdOutlineLocationOn}
            title={t("Address")}
            value={`${student?.residentialAddress?.street?.slice(0, 80)}`}
          />
          <InformationItem
            icon={MdMale}
            title={t("Gender")}
            value={student?.gender}
          />
          <InformationItem
            icon={MdTempleHindu}
            title={t("Religion")}
            value={student?.religion}
          />
        </div>
        <div className="flex-1">
          <InformationItem
            icon={MdEmail}
            title={t("Email")}
            value={student?.email}
          />
          <InformationItem
            icon={MdBloodtype}
            title={t("Blood Group")}
            value="O+"
          />
        </div>
        <div className="flex-1">
          <InformationItem
            icon={MdPhone}
            title={t("Phone")}
            value={student?.contactNumber}
          />
          <InformationItem
            icon={MdCake}
            title={t("Birthday")}
            value="25th July, 2008"
          />
        </div>
      </div>
    </div>
  );
};

export default InformationSection;
