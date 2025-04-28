// src/utils/selectOptionsConfig.js

export const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
];

export const PLACE_OF_BIRTH_OPTIONS = [
  { label: "Doha", value: "doha" },
  { label: "Riyadh", value: "riyadh" },
  { label: "Cairo", value: "cairo" },
  { label: "Dubai", value: "dubai" },
  { label: "Abu Dhabi", value: "abu dhabi" },
];

export const NATIONALITY_OPTIONS = [
  { label: "Qatari", value: "qatari" },
  { label: "Egyptian", value: "egyptian" },
  { label: "Indian", value: "indian" },
  { label: "Pakistani", value: "pakistani" },
  { label: "Bangladeshi", value: "bangladeshi" },
];

export const RELIGION_OPTIONS = [
  { label: "Islam", value: "islam" },
  { label: "Christianity", value: "christianity" },
  { label: "Hinduism", value: "hinduism" },
  { label: "Buddhism", value: "buddhism" },
  { label: "Judaism", value: "judaism" },
  { label: "Sikhism", value: "sikhism" },
  { label: "Shinto", value: "shinto" },
  { label: "Other", value: "other" },
];

export const NATIVE_LANGUAGE_OPTIONS = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Urdu", value: "ur" },
];

export const PRIMARY_CONTACT_OPTIONS = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Guardian", value: "guardian" },
];

export const ENROLLMENT_STATUS_OPTIONS = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
];

export const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "Rh+", value: "Rh+" },
  { label: "Rh-", value: "Rh-" },
];
export const LANGUAGE_OPTIONS = ["Arabic", "Hindi", "Malayalam", "Tamil"].map(
  (l) => ({ label: l, value: l.toLowerCase() })
);

export const VALUE_ED_OPTIONS = [
  { label: "Moral", value: "moral" },
  { label: "Islamic Studies", value: "islamic" },
];

export const YES_NO_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
