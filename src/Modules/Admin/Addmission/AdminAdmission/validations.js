import { useMemo } from "react";
import * as Yup from "yup";

// export const initialValues = {
//   candidateInformation: {
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     dob: "",
//     gender: "",
//     placeOfBirth: "",
//     bloodGroup: "",
//     nationality: "",
//     religion: "",
//     passportNumber: "",
//     passportExpiry: "",
//     studentId: "",
//     idExpiry: "",
//     nativeLanguage: "",
//     primaryContact: "",
//     phoneNumber: "",
//     email: "",
//     emergencyNumber: "",
//     age: "",
//   },
//   academicSession: {
//     academicYear: "",
//     class: "",
//     enrollmentStats: "Full Time",
//   },
//   academicHistory: {
//     previousSchoolName: "",
//     previousClass: "",
//     curriculum: "",
//     lastDayAtSchool: "",
//     sourceOfFee: "Parent",
//   },
//   languagePrefs: {
//     second: [],
//     third: [],
//     valueEd: "",
//     leftHanded: false,
//   },
//   medicalInfo: "",
//   addressInformation: {
//     residenceType: "flat",
//     unitNumber: "",
//     buildingNumber: "",
//     streetNumber: "",
//     streetName: "",
//     zone: "",
//     dwellingType: "compound",
//     compoundName: "",
//     city: "",
//     nearestLandmark: "",
//     proposedCampus: "",
//     transportRequired: true,
//     postalCode: "",
//     state: "",
//     country: "",
//   },
//   fatherInfo: {
//     idNumber: "",
//     idExpiry: "",
//     fatherPhoto: null,
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     religion: "",
//     nationality: "",
//     company: "",
//     jobTitle: "",
//     cell1: { value: "", isWhatsapp: false },
//     cell2: { value: "", isWhatsapp: false },
//     email1: "",
//     email2: "",
//     workPhone: "",
//     homePhone: "",
//   },
//   motherInfo: {
//     idNumber: "",
//     profileImage: null,
//     motherPhoto: null,
//     idExpiry: "",
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     religion: "",
//     nationality: "",
//     company: "",
//     jobTitle: "",
//     cell1: { value: "", isWhatsapp: false },
//     cell2: { value: "", isWhatsapp: false },
//     workPhone: "",
//     homePhone: "",
//     email1: "",
//     email2: "",
//   },
//   guardianInformation: {
//     guardianName: "",
//     guardianRelationToStudent: "",
//     guardianContactNumber: "",
//     guardianEmail: "",
//   },
//   profile: null,
//   studentPicture: null,
// };

export const initialValues = {
  candidateInformation: {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith",
    dob: "2005-05-15", // Format: YYYY-MM-DD
    gender: "Male",
    placeOfBirth: "New York",
    bloodGroup: "O+",
    nationality: "American",
    religion: "Christian",
    passportNumber: "1234567890",
    passportExpiry: "2030-12-31", // Format: YYYY-MM-DD
    studentId: "S12345",
    idExpiry: "2025-05-15", // Format: YYYY-MM-DD
    nativeLanguage: "English",
    primaryContact: "Father",
    phoneNumber: "+1234567890",
    email: "john.doe@example.com",
    emergencyNumber: "+0987654321",
    age: "18",
  },
  academicSession: {
    academicYear: "2024-2025",
    class: "Grade 12",
    enrollmentStats: "Full Time",
  },
  academicHistory: {
    previousSchoolName: "XYZ High School",
    previousClass: "Grade 11",
    curriculum: "CBSE",
    lastDayAtSchool: "2024-04-30", // Format: YYYY-MM-DD
    sourceOfFee: "Parent",
  },
  languagePrefs: {
    second: ["French", "Spanish"], // Array of selected second languages
    third: ["German"], // Array of selected third languages (for grade 3+)
    valueEd: "moral", // "moral" or "islamic"
    leftHanded: false, // boolean
  },
  medicalInfo: "Asthma, allergy to peanuts", // ⬅️ free-text
  addressInformation: {
    residenceType: "flat", // "flat" or "villa"
    unitNumber: "5B",
    buildingNumber: "120",
    streetNumber: "15",
    streetName: "Main St.",
    zone: "North",
    dwellingType: "compound", // "compound" or "standAlone"
    compoundName: "Sunny Meadows",
    city: "New York",
    nearestLandmark: "Central Park",
    proposedCampus: "Downtown Campus",
    transportRequired: true,
    postalCode: "10001",
    state: "NY",
    country: "USA",
  },
  fatherInfo: {
    idNumber: "F123456789",
    idExpiry: "2035-12-31", // Format: YYYY-MM-DD
    fatherPhoto: null, // Placeholder for photo upload
    firstName: "Michael",
    middleName: "James",
    lastName: "Doe",
    religion: "Christian",
    nationality: "American",
    company: "ABC Corp",
    jobTitle: "Manager",
    cell1: { value: "+1234567890", isWhatsapp: true },
    cell2: { value: "+0987654321", isWhatsapp: false },
    email1: "michael.doe@example.com",
    email2: "michael.doe@company.com",
    workPhone: "+11234567890",
    homePhone: "+1234567890",
  },
  motherInfo: {
    idNumber: "M123456789",
    profileImage: null, // Placeholder for mother profile image upload
    motherPhoto: null, // Placeholder for mother photo upload
    idExpiry: "2035-12-31", // Format: YYYY-MM-DD
    firstName: "Sarah",
    middleName: "Lee",
    lastName: "Doe",
    religion: "Christian",
    nationality: "American",
    company: "XYZ Ltd",
    jobTitle: "Teacher",
    cell1: { value: "+1234567890", isWhatsapp: true },
    cell2: { value: "+0987654321", isWhatsapp: false },
    workPhone: "+11234567890",
    homePhone: "+1234567890",
    email1: "sarah.doe@example.com",
    email2: "sarah.doe@xyz.com",
  },
  guardianInformation: {
    guardianName: "Elizabeth Smith",
    guardianRelationToStudent: "Aunt",
    guardianContactNumber: "+1122334455",
    guardianEmail: "elizabeth.smith@example.com",
  },
  profile: "", // Placeholder for profile picture file
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
  profile: Yup.mixed().required("Profile picture is required"),
});

export default function useDynamicAttachments(attachmentsMetaInput) {
  const metaArr = Array.isArray(attachmentsMetaInput)
    ? attachmentsMetaInput
    : [];

  return useMemo(() => {
    const initialValues = {
      profile: null,
      attachments: {
        mandatory: {},
        optional: {},
      },
    };

    const schemaShape = {
      profile: Yup.mixed().required("Profile picture is required"),
    };

    metaArr.forEach(({ name, mandatory }) => {
      if (name) {
        // Ensure field names are properly formatted
        const fieldName = name.replace(/\s+/g, "_").toLowerCase();
        initialValues.attachments[mandatory ? "mandatory" : "optional"][
          fieldName
        ] = null;
        schemaShape[
          `attachments.${mandatory ? "mandatory" : "optional"}.${fieldName}`
        ] = mandatory
          ? Yup.mixed().required(`${name} is required`)
          : Yup.mixed().nullable();
      }
    });

    const attachmentsSchema = Yup.object().shape(schemaShape);

    return {
      attachmentsInitialValues: initialValues,
      attachmentsSchema,
    };
  }, [metaArr]);
}
