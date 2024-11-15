import React from "react";
import OptionRadios from "../../../Discussion/AddDiscussion/Components/OptionRadios";
import DateInput from "../../../../Component/DateInput";
import AssignToSection from "../../../Discussion/AddDiscussion/Components/AssignToSection";

const CreateAnnouncementForm = ({
  postTo,
  availableFrom,
  sectionId,
  option,
  handleChange,
  groupId,
  author,
}) => {
  return (
    <div>
      {/* <OptionRadios option={option} handleChange={handleChange} /> */}
      <AssignToSection
        groupId={groupId}
        assignTitle="Post To"
        assignTo={postTo}
        sectionId={sectionId}
        handleChange={handleChange}
      />
      <div className="mb-4">
        <label htmlFor="author" className="text-gray-500 mb-1">
          Author
        </label>
        <input
          id="author"
          type="text"
          name="author"
          onChange={handleChange}
          value={author}
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
