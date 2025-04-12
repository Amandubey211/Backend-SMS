// utils/religions.js
export const religionOptions = [
  { label: "Islam", value: "islam" },
  { label: "Christianity", value: "christianity" },
  // ... other options
];

export const loadReligions = (inputValue) => {
  return religionOptions.filter((r) =>
    r.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};
