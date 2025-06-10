import React, { memo, useCallback } from "react";
import { Radio } from "antd";

const AssignToRadios = ({
  assignTo,
  handleChange,
  title = "Assign To",
  isAssignToLabel = true,
}) => {
  const fieldName = isAssignToLabel ? "postTo" : "assignTo";

  const onRadioChange = useCallback(
    (e) => handleChange({ target: { name: fieldName, value: e.target.value } }),
    [handleChange, fieldName]
  );

  return (
    <div className="mb-4">
      <p className="mb-2 text-lg font-semibold text-gray-700">{title}</p>
      <Radio.Group
        name={fieldName}
        value={assignTo}
        onChange={onRadioChange}
        optionType="button"
        buttonStyle="solid"
        className="flex justify-evenly"
      >
        <Radio.Button value="Everyone">Everyone</Radio.Button>
        <Radio.Button value="Section">Section</Radio.Button>
        {/* Uncomment for future functionality */}
        {/* <Radio.Button value="Group">Group</Radio.Button> */}
      </Radio.Group>
    </div>
  );
};

export default memo(AssignToRadios);
