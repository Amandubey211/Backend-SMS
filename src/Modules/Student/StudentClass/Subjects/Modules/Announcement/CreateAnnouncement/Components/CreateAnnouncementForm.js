import React from "react";
import OptionRadios from "../../../Discussion/AddDiscussion/Components/OptionRadios";
import DateInput from "../../../../Component/DateInput";
import AssignToSection from "../../../Discussion/AddDiscussion/Components/AssignToSection";

const CreateAnnouncementForm = ({
  assignTo,
  availableFrom,
  section,
  option,
  handleChange,
}) => {
  return (
    <div>
      <OptionRadios option={option} handleChange={handleChange} />
      <AssignToSection
        assignTitle="Post To"
        assignTo={assignTo}
        section={section}
        handleChange={handleChange}
      />

      <DateInput
        label="Delay Posting"
        name="availableFrom"
        value={availableFrom}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CreateAnnouncementForm;
