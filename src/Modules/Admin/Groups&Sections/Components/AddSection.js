import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSection,
  updateSection,
} from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddSection = ({ initialSection = null, onCancel }) => {
  const [sectionName, setSectionName] = useState("");
  const dispatch = useDispatch();
  const { cid } = useParams();
  const { sectionsLoading: loading } = useSelector(
    (state) => state.admin.group_section
  );

  // Reset form when initialSection changes
  useEffect(() => {
    if (initialSection) {
      setSectionName(initialSection.sectionName);
    } else {
      setSectionName(""); // Clear the form when there's no initial section
    }
  }, [initialSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sectionData = { sectionName, classId: cid };

    try {
      if (initialSection) {
        await dispatch(
          updateSection({ sectionId: initialSection._id, sectionData })
        );
      } else {
        await dispatch(createSection(sectionData));
      }
      onCancel();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="mb-4">
            <label
              htmlFor="section-name"
              className="block text-sm font-medium text-gray-700"
            >
              Section Title
            </label>
            <input
              type="text"
              id="section-name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Type Here"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading
            ? initialSection
              ? "Updating Section..."
              : "Adding Section..."
            : initialSection
            ? "Update Section"
            : "Add Section"}
        </button>
      </div>
    </form>
  );
};

export default AddSection;
