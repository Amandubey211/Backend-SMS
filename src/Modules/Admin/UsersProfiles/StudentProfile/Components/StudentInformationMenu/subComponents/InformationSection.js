import React from "react";
import InformationItem from "./InformationItem";
import {
  MdOutlineLocationOn, MdMale, MdTempleHindu, MdEmail, MdBloodtype, MdCake,
  MdPhone, MdPerson, MdCalendarToday, MdCardMembership, MdFlag,
  MdHeight, MdMonitorWeight, MdLanguage, MdEmergency, MdSchool, MdWc
} from "react-icons/md";
import { useTranslation } from "react-i18next";

const InformationSection = ({ student }) => {
  const { t } = useTranslation('admAccounts');

  // Define the fields to display, mapping them to their respective icons
  const fields = [
    { icon: MdPerson, title: t("First Name"), value: student?.firstName || "" },
    { icon: MdPerson, title: t("Last Name"), value: student?.lastName || "" },
    { icon: MdCake, title: t("Birthday"), value: student?.dateOfBirth || "" },
    { icon: MdCardMembership, title: t("Student ID"), value: student?.Q_Id || "" },
    { icon: MdCalendarToday, title: t("ID Expiry"), value: student?.idExpiry || "" },
    { icon: MdCardMembership, title: t("Passport Number"), value: student?.passportNumber || "" },
    { icon: MdCalendarToday, title: t("Passport Expiry"), value: student?.passportExpiry || "" },
    { icon: MdOutlineLocationOn, title: t("Place of Birth"), value: student?.placeOfBirth || "" },
    { icon: MdFlag, title: t("Nationality"), value: student?.nationality || "" },
    { icon: MdHeight, title: t("Height (cm)"), value: student?.height || "" },
    { icon: MdMonitorWeight, title: t("Weight (kg)"), value: student?.weight || "" },
    { icon: MdBloodtype, title: t("Blood Group"), value: student?.bloodGroup || "" },
    { icon: MdWc, title: t("Gender"), value: student?.gender || "" },
    { icon: MdTempleHindu, title: t("Religion"), value: student?.religion || "" },
    { icon: MdLanguage, title: t("Native Language"), value: student?.nativeLanguage || "" },
    { icon: MdEmail, title: t("Email"), value: student?.email || "" },
    { icon: MdPhone, title: t("Primary Contact"), value: student?.contactNumber || "" },
    { icon: MdEmergency, title: t("Emergency Contact"), value: student?.emergencyNumber || "" },
    { icon: MdOutlineLocationOn, title: t("Address"), value: `${student?.residentialAddress?.buildingNumber || ""}, ${student?.residentialAddress?.streetName || ""}, ${student?.residentialAddress?.city || ""}, ${student?.residentialAddress?.state || ""}, ${student?.residentialAddress?.country || ""}` },
  ];

  // Group fields into rows of 3
  const rows = [];
  for (let i = 0; i < fields.length; i += 3) {
    rows.push(fields.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h2 className="text-base font-semibold text-gray-600 mb-4">
        {t("Student Information")}
      </h2>

      <div className="grid gap-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {row.map((field, index) => (
              <InformationItem
                key={index}
                icon={field.icon}
                title={field.title}
                value={field.value}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformationSection;