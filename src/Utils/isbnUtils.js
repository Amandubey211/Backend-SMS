// utils/isbnUtils.js
export const generateValid13DigitISBN = () => {
  const prefix = "978";
  const randomDigits = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");
  const isbn12 = prefix + randomDigits;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn12[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return isbn12 + checkDigit;
};

export const validateISBN = (isbn) => {
  const cleanISBN = isbn.replace(/\D/g, "");
  return /^(97[89]\d{10})$/.test(cleanISBN);
};
