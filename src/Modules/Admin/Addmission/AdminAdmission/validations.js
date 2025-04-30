import { useMemo } from "react";
import * as Yup from "yup";

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
    age: "",
  },
  academicSession: {
    academicYear: "",
    class: "",
    enrollmentStats: "Full Time",
  },
  academicHistory: {
    previousSchoolName: "",
    previousClass: "",
    curriculum: "",
    lastDayAtSchool: "",
    sourceOfFee: "Parent",
  },
  languagePrefs: {
    second: [],
    third: [],
    valueEd: "",
    leftHanded: false,
  },
  medicalInfo: "",
  addressInformation: {
    residenceType: "flat",
    unitNumber: "",
    buildingNumber: "",
    streetNumber: "",
    streetName: "",
    zone: "",
    dwellingType: "compound",
    compoundName: "",
    city: "",
    nearestLandmark: "",
    proposedCampus: "",
    transportRequired: true,
    postalCode: "",
    state: "",
    country: "",
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
    workPhone: "",
    homePhone: "",
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
    workPhone: "",
    homePhone: "",
    email1: "",
    email2: "",
  },
  guardianInformation: {
    guardianName: "",
    guardianRelationToStudent: "",
    guardianContactNumber: "",
    guardianEmail: "",
  },
  profile: null,
};

export const baseAdminAdmissionSchema = Yup.object().shape({
  candidateInformation: Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    dob: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    emergencyNumber: Yup.string().required("Emergency number is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    studentId: Yup.string().required("Student ID is required"),
    nationality: Yup.string().required("Nationality is required"),
  }),
  academicSession: Yup.object().shape({
    academicYear: Yup.string().required("Academic year is required"),
    class: Yup.string().required("Class is required"),
    enrollmentStats: Yup.string().required("Enrollment status is required"),
  }),
  fatherInfo: Yup.object().shape({
    idNumber: Yup.string().required("Father ID is required"),
    idExpiry: Yup.date().required("Father ID expiry is required"),
    firstName: Yup.string().required("Father first name is required"),
    lastName: Yup.string().required("Father last name is required"),
    cell1: Yup.object()
      .shape({
        value: Yup.string().required("Father primary contact is required"),
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
      })
      .required("Mother primary contact is required"),
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

    const schemaShape = {};

    metaArr.forEach(({ name, mandatory }) => {
      if (name) {
        // Store the original name in fieldName and use normalized key for form state
        const fieldName = name; // Keep original name for backend
        const formKey = name.replace(/\s+/g, "_").toLowerCase(); // Normalized for form state

        initialValues.attachments[mandatory ? "mandatory" : "optional"][
          formKey
        ] = {
          file: null,
          preview: null,
          fieldName: fieldName, // Store original name here
        };

        schemaShape[
          `attachments.${mandatory ? "mandatory" : "optional"}.${formKey}`
        ] = mandatory
          ? Yup.mixed().test(
              "file-required",
              `${name} is required`,
              (value) => {
                return value?.file !== null && value?.file !== undefined;
              }
            )
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
