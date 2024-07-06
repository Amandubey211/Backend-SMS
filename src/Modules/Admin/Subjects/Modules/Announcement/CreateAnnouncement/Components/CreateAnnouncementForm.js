import React from "react";
import OptionRadios from "../../../Discussion/AddDiscussion/Components/OptionRadios";
import DateInput from "../../../../Component/DateInput";
import AssignToSection from "../../../Discussion/AddDiscussion/Components/AssignToSection";

const CreateAnnouncementForm = ({
  postTo,
  availableFrom,
  section,
  option,
  handleChange,
  groupId,
}) => {
  return (
    <div>
      <OptionRadios option={option} handleChange={handleChange} />
      <AssignToSection
        groupId={groupId}
        assignTitle="Post To"
        assignTo={postTo}
        section={section}
        handleChange={handleChange}
      />
      <div className="mb-4">
        <label htmlFor="topicTitle" className="text-gray-500 mb-1">
          Author
        </label>
        <input
          id="topicTitle"
          type="text"
          name="author"
          onChange={handleChange}
          placeholder="Type Name"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

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
