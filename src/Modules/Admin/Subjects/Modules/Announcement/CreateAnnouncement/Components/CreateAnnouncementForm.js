import React from "react";
import DateInput from "../../../../Component/DateInput";
import AssignToSection from "../Components/AssignToSection";

const CreateAnnouncementForm = ({
  postTo,
  availableFrom,
  sectionId, // array
  groupId, // array
  author,
  handleChange,
  formErrors = {},
  authorRef,
}) => {
  return (
    <div>
      <AssignToSection
        groupId={groupId}
        assignTitle="Post To"
        assignTo={postTo}
        sectionId={sectionId}
        handleChange={handleChange}
        formErrors={formErrors}
      />
      <div className="mb-4">
        <label htmlFor="author" className="text-gray-500 mb-1">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          id="author"
          type="text"
          name="author"
          onChange={handleChange}
          value={author}
          placeholder="Type Name"
          ref={authorRef}
          className={`p-2 rounded w-full border ${
            formErrors.author ? "border-red-500" : "border-gray-300"
          }`}
        />
        {formErrors.author && (
          <p className="text-red-500 text-sm mt-1">{formErrors.author}</p>
        )}
      </div>
      <DateInput
        label="Scheduled Post"
        name="availableFrom"
        value={availableFrom}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CreateAnnouncementForm;
