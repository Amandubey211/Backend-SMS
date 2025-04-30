// src/utils/selectOptionsConfig.js

export const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
];
/* =======================
   Demographic Select Data
   ======================= */

export const PLACE_OF_BIRTH_OPTIONS = [
  // GCC / Middle East
  { label: "Doha", value: "doha" },
  { label: "Riyadh", value: "riyadh" },
  { label: "Jeddah", value: "jeddah" },
  { label: "Cairo", value: "cairo" },
  { label: "Dubai", value: "dubai" },
  { label: "Abu Dhabi", value: "abu_dhabi" },
  { label: "Kuwait City", value: "kuwait_city" },
  { label: "Manama", value: "manama" },
  { label: "Muscat", value: "muscat" },
  { label: "Amman", value: "amman" },
  { label: "Beirut", value: "beirut" },
  { label: "Damascus", value: "damascus" },

  // South & Central Asia
  { label: "Mumbai", value: "mumbai" },
  { label: "Delhi", value: "delhi" },
  { label: "Karachi", value: "karachi" },
  { label: "Dhaka", value: "dhaka" },
  { label: "Kathmandu", value: "kathmandu" },
  { label: "Colombo", value: "colombo" },
  { label: "Islamabad", value: "islamabad" },

  // Africa
  { label: "Nairobi", value: "nairobi" },
  { label: "Lagos", value: "lagos" },
  { label: "Khartoum", value: "khartoum" },

  // Europe & Americas (expat-friendly)
  { label: "London", value: "london" },
  { label: "Paris", value: "paris" },
  { label: "New York", value: "new_york" },
  { label: "Toronto", value: "toronto" },
  { label: "Sydney", value: "sydney" },
];

export const NATIONALITY_OPTIONS = [
  // GCC / MENA
  { label: "Qatari", value: "qatari" },
  { label: "Saudi", value: "saudi" },
  { label: "Emirati", value: "emirati" },
  { label: "Omani", value: "omani" },
  { label: "Bahraini", value: "bahraini" },
  { label: "Kuwaiti", value: "kuwaiti" },
  { label: "Jordanian", value: "jordanian" },
  { label: "Lebanese", value: "lebanese" },
  { label: "Syrian", value: "syrian" },
  { label: "Sudanese", value: "sudanese" },
  { label: "Palestinian", value: "palestinian" },
  { label: "Egyptian", value: "egyptian" },

  // South & South-East Asia
  { label: "Indian", value: "indian" },
  { label: "Pakistani", value: "pakistani" },
  { label: "Bangladeshi", value: "bangladeshi" },
  { label: "Nepalese", value: "nepalese" },
  { label: "Sri Lankan", value: "sri_lankan" },
  { label: "Filipino", value: "filipino" },
  { label: "Indonesian", value: "indonesian" },

  // Africa
  { label: "Kenyan", value: "kenyan" },
  { label: "Nigerian", value: "nigerian" },
  { label: "Ghanaian", value: "ghanaian" },

  // Western expat set
  { label: "British", value: "british" },
  { label: "American", value: "american" },
  { label: "Canadian", value: "canadian" },
  { label: "Australian", value: "australian" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
];

export const RELIGION_OPTIONS = [
  { label: "Islam", value: "islam" },
  { label: "Christianity", value: "christianity" },
  { label: "Hinduism", value: "hinduism" },
  { label: "Buddhism", value: "buddhism" },
  { label: "Judaism", value: "judaism" },
  { label: "Sikhism", value: "sikhism" },
  { label: "Jainism", value: "jainism" },
  { label: "Bahá'í", value: "bahai" },
  { label: "Zoroastrianism", value: "zoroastrianism" },
  { label: "Shinto", value: "shinto" },
  { label: "Atheist / None", value: "none" },
  { label: "Other", value: "other" },
];

export const NATIVE_LANGUAGE_OPTIONS = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Urdu", value: "ur" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali", value: "bn" },
  { label: "Tamil", value: "ta" },
  { label: "Malayalam", value: "ml" },
  { label: "Telugu", value: "te" },
  { label: "Punjabi", value: "pa" },
  { label: "Nepali", value: "ne" },
  { label: "Tagalog", value: "tl" },
  { label: "Turkish", value: "tr" },
  { label: "Persian (Farsi)", value: "fa" },
  { label: "Swahili", value: "sw" },
  { label: "Mandarin Chinese", value: "zh" },
  { label: "Spanish", value: "es" },
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
