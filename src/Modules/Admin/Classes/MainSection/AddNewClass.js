import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import IconGrid from "./IconGrid";
import CreateEditIconModal from "./CreateEditIconModal";
import {
  createClass,
  updateClass,
} from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";
import { fetchAllIcons } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";

const AddNewClass = ({ classData, isUpdate, onClose }) => {
  const [newClassName, setNewClassName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClassNameError, setShowClassNameError] = useState(false);
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  const { loading } = useSelector((store) => store.admin.class);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllIcons());

    if (isUpdate && classData) {
      setNewClassName(classData.className);
      dispatch(selectIcon(classData?.classIcons || null)); // Set initial icon selection if updating
    } else {
      setNewClassName("");
      dispatch(selectIcon(null));
    }
  }, [dispatch, isUpdate, classData]);

  const openModal = (icon = null) => {
    dispatch(selectIcon(icon));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(selectIcon(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newClassName) {
      setShowClassNameError(true);
      return;
    }

    if (!selectedIcon) {
      toast.error("Please select an icon.");
      return;
    }

    const classDetails = { className: newClassName, classIcons: selectedIcon };
    try {
      if (isUpdate) {
        await dispatch(
          updateClass({ classData: classDetails, classId: classData._id })
        );
        onClose();
      } else {
        await dispatch(createClass(classDetails));
        setNewClassName("");
        dispatch(selectIcon(null));
        setShowClassNameError(false);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex flex-col justify-start gap-2 mt-5">
          <label htmlFor="className" className="font-semibold">
            Class Name
          </label>
          <input
            id="className"
            value={newClassName}
            onChange={(e) => {
              setNewClassName(e.target.value);
              setShowClassNameError(false);
            }}
            className={`mt-1 block w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              showClassNameError ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="Type here"
            aria-label="Class Name"
          />
          {showClassNameError && (
            <span className="text-red-500 text-sm mt-1">
              Class name is required.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-6 flex-grow">
          <h3 className="font-semibold">Class Icons</h3>
          <IconGrid
            icons={icons}
            activeIconId={
              selectedIcon ||
              (classData?.classIcons && classData?.classIcons._id)
            }
            onEdit={openModal}
          />
        </div>

        <div className="mb-9">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading
              ? "Processing..."
              : isUpdate
              ? "Update Class"
              : "Add New Class"}
          </button>
        </div>
      </form>

      {isModalOpen && <CreateEditIconModal onClose={closeModal} />}
    </div>
  );
};

export default AddNewClass;
