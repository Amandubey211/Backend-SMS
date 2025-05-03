// utils/studentDataMapper.js
export const mapStudentToForm = (studentData) => {
  if (!studentData) return null;

  return {
    school: {
      schoolId: studentData.school?._id,
      applyingClass: studentData.class?._id,
      email: studentData.email,
      isVerified: true,
    },
    guardian: {
      ...studentData.guardian,
      relation: studentData.guardianRelation,
    },
    candidate: {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      dob: studentData.dob,
      gender: studentData.gender,
      // ... other personal details
    },
    academic: {
      previousSchool: studentData.academic?.previousSchool,
      lastClass: studentData.academic?.lastClass,
      // ... other academic details
    },
    address: {
      ...studentData.address,
    },
    documents: studentData.documents || [],
    consent: {},
  };
};
