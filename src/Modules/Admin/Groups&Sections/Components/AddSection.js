import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useCreateSection from "../../../../Hooks/AuthHooks/Staff/Admin/Sections/useCreateSection";
import toast from "react-hot-toast";

const AddSection = ({ initialSection = null, onSubmitSuccess, onCancel }) => {
  const [sectionName, setSectionName] = useState(initialSection?.sectionName || "");
  const { cid } = useParams();
  const { createSection, updateSection, loading, error } = useCreateSection();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sectionData = {
      sectionName,
      classId: cid,
    };
    
    if (initialSection) {
      // Update section
      await updateSection({
        ...sectionData,
        sectionId: initialSection._id, // Pass sectionId for updating
      });
    } else {
      // Create new section
      await createSection(sectionData);
    }
    onSubmitSuccess(); // Notify parent of success to refresh list
    onCancel(); // Close the sidebar

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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type Here"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-auto mb-8">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
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
