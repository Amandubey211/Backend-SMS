import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";
import profileIcon from '../../../../../../Assets/DashboardAssets/profileIcon.png';
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "../../../../../../config/permission";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const ParentsProfile = ({ student }) => {
  const { t } = useTranslation('admAccounts');

  if (!student) {
    return <div>{t("Loading...")}</div>;
  }

  const address = `${student?.permanentAddress?.country}, ${student?.permanentAddress?.city}, ${student?.permanentAddress?.street}`;

  return (
    <ProtectedSection requiredPermission={PERMISSIONS.GET_STUDENT_INFO}  title={"Parent Profile"}>
    <div className="flex h-[500px] p-4 gap-5">
      <ParentProfileBlock
        title={t("Father Details")}
        imageSrc={student?.guardianProfile || profileIcon}
        name={student?.fatherName || student?.guardianName}
        details={[
          { type: 'phone', label: t('Phone'), value: student?.guardianContactNumber },
          { type: 'email', label: t('Email'), value: student?.guardianEmail },
          { type: 'address', label: t('Address'), value: address }
        ]}
      />
      <ParentProfileBlock
        title={t("Mother Details")}
        imageSrc={profileIcon}
        name={student?.motherName}
        details={[
          { type: 'phone', label: t('Phone'), value: student?.guardianContactNumber },
          { type: 'email', label: t('Email'), value: student?.guardianEmail },
          { type: 'address', label: t('Address'), value: address }
        ]}
      />
    </div>
    </ProtectedSection>
  );
};

export default ParentsProfile;
