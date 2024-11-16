

import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";
import profileIcon from '../../../../../../Assets/DashboardAssets/profileIcon.png'
const ParentsProfile = ({ student }) => {
  if (!student) {
    return <div>Loading...</div>;
  }
 const address =`${student?.permanentAddress?.
      country}, ${student?.permanentAddress?.city}, ${student?.permanentAddress?.
          street}`
  return (
    <div className="flex h-[500px] p-4 gap-5">
      <ParentProfileBlock
        title="Father Details"
        imageSrc={student?.guardianProfile || profileIcon }
        name={student?.fatherName || student?.guardianName}
        details={[
          { type: 'phone', label: 'Phone', value: student?.guardianContactNumber },
          { type: 'email', label: 'Email', value: student?.guardianEmail},
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: address}
        ]}
      />
      <ParentProfileBlock
        title="Mother Details"
        imageSrc={profileIcon}
        name={student?.motherName}
        details={[
          { type: 'phone', label: 'Phone', value: student?.guardianContactNumber },
          { type: 'email', label: 'Email', value: student?.guardianEmail},
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: address}
        ]}
      />
    </div>
  );
};

export default ParentsProfile;
