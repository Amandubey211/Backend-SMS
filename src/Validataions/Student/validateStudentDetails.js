// validateStudentDetails.js

const validateStudentDetails = (details) => {
  const errors = {};

  // Validate personal information
  if (!details.firstName.trim()) {
    errors.firstName = "First Name is required";
  }
  if (!details.lastName.trim()) {
    errors.lastName = "Last Name is required";
  }
  if (!details.email.trim()) {
    errors.email = "Email is required";
  }
  if (!details.dateOfBirth) {
    errors.dateOfBirth = "Date of Birth is required";
  }
  if (!details.placeOfBirth.trim()) {
    errors.placeOfBirth = "Place of Birth is required";
  }
  if (!details.gender) {
    errors.gender = "Gender is required";
  }
  if (!details.religion) {
    errors.religion = "Religion is required";
  }
  if (!details.contactNumber.trim()) {
    errors.contactNumber = "Contact Number is required";
  }
  if (!details.emergencyNumber.trim()) {
    errors.emergencyNumber = "Emergency Contact Number is required";
  }
  if (!details.Q_Id.trim()) {
    errors.Q_Id = "QID is required";
  }
  if (!details.motherName.trim()) {
    errors.motherName = "Mother's Name is required";
  }
  if (!details.fatherName.trim()) {
    errors.fatherName = "Father's Name is required";
  }
  if (!details.guardianName.trim()) {
    errors.guardianName = "Guardian's Name is required";
  }
  if (!details.guardianRelationToStudent.trim()) {
    errors.guardianRelationToStudent = "Relation to Student is required";
  }
  if (!details.guardianEmail.trim()) {
    errors.guardianEmail = "Guardian's Email is required";
  }
  if (!details.guardianContactNumber.trim()) {
    errors.guardianContactNumber = "Guardian's Contact Number is required";
  }
  if (!details.enrollmentStatus) {
    errors.enrollmentStatus = "Enrollment Status is required";
  }
  // if (!details.transportRequirement) {
  //   errors.transportRequirement = "Transport Requirement is required";
  // }
  if (!details.schoolId) {
    errors.schoolId = "School is required";
  }
  // if (!details.profile) {
  //   errors.profile = "Profile image is required";
  // }

  // Validate permanent address
  errors.permanentAddress = {};
  if (!details.permanentAddress.street.trim()) {
    errors.permanentAddress.street = "Street is required";
  }
  if (!details.permanentAddress.city.trim()) {
    errors.permanentAddress.city = "City is required";
  }
  if (!details.permanentAddress.state.trim()) {
    errors.permanentAddress.state = "State is required";
  }
  if (!details.permanentAddress.postalCode.trim()) {
    errors.permanentAddress.postalCode = "Postal Code is required";
  }
  if (!details.permanentAddress.country.trim()) {
    errors.permanentAddress.country = "Country is required";
  }

  // Remove empty address errors
  if (Object.keys(errors.permanentAddress).length === 0) {
    delete errors.permanentAddress;
  }

  // Validate residential address if not same as permanent address
  if (details.residentialAddress) {
    errors.residentialAddress = {};
    if (!details.residentialAddress.street.trim()) {
      errors.residentialAddress.street = "Street is required";
    }
    if (!details.residentialAddress.city.trim()) {
      errors.residentialAddress.city = "City is required";
    }
    if (!details.residentialAddress.state.trim()) {
      errors.residentialAddress.state = "State is required";
    }
    if (!details.residentialAddress.postalCode.trim()) {
      errors.residentialAddress.postalCode = "Postal Code is required";
    }
    if (!details.residentialAddress.country.trim()) {
      errors.residentialAddress.country = "Country is required";
    }

    if (Object.keys(errors.residentialAddress).length === 0) {
      delete errors.residentialAddress;
    }
  }

  return errors;
};

export default validateStudentDetails;
