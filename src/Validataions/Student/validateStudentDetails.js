const validateStudentDetails = (studentDetails, type = "Student") => {
  const errors = {};

  if (!studentDetails.firstName) errors.firstName = "First name is required";
  if (!studentDetails.lastName) errors.lastName = "Last name is required";
  if (!studentDetails.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(studentDetails.email)) {
    errors.email = "Invalid email format";
  }
  // if (!studentDetails.password || studentDetails.password.length < 6) {
  //   errors.password = "Password must be at least 6 characters";
  // }
  if (!studentDetails.dateOfBirth)
    errors.dateOfBirth = "Date of birth is required";
  if (!studentDetails.placeOfBirth)
    errors.placeOfBirth = "Place of birth is required";
  if (
    !studentDetails.age ||
    isNaN(studentDetails.age) ||
    studentDetails.age <= 0
  ) {
    errors.age = "Valid age is required";
  }
  if (!studentDetails.gender) errors.gender = "Gender is required";
  if (!studentDetails.contactNumber)
    errors.contactNumber = "Contact number is required";
  if (!studentDetails.motherName)
    errors.motherName = "Mother's name is required";
  if (!studentDetails.fatherName)
    errors.fatherName = "Father's name is required";
  if (!studentDetails.guardianName)
    errors.guardianName = "Guardian's name is required";
  if (!studentDetails.guardianContactNumber) {
    errors.guardianContactNumber = "Guardian's contact number is required";
  }
  if (type === "Student") {
    if (!studentDetails.Q_Id) errors.Q_Id = "Qatar ID is required";
  }

  // Validate Permanent Address
  if (!studentDetails.permanentAddress) {
    errors.permanentAddress = "Permanent address is required";
  } else {
    if (!studentDetails.permanentAddress.street)
      errors.permanentAddress_street = "Permanent Street is required";
    if (!studentDetails.permanentAddress.city)
      errors.permanentAddress_city = "Permanent City is required";
    if (!studentDetails.permanentAddress.state)
      errors.permanentAddress_state = "Permanent State is required";
    if (!studentDetails.permanentAddress.postalCode)
      errors.permanentAddress_postalCode = "Permanent Postal code is required";
  }

  // Validate Residential Address
  if (!studentDetails.residentialAddress) {
    errors.residentialAddress = "Residential address is required";
  } else {
    if (!studentDetails.residentialAddress.street)
      errors.residentialAddress_street = " Residential Street is required";
    if (!studentDetails.residentialAddress.city)
      errors.residentialAddress_city = "Residential City is required";
    if (!studentDetails.residentialAddress.state)
      errors.residentialAddress_state = "Residential State is required";
    if (!studentDetails.residentialAddress.postalCode)
      errors.residentialAddress_postalCode =
        "Residential Postal code is required";
  }

  if (!studentDetails.emergencyNumber)
    errors.emergencyNumber = "Emergency number is required";

  return errors;
};

export default validateStudentDetails;
