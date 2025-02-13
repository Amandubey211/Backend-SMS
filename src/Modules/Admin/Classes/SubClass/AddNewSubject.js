import React, { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import {
  createSubject,
  updateSubject,
} from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { useTranslation } from "react-i18next";
import { fetchAllIcons } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";
import IconGrid from "../MainSection/IconGrid";
import CreateEditIconModal from "../MainSection/CreateEditIconModal";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";

const dummyColors = [
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-red-300",
  "bg-purple-300",
  "bg-pink-300",
  "bg-indigo-300",
  "bg-orange-300",
  "bg-teal-300",
  "bg-cyan-300",
  "bg-lime-300",
  "bg-amber-300",
  "bg-emerald-300",
  "bg-fuchsia-300",
  "bg-rose-300",
  "bg-violet-300",
  "bg-sky-300",
  "bg-gray-300",
];

const AddNewSubject = ({ onClose, subject }) => {
  const { t } = useTranslation("admClass"); // Use translation hook
  const [activeTab, setActiveTab] = useState("icon");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeIcon, setActiveIcon] = useState(null);
  const [subjectTitle, setSubjectTitle] = useState("");

  const dispatch = useDispatch();
  const { cid } = useParams();
  const { loading } = useSelector((state) => state.admin.subject);
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  useEffect(() => {
    dispatch(fetchAllIcons({ type: "Subject" }));
  }, [dispatch]);

  useEffect(() => {
    if (subject) {
      setSelectedColor(subject?.color || "");
      setActiveIcon(subject?.icon || null);
      setSubjectTitle(subject?.name || "");
    } else {
      resetForm();
    }
  }, [subject]);

  const resetForm = useCallback(() => {
    setSelectedColor("");
    setActiveIcon(null);
    setSubjectTitle("");
  }, []);

  const validateInputs = useCallback(() => {
    if (!subjectTitle.trim()) {
      toast.error(t("Subject name is required."));
      return false;
    }
    return true;
  }, [subjectTitle, t]);

  const hasChanges = () => {
    if (!subject) return false;
    return (
      subjectTitle !== subject.name ||
      selectedColor !== subject.color ||
      activeIcon !== subject.icon
    );
  };

  const handleSave = async (publish = false) => {
    if (!validateInputs()) return;
    const subjectData = {
      name: subjectTitle,
      classId: cid,
      isPublished: publish,
      subjectIcon: selectedIcon?.imageLink,
      subjectColor: selectedColor,
    };

    if (subject) {
      // Dispatch update only if there are changes
      if (!hasChanges()) {
        toast(t("No changes detected."));
        return;
      }
      dispatch(updateSubject({ subjectId: subject._id, subjectData }));
    } else {
      dispatch(createSubject(subjectData));
    }
    onClose();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (icon = null) => {
    dispatch(selectIcon(icon));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveIcon(null);
  };

  const iconGrid = useMemo(
    () => (
      <div className="flex flex-col gap-2  flex-grow w-full ">
        <IconGrid
          icons={icons}
          activeIcon={selectIcon?._id}
          onEdit={openModal}
        />
      </div>
    ),
    [selectedIcon, t]
  );

  const colorGrid = useMemo(
    () =>
      dummyColors?.map((color, index) => (
        <button
          key={index}
          onClick={() => {
            console.log(color);
            setSelectedColor(color);
          }}
          className={`w-12 h-12 rounded-full border-2 ${color} focus:outline-none transition duration-300 ease-in-out ${
            selectedColor === color ? "border-black" : "border-transparent"
          }`}
          aria-pressed={selectedColor === color}
          aria-label={t("Select color", { color })}
        />
      )),
    [selectedColor, t]
  );

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-4">
        <label
          htmlFor="subject-title"
          className="block text-sm font-medium text-gray-700"
        >
          {t("Subject Title")}
        </label>
        <input
          type="text"
          id="subject-title"
          value={subjectTitle}
          onChange={(e) => setSubjectTitle(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={t("Type here")}
        />
      </div>

      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${
            activeTab === "icon"
              ? "border-b-2 border-indigo-500 text-indigo-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("icon")}
          aria-controls="icon-tab"
        >
          {t("Subject Icon")}
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === "color"
              ? "border-b-2 border-indigo-500 text-indigo-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("color")}
          aria-controls="color-tab"
        >
          {t("Frame Color")}
        </button>
      </div>

      <div
        className={`flex flex-row p-2 w-full ${
          activeTab === "icon" ? "block" : "hidden"
        }`}
      >
        {iconGrid}
      </div>
      <div
        className={`grid grid-cols-6 gap-2 ${
          activeTab === "color" ? "block" : "hidden"
        }`}
      >
        {colorGrid}
      </div>

      <div className="mt-auto pt-4 flex justify-between space-x-2 sticky bottom-0 bg-white py-4">
        <button
          onClick={() => handleSave(true)}
          className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          disabled={loading}
        >
          {loading ? (
            <ImSpinner3 className="animate-spin mx-auto" />
          ) : (
            t("Save & Publish")
          )}
        </button>
        <button
          onClick={() => handleSave(false)}
          className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-red-500 text-white"
          disabled={loading}
        >
          {loading ? (
            <ImSpinner3 className="animate-spin mx-auto" />
          ) : (
            t("Save")
          )}
        </button>
      </div>
      {isModalOpen && (
        <CreateEditIconModal onClose={closeModal} type={"Subject"} />
      )}
    </div>
  );
};

export default AddNewSubject;
