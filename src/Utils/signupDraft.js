/** Simple helpers for persisting the wizard state */
const KEY = "studentSignupDraft";

export const loadDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null") || null;
  } catch {
    return null;
  }
};

export const saveDraft = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};

export const clearDraft = () => localStorage.removeItem(KEY);
