import * as Yup from "yup";

/**
 * initialValues – The shape mirrors the backend.
 * Each file field is null initially and will later store an object { file, preview }.
 */
export const initialValues = {
  candidateInformation: {
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    placeOfBirth: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    passportNumber: "",
    passportExpiry: "",
    studentId: "",
    idExpiry: "",
    nativeLanguage: "",
    primaryContact: "",
    phoneNumber: "",
    email: "",
    emergencyNumber: "",
    bloodGroup: "",
    age: "",
  },
  academicSession: {
    academicYear: "",
    class: "",
    enrollmentStats: "",
  },
  academicHistory: {
    previousSchoolName: "",
    previousClass: "",
    curriculum: "",
    lastDayAtSchool: "",
    sourceOfFee: "",
  },
  addressInformation: {
    residenceType: "",
    unitNumber: "",
    buildingNumber: "",
    streetNumber: "",
    streetName: "",
    zone: "",
    dwellingType: "",
    compoundName: "",
    city: "",
    nearestLandmark: "",
    proposedCampus: "",
    transportRequired: false,
  },
  fatherInfo: {
    idNumber: "",
    idExpiry: "",
    fatherPhoto: null,
    firstName: "",
    middleName: "",
    lastName: "",
    religion: "",
    nationality: "",
    company: "",
    jobTitle: "",
    cell1: { value: "", isWhatsapp: false },
    cell2: { value: "", isWhatsapp: false },
    email1: "",
    email2: "",
  },
  motherInfo: {
    idNumber: "",
    profileImage: null,
    motherPhoto: null,
    idExpiry: "",
    firstName: "",
    middleName: "",
    lastName: "",
    religion: "",
    nationality: "",
    company: "",
    jobTitle: "",
    cell1: { value: "", isWhatsapp: false },
    cell2: { value: "", isWhatsapp: false },
    email1: "",
    email2: "",
  },
  guardianInformation: {
    guardianName: "",
    guardianRelationToStudent: "",
    guardianContactNumber: "",
    guardianEmail: "",
  },
  attachments: {
    mandatory: {
      studentIdCopy: null,
      studentPassport: null,
      studentPicture: null, // Used for student profile picture via ImageUploader in candidate section
      lastReportCard: null,
    },
    optional: {
      medicalReport: null,
      birthCertificate: null,
      vaccinationCard: null,
    },
  },
};

export const AdminAdmissionSchema = Yup.object().shape({
  fatherInfo: Yup.object().shape({
    idNumber: Yup.string().required("Father ID is required"),
    idExpiry: Yup.date().required("Father ID expiry is required"),
    firstName: Yup.string().required("Father first name is required"),
    lastName: Yup.string().required("Father last name is required"),
    cell1: Yup.object()
      .shape({
        value: Yup.string().required("Father primary contact is required"),
        isWhatsapp: Yup.boolean(),
      })
      .required("Father primary contact is required"),
    cell2: Yup.object().shape({
      value: Yup.string().nullable(),
      isWhatsapp: Yup.boolean(),
    }),
    email1: Yup.string()
      .email("Invalid email")
      .required("Father email is required"),
  }),
  motherInfo: Yup.object().shape({
    idNumber: Yup.string().required("Mother ID is required"),
    idExpiry: Yup.date().required("Mother ID expiry is required"),
    firstName: Yup.string().required("Mother first name is required"),
    lastName: Yup.string().required("Mother last name is required"),
    cell1: Yup.object()
      .shape({
        value: Yup.string().required("Mother primary contact is required"),
        isWhatsapp: Yup.boolean(),
      })
      .required("Mother primary contact is required"),
    cell2: Yup.object().shape({
      value: Yup.string().nullable(),
      isWhatsapp: Yup.boolean(),
    }),
  }),
  academicSession: Yup.object().shape({
    academicYear: Yup.string().required("Academic year is required"),
    class: Yup.string().required("Class is required"),
    enrollmentStats: Yup.string().required("Enrollment status is required"),
  }),
  candidateInformation: Yup.object().shape({
    studentId: Yup.string().required("Student ID is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    dob: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    nationality: Yup.string().required("Nationality is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    emergencyNumber: Yup.string().required("Emergency number is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
  }),
  academicHistory: Yup.object().shape({
    previousSchoolName: Yup.string().required(
      "Previous school name is required"
    ),
    previousClass: Yup.string().required("Previous class is required"),
    curriculum: Yup.string().required("Curriculum is required"),
  }),
  addressInformation: Yup.object().shape({
    unitNumber: Yup.string().required("Unit number is required"),
    buildingNumber: Yup.string().required("Building number is required"),
    streetNumber: Yup.string().required("Street number is required"),
    city: Yup.string().required("City is required"),
  }),
  guardianInformation: Yup.object().shape({
    guardianName: Yup.string().required("Guardian name is required"),
    guardianRelationToStudent: Yup.string().required(
      "Guardian relation is required"
    ),
    guardianContactNumber: Yup.string().required(
      "Guardian contact number is required"
    ),
    guardianEmail: Yup.string()
      .email("Invalid email")
      .required("Guardian email is required"),
  }),
  attachments: Yup.object().shape({
    mandatory: Yup.object().shape({
      studentIdCopy: Yup.mixed().required("Student ID Copy is required"),
      studentPassport: Yup.mixed().required("Student passport is required"),
      studentPicture: Yup.mixed().required("Student picture is required"),
      lastReportCard: Yup.mixed().required("Last report card is required"),
    }),
    optional: Yup.object().shape({
      medicalReport: Yup.mixed().nullable(),
      birthCertificate: Yup.mixed().nullable(),
      vaccinationCard: Yup.mixed().nullable(),
    }),
  }),
});
