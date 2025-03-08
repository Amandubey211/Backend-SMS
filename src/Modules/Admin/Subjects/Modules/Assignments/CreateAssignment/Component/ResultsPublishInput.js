// ResultsPublishInput.jsx

import React, { useEffect } from "react";
import DateInput from "../../../../Component/DateInput";

const ResultsPublishInput = ({
  resultsPublished,
  resultsPublishDate,
  handleChange,
  errorResultsPublishDate,
}) => {
  // When immediate publishing is checked, clear the date value
  useEffect(() => {
    if (resultsPublished && resultsPublishDate) {
      handleChange({
        target: { name: "resultsPublishDate", value: "" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsPublished]);

  return (
    <div className="mb-4">
      <div>
        <label className="block text-gray-700">
          <input
            type="checkbox"
            name="resultsPublished"
            checked={resultsPublished}
            onChange={(e) =>
              handleChange({
                target: { name: "resultsPublished", value: e.target.checked },
              })
            }
          />
          <span className="ml-2">Publish Results Immediately</span>
        </label>
      </div>
      <div className="mt-2">
        <DateInput
          label="Results Publish Date"
          name="resultsPublishDate"
          value={resultsPublishDate}
          handleChange={handleChange}
          error={errorResultsPublishDate}
          fieldId="resultsPublishDate"
          disabled={resultsPublished} // Disable when immediate publishing is selected
        />
      </div>
      {!resultsPublished && (
        <p className="text-sm text-gray-600 mt-1">
          Please select a future date for scheduled publishing.
        </p>
      )}
      {resultsPublished && (
        <p className="text-sm text-gray-600 mt-1">
          Immediate publishing is selected; the date will be ignored.
        </p>
      )}
    </div>
  );
};

export default ResultsPublishInput;
