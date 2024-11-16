import React from "react";
import InformationItem from "./InformationItem";
import { MdOutlinePerson, MdPhone, MdEmail, MdOutlineLocationOn } from "react-icons/md";
import { useTranslation } from "react-i18next";

const ParentInformation = ({ parents }) => {
  const { t } = useTranslation('admAccounts');

  return (
    <div className="w-[40%] border-r border-gray-300 p-2">
      <h2 className="text-base font-semibold text-gray-600">
        {t("Parents Information")}
      </h2>
      <InformationItem
        icon={MdOutlinePerson}
        title={t("Father Name")}
        value={parents?.guardianName}
      />
      <InformationItem
        icon={MdOutlinePerson}
        title={t("Mother Name")}
        value={parents?.motherName}
      />
      <InformationItem
        icon={MdPhone}
        title={t("Phone")}
        value={parents?.guardianContactNumber}
      />
      <InformationItem
        icon={MdEmail}
        title={t("Email")}
        value={parents?.guardianEmail}
      />
      <InformationItem
        icon={MdOutlineLocationOn}
        title={t("Address")}
        value={`${parents?.permanentAddress?.country || '-'}, ${parents?.permanentAddress?.city || ''
          }, ${parents?.permanentAddress?.street || ''}`}
      />
    </div>
  );
};

export default ParentInformation;
