import React from "react";
import { useFormikContext } from "formik";

const ConfirmStep = ({ stepRef }) => {
  const { values } = useFormikContext();

  // Display final summary or disclaimers, etc.

  return (
    <div ref={stepRef}>
      <h3 className="text-xl font-semibold mb-2">Confirm Information</h3>
      <p className="text-gray-600 mb-4">Please review the details below:</p>

      <ul className="text-sm leading-6 space-y-1">
        <li>
          <strong>Name:</strong> {values.firstName} {values.lastName}
        </li>
        <li>
          <strong>Email:</strong> {values.email}
        </li>
        <li>
          <strong>Applying Class:</strong> {values.applyingClass}
        </li>
        {/* ... more fields as needed */}
      </ul>

      <p className="mt-4 text-red-500">
        By clicking <strong>Submit All</strong>, you confirm that all the above
        information is correct.
      </p>
    </div>
  );
};

export default ConfirmStep;
