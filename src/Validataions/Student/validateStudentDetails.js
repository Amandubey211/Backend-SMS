// validateStudentDetails.js
const validateStudentDetails = (details) => {
  const errors = {};

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (number) => /^\d{10}$/.test(number);
  const isValidPostalCode = (postalCode) => /^\d{5,10}$/.test(postalCode);
  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const isValidQID = (qid) => /^\d{5,10}$/.test(qid);

  // Personal Information
  if (!details.firstName.trim()) errors.firstName = "First Name is required";
  else if (!isValidName(details.firstName))
    errors.firstName = "First Name must contain only letters";

  if (!details.lastName.trim()) errors.lastName = "Last Name is required";
  else if (!isValidName(details.lastName))
    errors.lastName = "Last Name must contain only letters";

  if (!details.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(details.email))
    errors.email = "Please provide a valid email";

  if (!details.dateOfBirth) errors.dateOfBirth = "Date of Birth is required";
  if (!details.placeOfBirth.trim())
    errors.placeOfBirth = "Place of Birth is required";
  if (!details.gender) errors.gender = "Gender is required";
  if (!details.religion) errors.religion = "Religion is required";
  // if (!details.bloodGroup) errors.bloodGroup = "bloodGroup is required";

  if (!details.contactNumber.trim())
    errors.contactNumber = "Contact Number is required";
  else if (!isValidPhoneNumber(details.contactNumber))
    errors.contactNumber = "Invalid Contact Number (should be 10 digits)";

  if (!details.emergencyNumber.trim())
    errors.emergencyNumber = "Emergency Contact Number is required";
  else if (!isValidPhoneNumber(details.emergencyNumber))
    errors.emergencyNumber =
      "Invalid Emergency Contact Number (should be 10 digits)";

  if (!details.Q_Id.trim()) errors.Q_Id = "QID is required";
  else if (!isValidQID(details.Q_Id)) errors.Q_Id = "Invalid QID format";

  if (!details.motherName.trim())
    errors.motherName = "Mother's Name is required";
  else if (!isValidName(details.motherName))
    errors.motherName = "Mother's Name must contain only letters";

  if (!details.fatherName.trim())
    errors.fatherName = "Father's Name is required";
  else if (!isValidName(details.fatherName))
    errors.fatherName = "Father's Name must contain only letters";

  if (!details.guardianName.trim())
    errors.guardianName = "Guardian's Name is required";
  else if (!isValidName(details.guardianName))
    errors.guardianName = "Guardian's Name must contain only letters";

  if (!details.guardianRelationToStudent.trim())
    errors.guardianRelationToStudent = "Relation to Student is required";

  if (!details.guardianEmail.trim())
    errors.guardianEmail = "Guardian's Email is required";
  else if (!isValidEmail(details.guardianEmail))
    errors.guardianEmail = "Please provide a valid email for the guardian";

  if (!details.guardianContactNumber.trim())
    errors.guardianContactNumber = "Guardian's Contact Number is required";
  else if (!isValidPhoneNumber(details.guardianContactNumber))
    errors.guardianContactNumber =
      "Invalid Guardian Contact Number (should be 10 digits)";

  if (!details.enrollmentStatus)
    errors.enrollmentStatus = "Enrollment Status is required";
  if (!details.schoolId) errors.schoolId = "School is required";
  if (!details.applyingClass) errors.applyingClass = "Class is required";
  // if (!details.profile) errors.profile = "Profile image is required";

  // Permanent Address
  if (!details.permanentAddress.street.trim())
    errors["permanentAddress.street"] = "Permanent Street is required";
  if (!details.permanentAddress.city.trim())
    errors["permanentAddress.city"] = "Permanent City is required";
  if (!details.permanentAddress.state.trim())
    errors["permanentAddress.state"] = "Permanent State is required";
  if (!details.permanentAddress.postalCode.trim())
    errors["permanentAddress.postalCode"] = "Permanent Postal Code is required";
  else if (!isValidPostalCode(details.permanentAddress.postalCode))
    errors["permanentAddress.postalCode"] = "Invalid Postal Code format";
  if (!details.permanentAddress.country.trim())
    errors["permanentAddress.country"] = "Permanent Country is required";

  // Residential Address
  if (details.residentialAddress) {
    if (!details.residentialAddress.street.trim())
      errors["residentialAddress.street"] = "Residential Street is required";
    if (!details.residentialAddress.city.trim())
      errors["residentialAddress.city"] = "Residential City is required";
    if (!details.residentialAddress.state.trim())
      errors["residentialAddress.state"] = "Residential State is required";
    if (!details.residentialAddress.postalCode.trim())
      errors["residentialAddress.postalCode"] =
        "Residential Postal Code is required";
    else if (!isValidPostalCode(details.residentialAddress.postalCode))
      errors["residentialAddress.postalCode"] = "Invalid Postal Code format";
    if (!details.residentialAddress.country.trim())
      errors["residentialAddress.country"] = "Residential Country is required";
  }

  return errors;
};

export default validateStudentDetails;
