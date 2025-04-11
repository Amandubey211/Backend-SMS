import * as Yup from "yup";

export const studentAdmissionValidationSchema = (stepIndex) => {
  // You can conditionally build a schema for each step
  switch (stepIndex) {
    case 0:
      // Personal Info
      return Yup.object().shape({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        dateOfBirth: Yup.string().required("Date of Birth is required"),
        gender: Yup.string().required("Gender is required"),
        religion: Yup.string().required("Religion is required"),
        bloodGroup: Yup.string().required("Blood group is required"),
        // ...
      });

    case 1:
      // Address Info
      return Yup.object().shape({
        contactNumber: Yup.string().required("Contact Number is required"),
        emergencyNumber: Yup.string().required("Emergency Number is required"),
        email: Yup.string().email("Invalid email").required("Email required"),
        Q_Id: Yup.string()
          .required("QID required")
          .min(11, "QID must be 11 digits"),
        permanentAddress: Yup.object().shape({
          street: Yup.string().required("Street required"),
          city: Yup.string().required("City required"),
          state: Yup.string().required("State required"),
          postalCode: Yup.string().required("Postal Code required"),
          country: Yup.string().required("Country required"),
        }),
        // ...
      });

    case 2:
      // Admission Info
      return Yup.object().shape({
        applyingClass: Yup.string().required("Please select a class"),
        enrollmentStatus: Yup.string().required("Select enrollment status"),
        // ...
      });

    case 3:
      // Parent Info
      return Yup.object().shape({
        fatherName: Yup.string().required("Father name is required"),
        motherName: Yup.string().required("Mother name is required"),
        guardianName: Yup.string().required("Guardian name is required"),
        guardianRelationToStudent: Yup.string().required(
          "Relation to student is required"
        ),
        guardianContactNumber: Yup.string().required(
          "Guardian contact is required"
        ),
        guardianEmail: Yup.string()
          .email("Invalid email")
          .required("Guardian email is required"),
        // ...
      });

    case 4:
      // Documents
      return Yup.object().shape({
        // For a minimal check: user must upload at least 1 file or profile image
        profile: Yup.mixed().required("Profile image is required"),
        // If you need docs mandatory, handle them here
        // documents: ...
      });

    case 5:
      // Confirm step: can be minimal if you want final confirmation
      return Yup.object().shape({});

    default:
      return Yup.object().shape({});
  }
};
