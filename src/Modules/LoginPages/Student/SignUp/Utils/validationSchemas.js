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

const toDate = (v) => (v ? dayjs(v).toDate() : null);

const baseContact = {
  firstName: yup.string().required("First name"),
  lastName: yup.string().required("Last name"),
  cell1: yup.string().required("Cell phone"),
};

export const GuardianSchema = yup.object({
  fatherInfo: yup.object(baseContact),
  motherInfo: yup.object(baseContact).shape({
    firstName: yup.string().required("First name"),
  }),
  guardianInformation: yup.object({
    guardianName: yup.string().required("Guardian name"),
    guardianRelationToStudent: yup.string().required("Relation is required"),
    guardianContactNumber: yup.string().required("Contact number"),
    guardianEmail: yup.string().email("Invalid email").nullable(),
  }),
});

/* Skeletons for remaining steps (extend later) */

export const CandidateSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),

  // dob: yup
  //   .string()
  //   .transform(toDate)
  //   .typeError("Date of birth is required")
  //   .required("Date of birth is required"),

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
  previousSchool: yup.string().required("Previous school is required"),
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

  lastDayAtSchool: yup
    .date()
    .typeError("Last day is required") // nicer message for empty picker
    .required("Last day is required"),
  sourceOfFee: yup.string().required("Source of fee is required"),
});

export const AddressSchema = yup.object({
  residenceType: yup.string().required(),
  unitNumber: yup.string().required(),
  buildingNumber: yup.string().required(),
  streetName: yup.string().required(),
  zoneNumber: yup.number().typeError("Zone is required").required(),
  city: yup.string().required(),
  transportRequired: yup.boolean(),
});
export const DocsSchema = yup.object({});
export const ConsentSchema = yup.object({});

export const stepSchemas = [
  SchoolSchema,
  GuardianSchema,
  CandidateSchema,
  AcademicSchema,
  AddressSchema,
  DocsSchema,
  ConsentSchema,
];
