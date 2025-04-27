// hooks/useDynamicAttachments.js
import { useMemo } from "react";
import * as Yup from "yup";

/**
 * Convert anything that isn’t exactly "mandatory" into "optional".
 * Ensures we never write to an undefined object key.
 */
const normalizeCategory = (cat) =>
  cat === "mandatory" ? "mandatory" : "optional";

export default function useDynamicAttachments(attachmentsMetaInput) {
  // Guarantee we always iterate over an array
  const metaArr = Array.isArray(attachmentsMetaInput)
    ? attachmentsMetaInput
    : [];

  return useMemo(() => {
    /* ---------- 1. initialValues ---------- */
    const initialValues = { mandatory: {}, optional: {} };

    metaArr.forEach(({ key, category }) => {
      if (!key) return; // skip malformed entry
      const cat = normalizeCategory(category);
      initialValues[cat][key] = null;
    });

    /* ---------- 2. Yup schema ------------- */
    const mandatoryShape = {};
    const optionalShape = {};

    metaArr.forEach(({ key, category }) => {
      if (!key) return;
      const cat = normalizeCategory(category);
      const isMandatory = cat === "mandatory";
      const target = isMandatory ? mandatoryShape : optionalShape;
      target[key] = isMandatory
        ? Yup.mixed().required("Required file")
        : Yup.mixed().nullable();
    });

    const attachmentsSchema = Yup.object().shape({
      attachments: Yup.object().shape({
        mandatory: Yup.object().shape(mandatoryShape),
        optional: Yup.object().shape(optionalShape),
      }),
    });

    return {
      attachmentsInitialValues: initialValues,
      attachmentsSchema,
    };
  }, [metaArr]);
}
