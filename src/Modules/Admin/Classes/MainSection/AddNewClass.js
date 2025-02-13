import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import IconGrid from "./IconGrid";
import CreateEditIconModal from "./CreateEditIconModal";
import { useTranslation } from "react-i18next";
import {
  createClass,
  updateClass,
} from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";
import { fetchAllIcons } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";

const AddNewClass = ({ classData, isUpdate, onClose }) => {
  const { t } = useTranslation("admClass");
  const [newClassName, setNewClassName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showClassNameError, setShowClassNameError] = useState(false);

  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  const { loading } = useSelector((store) => store.admin.class);
  const dispatch = useDispatch();

  // Fetch icons on mount (for type "Class")
  useEffect(() => {
    dispatch(fetchAllIcons({ type: "Class" }));
  }, [dispatch]);

  // Preload data when editing a class
  useEffect(() => {
    if (isUpdate && classData) {
      setNewClassName(classData.className);
      if (classData.classIcons) {
        // Determine the icon ID whether classIcons is stored as an object or a string
        const classIconId =
          typeof classData.classIcons === "object"
            ? classData.classIcons._id
            : classData.classIcons;
        if (icons && icons.length > 0) {
          const matchingIcon = icons.find((icon) => icon._id === classIconId);
          dispatch(selectIcon(matchingIcon || classData.classIcons));
        } else {
          dispatch(selectIcon(classData.classIcons));
        }
      } else {
        dispatch(selectIcon(null));
      }
    } else {
      setNewClassName("");
      dispatch(selectIcon(null));
    }
  }, [dispatch, isUpdate, classData, icons]);

  const openModal = (icon = null) => {
    dispatch(selectIcon(icon));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newClassName.trim()) {
      setShowClassNameError(true);
      return;
    }

    // Build classDetails—storing the entire selected icon object (if available)
    const classDetails = { className: newClassName.trim() };
    if (selectedIcon) {
      classDetails.classIcons = selectedIcon;
    }

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
      toast.error(err.message || t("Something went wrong"));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex flex-col justify-start gap-2 mt-5">
          <label htmlFor="className" className="font-semibold">
            {t("Class Name")}
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
            placeholder={t("Type here")}
            aria-label={t("Class Name")}
          />
          {showClassNameError && (
            <span className="text-red-500 text-sm mt-1">
              {t("Class name is required.")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-6 flex-grow">
          <h3 className="font-semibold">{t("Class Icons (Optional)")}</h3>
          <IconGrid
            icons={icons}
            activeIcon={selectIcon?._id}
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
              ? t("Processing...")
              : isUpdate
              ? t("Update Class")
              : t("Add New Class")}
          </button>
        </div>
      </form>

      {isModalOpen && <CreateEditIconModal onClose={closeModal} type="Class" />}
    </div>
  );
};

export default AddNewClass;
