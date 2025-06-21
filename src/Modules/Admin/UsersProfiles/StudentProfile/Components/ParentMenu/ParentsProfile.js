import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";
import profileIcon from "../../../../../../Assets/DashboardAssets/profileIcon.png";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const ParentsProfile = ({ student }) => {
  const { t } = useTranslation("admAccounts");

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-500">{t("Loading...")}</div>
      </div>
    );
  }

  const address = `${student?.permanentAddress?.streetName || ""}, ${
    student?.permanentAddress?.city || ""
  }, ${student?.permanentAddress?.country || ""}`;

  return (
    <ProtectedSection
      requiredPermission={PERMISSIONS.GET_STUDENT_INFO}
      title={t("Parent Profile")}
    >
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Father Info */}
        <ParentProfileBlock
          title={t("Father Details")}
          imageSrc={student?.fatherInfo?.photo || profileIcon}
          name={
            student?.fatherName ||
            `${student?.fatherInfo?.firstName || ""} ${
              student?.fatherInfo?.lastName || ""
            }`
          }
          details={[
            {
              type: "phone",
              label: t("Primary Contact"),
              value: student?.fatherInfo?.cell1?.value || "",
            },
            {
              type: "phone",
              label: t("Secondary Contact"),
              value: student?.fatherInfo?.cell2?.value || "",
            },
            {
              type: "primaryEmail",
              label: t("Primary Email"),
              value: student?.fatherInfo?.email1 || "",
            },
            {
              type: "secondaryEmail",
              label: t("Secondary Email"),
              value: student?.fatherInfo?.email2 || "",
            },
            {
              type: "idNumber",
              label: t("ID Number"),
              value: student?.fatherInfo?.idNumber || "",
            },
            {
              type: "idExpiry",
              label: t("ID Expiry"),
              value: student?.fatherInfo?.idExpiry || "",
            },
            { type: "address", label: t("Address"), value: address },

            {
              type: "nationality",
              label: t("Nationality"),
              value: student?.fatherInfo?.nationality || "",
            },
            {
              type: "religion",
              label: t("Religion"),
              value: student?.fatherInfo?.religion || "",
            },
            {
              type: "company",
              label: t("Company"),
              value: student?.fatherInfo?.company || "",
            },
            {
              type: "jobTitle",
              label: t("Job Title"),
              value: student?.fatherInfo?.jobTitle || "",
            },
          ]}
          accentColor="from-blue-500 to-indigo-600"
        />

        {/* Mother Info */}
        <ParentProfileBlock
          title={t("Mother Details")}
          imageSrc={student?.motherInfo?.photo || profileIcon}
          name={
            student?.motherName ||
            `${student?.motherInfo?.firstName || ""} ${
              student?.motherInfo?.lastName || ""
            }`
          }
          details={[
            {
              type: "phone",
              label: t("Primary Contact"),
              value: student?.motherInfo?.cell1?.value || "",
            },
            {
              type: "phone",
              label: t("Secondary Contact"),
              value: student?.motherInfo?.cell2?.value || "",
            },
            {
              type: "primaryEmail",
              label: t("Primary Email"),
              value: student?.motherInfo?.email1 || "",
            },
            {
              type: "secondaryEmail",
              label: t("Secondary Email"),
              value: student?.motherInfo?.email2 || "",
            },
            {
              type: "idNumber",
              label: t("ID Number"),
              value: student?.motherInfo?.idNumber || "",
            },
            {
              type: "idExpiry",
              label: t("ID Expiry"),
              value: student?.motherInfo?.idExpiry || "",
            },
            { type: "address", label: t("Address"), value: address },

            {
              type: "nationality",
              label: t("Nationality"),
              value: student?.motherInfo?.nationality || "",
            },
            {
              type: "religion",
              label: t("Religion"),
              value: student?.motherInfo?.religion || "",
            },
            {
              type: "company",
              label: t("Company"),
              value: student?.motherInfo?.company || "",
            },
            {
              type: "jobTitle",
              label: t("Job Title"),
              value: student?.motherInfo?.jobTitle || "",
            },
          ]}
          accentColor="from-pink-500 to-rose-500"
        />

        {/* Guardian Info */}
        <ParentProfileBlock
          title={t("Guardian Details")}
          imageSrc={student?.guardianProfile || profileIcon}
          name={student?.guardianName || ""}
          details={[
            {
              type: "phone",
              label: t("Contact Number"),
              value: student?.guardianContactNumber || "",
            },
            {
              type: "email",
              label: t("Email"),
              value: student?.guardianEmail || "",
            },
            {
              type: "guardianRelationToStudent",
              label: t("Relation to Student"),
              value: student?.guardianRelationToStudent || "",
            },
          ]}
          accentColor="from-emerald-500 to-teal-600"
        />
      </div>
    </ProtectedSection>
  );
};

export default ParentsProfile;
