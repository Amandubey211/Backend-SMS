/** Convert a Yup ValidationError to Ant Design’s setFields format */
export const setYupErrorsToAnt = (form, yupError) => {
  if (!yupError.inner || !yupError.inner.length) return;

  form.setFields(
    yupError.inner.map((e) => ({
      name: e.path.split("."),
      errors: [e.message],
    }))
  );
};
