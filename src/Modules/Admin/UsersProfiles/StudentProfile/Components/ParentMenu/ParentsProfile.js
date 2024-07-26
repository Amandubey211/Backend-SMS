

import React from "react";
import ParentProfileBlock from "./ParentProfileBlock";

const ParentsProfile = ({ student }) => {
  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[500px] p-4 gap-5">
      <ParentProfileBlock
        title="Father Details"
        imageSrc="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name={student?.guardianName}
        details={[
          { type: 'phone', label: 'Phone', value: student?.guardianContactNumber },
          { type: 'email', label: 'Email', value: student?.guardianEmail},
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: student?.permanentAddress?.street}
        ]}
      />
      <ParentProfileBlock
        title="Mother Details"
        imageSrc="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name={student?.motherName}
        details={[
          { type: 'phone', label: 'Phone', value: student?.motherNumber?student?.motherNumber:'-'  },
          { type: 'email', label: 'Email', value: student?.motherEmail?student?.motherEmail:'-' },
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: student?.permanentAddress?.street}
        ]}
      />
      {/* <ParentProfileBlock
        title="Mother Details"
        imageSrc="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        name={parents.motherName}
        details={[
          { type: 'phone', label: 'Phone', value: parents.phone },
          { type: 'email', label: 'Email', value: parents.email },
          { type: 'child', label: 'Child', value: '2-child' },
          { type: 'address', label: 'Address', value: parents.address }
        ]}
      /> */}
    </div>
  );
};

export default ParentsProfile;
