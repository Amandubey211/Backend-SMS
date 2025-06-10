import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";
import profileIcon from '../../../../../../Assets/DashboardAssets/profileIcon.png';
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const ParentsProfile = ({ student }) => {
  // console.log("Student", student)
  const { t } = useTranslation('admAccounts');

  if (!student) {
    return <div>{t("Loading...")}</div>;
  }

  const address = `${student?.permanentAddress?.streetName}, ${student?.permanentAddress?.country}, ${student?.permanentAddress?.city}`;

  return (
    <ProtectedSection requiredPermission={PERMISSIONS.GET_STUDENT_INFO} title={"Parent Profile"}>
      <div className="flex flex-col h-screen p-4 gap-5">
        <ParentProfileBlock
          title={t("Father Details")}
          imageSrc={student?.fatherInfo?.photo || profileIcon}
          name={student?.fatherName || student?.fatherInfo?.firstName}
          details={[
            { type: 'phone', label: t('Primary Contact'), value: student?.fatherInfo?.cell1.value || "" },
            { type: 'phone', label: t('Secondary Contact'), value: student?.fatherInfo?.cell2.value || "" },
            { type: 'email', label: t('Primary Email'), value: student?.fatherInfo?.email1 || "" },
            { type: 'email', label: t('Secondary Email'), value: student?.fatherInfo?.email2 || "" },
            { type: 'address', label: t('Address'), value: address },
            { type: 'idExpiry', label: t('IdExpiry'), value: student?.fatherInfo?.idExpiry },
            { type: 'idNumber', label: t('IdNumber'), value: student?.fatherInfo?.idNumber },
            { type: 'jobTitle', label: t('JobTitle'), value: student?.fatherInfo?.jobTitle },
            { type: 'nationality', label: t('Nationality'), value: student?.fatherInfo?.nationality },
            { type: 'religion', label: t('Religion'), value: student?.fatherInfo?.religion }
          ]}
        />
        <ParentProfileBlock
          title={t("Mother Details")}
          imageSrc={student?.motherInfo?.photo || profileIcon}
          name={student?.motherName || student?.motherInfo?.firstName}
          details={[
            { type: 'phone', label: t('Primary Contact'), value: student?.motherInfo?.cell1.value },
            { type: 'phone', label: t('Secondary Contact'), value: student?.motherInfo?.cell2.value },
            { type: 'email', label: t('Primary Email'), value: student?.motherInfo?.email1 },
            { type: 'email', label: t('Secondary Email'), value: student?.motherInfo?.email2 },
            { type: 'address', label: t('Address'), value: address },
            { type: 'idExpiry', label: t('IdExpiry'), value: student?.motherInfo?.idExpiry },
            { type: 'idNumber', label: t('IdNumber'), value: student?.motherInfo?.idNumber },
            { type: 'jobTitle', label: t('JobTitle'), value: student?.motherInfo?.jobTitle },
            { type: 'nationality', label: t('Nationality'), value: student?.motherInfo?.nationality },
            { type: 'religion', label: t('Religion'), value: student?.motherInfo?.religion }
          ]}
        />
        <ParentProfileBlock
          title={t("Guardian Details")}
          details={[
            { type: 'name', label: t('Name'), value: student?.guardianName },
            { type: 'phone', label: t('Contact'), value: student?.guardianContactNumber },
            { type: 'email', label: t('Email'), value: student?.guardianEmail },
            { type: 'guardianRelationToStudent', label: t('Relation'), value: student?.guardianRelationToStudent },
          ]}
        />
      </div>
    </ProtectedSection>
  );
};

export default ParentsProfile;
