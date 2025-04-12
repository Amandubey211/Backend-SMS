// utils/nationalities.js
import { getNames } from "country-list";

export const getAllNationalities = () => {
  return getNames().map((name) => ({
    label: name,
    value: name.toLowerCase().replace(/\s+/g, "-"),
  }));
};

export const loadNationalities = (inputValue) => {
  return getAllNationalities().filter((n) =>
    n.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};
