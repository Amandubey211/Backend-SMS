import dayjs from "dayjs";
import * as yup from "yup";

/* ---------- STEP 1 — School ---------- */
export const SchoolSchema = yup.object({
  schoolId: yup.string().required("Please select a school"),
  applyingClass: yup.string().required("Please select a class"),
  email: yup
    .string()
    .email("Invalid e‑mail")
    .required("Student e‑mail required"),
});
// Create a reusable date validation function
const dateSchema = yup
  .mixed()
  .test(
    "is-date",
    "Invalid date format",
    (value) => !value || dayjs(value, "YYYY-MM-DD", true).isValid()
  );
const toDate = (v) => (v ? dayjs(v).toDate() : null);

const baseContact = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  middleName: yup.string().nullable(),
  idNumber: yup.string().nullable(),
  idExpiry: dateSchema.nullable(),
  religion: yup.string().nullable(),
  nationality: yup.string().nullable(),
  company: yup.string().nullable(),
  jobTitle: yup.string().nullable(),
  cell1: yup.string().required("Phone number is required"),
  cell1IsWhatsapp: yup.boolean(),
  cell2: yup.string().nullable(),
  cell2IsWhatsapp: yup.boolean(),
  email1: yup.string().email("Invalid email").nullable(),
  email2: yup.string().email("Invalid email").nullable(),
});

export const GuardianSchema = yup.object().shape({
  fatherInfo: baseContact,
  motherInfo: baseContact.shape({
    firstName: yup.string().required("First name is required"),
  }),
  guardianInformation: yup.object().shape({
    guardianName: yup.string().required("Guardian name is required"),
    guardianRelationToStudent: yup.string().required("Relation is required"),
    guardianContactNumber: yup.string().required("Contact number is required"),
    guardianEmail: yup.string().email("Invalid email").nullable(),
    guardianContactIsWhatsapp: yup.boolean(),
  }),
  fatherPhoto: yup.mixed().nullable(),
  motherPhoto: yup.mixed().nullable(),
});
/* Skeletons for remaining steps (extend later) */

export const CandidateSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  middleName: yup.string().required("Middle name is required"),
  profile: yup
    .mixed()
    .required("Candidate photo is required")
    .test("is-file-or-url", "Invalid image", (value) => {
      // Allow either a File object or a URL string
      return value instanceof File || typeof value === "string";
    }),
  dob: yup
    .string()
    .transform(toDate)
    .typeError("Date of birth is required")
    .required("Date of birth is required"),

  dob: yup.date().typeError("Required").required(),

  // idExpiry: yup.string().transform(toDate).nullable(),
  // passportExpiry: yup.string().transform(toDate).nullable(),

  gender: yup.string().required("Gender is required"),
  placeOfBirth: yup.string().required("Place of birth is required"),
  nationality: yup.string().required("Nationality is required"),
  religion: yup.string().required("Religion is required"),
  nativeLanguage: yup.string().required("Native language is required"),

  phoneNumber: yup.string().required("Phone number is required"),

  email: yup.string().email("Invalid e‑mail").required("Email is required"),

  primaryContact: yup.string().required("Primary contact is required"),
});

export const AcademicSchema = yup.object({
  previousSchoolName: yup.string().required("Previous school is required"),
  previousClass: yup.string().required("Previous class is required"),
  curriculum: yup.string().required("Curriculum is required"),

  /* The safe way – use the (value, schema) form */
  otherCurriculum: yup.string().when(
    "curriculum",
    (curr, schema) =>
      curr === "other"
        ? schema.required("Please specify curriculum")
        : schema.strip() // strip from output when not needed
  ),

  sourceOfFee: yup.string().required("Source of fee is required"),
});

export const LanguagePreferenceSchema = yup.object().shape({
  secondLanguage: yup
    .array()
    .min(1, "Please select at least one second language")
    .required("Required"),
  thirdLanguage: yup
    .array()
    .min(1, "Please select at least one third language")
    .required("Required"),
  valueEducation: yup
    .array()
    .min(1, "Please select at least one value education")
    .required("Required"),
  isLeftHanded: yup.boolean().default(false),
  medicalCondition: yup.string().nullable(),
});

export const AddressSchema = yup.object({
  // residenceType: yup.string().required(),
  // // unitNumber: yup.string().required(),
  // buildingNumber: yup.string().required(),
  // streetName: yup.string().required(),
  // city: yup.string().required(),
  // transportRequired: yup.boolean(),
});
export const DocsSchema = yup.object({});
export const ConsentSchema = yup.object({});

export const stepSchemas = [
  SchoolSchema,

  CandidateSchema,
  GuardianSchema,
  LanguagePreferenceSchema,
  AcademicSchema,
  AddressSchema,
  DocsSchema,
  ConsentSchema,
];
