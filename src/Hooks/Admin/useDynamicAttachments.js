import { useMemo } from "react";
import * as Yup from "yup";

export default function useDynamicAttachments(attachmentsMetaInput) {
  const metaArr = Array.isArray(attachmentsMetaInput)
    ? attachmentsMetaInput
    : [];

  return useMemo(() => {
    /* 1. initialValues - now flattened at root level */
    const initialValues = {
      // Profile pictures at root level
      profile: null,
      studentPicture: null,

      // Dynamic attachments
      ...metaArr.reduce((acc, { name, mandatory }) => {
        if (name) acc[name] = null;
        return acc;
      }, {}),
    };

    /* 2. Yup schema for flattened structure */
    const schemaShape = metaArr.reduce((acc, { name, mandatory }) => {
      if (name) {
        acc[name] = mandatory
          ? Yup.mixed().required("Required file")
          : Yup.mixed().nullable();
      }
      return acc;
    }, {});

    // Add validation for profile pictures
    schemaShape.profile = Yup.mixed().required("Profile picture is required");
    schemaShape.studentPicture = Yup.mixed().required(
      "Student picture is required"
    );

    const attachmentsSchema = Yup.object().shape(schemaShape);

    return {
      attachmentsInitialValues: initialValues,
      attachmentsSchema,
    };
  }, [metaArr]);
}
