import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Select, Checkbox, Avatar, Tag, ColorPicker } from "antd";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import { FaPalette } from "react-icons/fa";
import {
  createSubject,
  updateSubject,
} from "../../../../Store/Slices/Admin/Class/Subject/subjectThunks";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { useTranslation } from "react-i18next";
import { fetchAllIcons } from "../../../../Store/Slices/Admin/Class/actions/iconThunk";
import IconGrid from "../MainSection/IconGrid";
import CreateEditIconModal from "../MainSection/IconGrid";
import { selectIcon } from "../../../../Store/Slices/Admin/Class/reducer/iconSlice";

const { Option } = Select;

const presetColors = [
  "#FCD34D", // yellow-300
  "#93C5FD", // blue-300
  "#6EE7B7", // green-300
  "#FCA5A5", // red-300
  "#D8B4FE", // purple-300
  "#F9A8D4", // pink-300
  "#A5B4FC", // indigo-300
  "#FDBA74", // orange-300
  "#6EE7C9", // teal-300
  "#67E8F9", // cyan-300
  "#D9F99D", // lime-300
  "#FBBF24", // amber-300
  "#34D399", // emerald-300
  "#F472B6", // fuchsia-300
  "#C4B5FD", // violet-300
  "#7DD3FC", // sky-300
  "#D1D5DB", // gray-300
];

const AddNewSubject = ({ onClose, subject }) => {
  const { t } = useTranslation("admClass");
  const [activeTab, setActiveTab] = useState("icon");
  // Default selected color is now "#FCD34D"
  const [selectedColor, setSelectedColor] = useState("#FCD34D");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [isOptional, setIsOptional] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const dispatch = useDispatch();
  const { cid } = useParams();
  const { loading } = useSelector((state) => state.admin.subject);
  const { icons, selectedIcon } = useSelector(
    (state) => state.admin.classIcons
  );
  const { studentsList, loading: studentsLoading } = useSelector(
    (state) => state.admin.students
  );

  useEffect(() => {
    dispatch(fetchAllIcons({ type: "Subject" }));
  }, [dispatch]);

  useEffect(() => {
    if (cid) {
      dispatch(fetchStudentsByClassAndSection(cid));
    }
  }, [dispatch, cid]);

  // Pre-populate values when editing
  useEffect(() => {
    if (subject) {
      setSelectedColor(subject?.subjectColor || "");
      setIsOptional(subject?.isOptional || false);

      if (subject?.subjectIcon) {
        let matchingIcon = null;
        if (typeof subject.subjectIcon === "object") {
          const subjectIconId =
            subject.subjectIcon._id || subject.subjectIcon.id;
          if (icons && icons.length > 0) {
            matchingIcon = icons.find(
              (icon) => (icon._id || icon.id) === subjectIconId
            );
          }
        } else if (icons && icons.length > 0) {
          matchingIcon = icons.find(
            (icon) => icon.imageLink === subject.subjectIcon
          );
        }
        dispatch(selectIcon(matchingIcon || subject.subjectIcon));
      } else {
        dispatch(selectIcon(null));
      }

      setSubjectTitle(subject?.name || "");

      // If optional, pre-select students (mapping objects to their _id)
      if (subject?.isOptional && subject?.studentIds) {
        const preloadedStudentIds = subject.studentIds.map((student) =>
          student._id ? student._id : student
        );
        setSelectedStudentIds(preloadedStudentIds);
      }
    } else {
      // When no subject is provided, ensure default selected color is "#FCD34D"
      setSelectedColor("#FCD34D");
      setSubjectTitle("");
      setIsOptional(false);
      setSelectedStudentIds([]);
      dispatch(selectIcon(null));
    }
  }, [subject, dispatch, icons]);

  const validateInputs = useCallback(() => {
    if (!subjectTitle.trim()) {
      toast.error(t("Subject name is required."));
      return false;
    }
    if (isOptional && selectedStudentIds.length === 0) {
      toast.error(
        t("Please select at least one student for an optional subject.")
      );
      return false;
    }
    return true;
  }, [subjectTitle, isOptional, selectedStudentIds, t]);

  const hasChanges = () => {
    if (!subject) return true;
    const iconChanged =
      (selectedIcon?.imageLink || null) !==
      (subject.subjectIcon?.imageLink || subject.subjectIcon || null);
    const studentChanged = isOptional
      ? JSON.stringify(selectedStudentIds) !==
        JSON.stringify(subject.studentIds)
      : false;
    return (
      subjectTitle !== subject.name ||
      selectedColor !== subject.subjectColor ||
      iconChanged ||
      isOptional !== subject.isOptional ||
      studentChanged
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
      isOptional,
      ...(isOptional && { studentIds: selectedStudentIds }),
    };

    if (subject) {
      if (!hasChanges()) {
        toast(t("No changes detected."));
        return;
      }
      dispatch(updateSubject({ subjectId: subject._id, subjectData }))
        .unwrap()
        .then((res) => {
          clearForm();
          onClose();
        });
    } else {
      dispatch(createSubject(subjectData))
        .unwrap()
        .then((res) => {
          clearForm();
          onClose();
        });
    }
  };

  const clearForm = () => {
    setSelectedColor("#FCD34D");
    setSubjectTitle("");
    setIsOptional(false);
    setSelectedStudentIds([]);
    dispatch(selectIcon(null));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (icon = null) => {
    dispatch(selectIcon(icon));
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const iconGrid = useMemo(
    () => (
      <div className="flex flex-col gap-2 flex-grow w-full">
        <IconGrid
          icons={icons}
          activeIconId={
            selectedIcon
              ? selectedIcon._id || selectedIcon.id || selectedIcon
              : null
          }
          onEdit={openModal}
          type="Subject"
        />
      </div>
    ),
    [icons, selectedIcon, openModal]
  );

  const renderColorOptions = () => (
    <div className="grid grid-cols-6 gap-2">
      {presetColors.map((color, index) => (
        <button
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`w-12 h-12 rounded-full border-2 focus:outline-none transition duration-300 ease-in-out ${
            selectedColor === color ? "border-black" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
          aria-label={t("Select color")}
        />
      ))}
      <div
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer ${
          !presetColors.includes(selectedColor) && selectedColor
            ? "border-black"
            : "border-transparent"
        }`}
      >
        <ColorPicker
          value={selectedColor || "#ffffff"}
          onChange={(color) => setSelectedColor(color.toHexString())}
          placement="bottomRight"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <FaPalette size={18} />
        </ColorPicker>
      </div>
    </div>
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
          className="mt-1 block w-full p-3 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={t("Type here")}
        />
      </div>

      <div className="mb-4">
        <Checkbox
          checked={isOptional}
          onChange={(e) => setIsOptional(e.target.checked)}
        >
          {t("Optional Subject")}
        </Checkbox>
      </div>

      {isOptional && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("Select Students")}
          </label>
          <Select
            mode="multiple"
            showSearch
            placeholder={t("Search: Name or Admission")}
            value={selectedStudentIds}
            onChange={(value) => setSelectedStudentIds(value)}
            loading={studentsLoading}
            style={{ width: "100%" }}
            size="large"
            filterOption={(input, option) =>
              option.fullName.toLowerCase().includes(input.toLowerCase()) ||
              option.admission.toLowerCase().includes(input.toLowerCase())
            }
          >
            {studentsList &&
              studentsList.map((student) => (
                <Option
                  key={student._id}
                  value={student._id}
                  label={`${student.firstName} ${student.lastName}`}
                  fullName={`${student.firstName} ${student.lastName}`}
                  admission={`${student.admissionNumber}`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Avatar src={student.profile} size="small" />
                      <span>
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                    <Tag>{student.admissionNumber}</Tag>
                  </div>
                </Option>
              ))}
          </Select>
        </div>
      )}

      <div className="flex mb-4">
        <div
          className="flex-1 py-2 text-center cursor-pointer"
          onClick={() => setActiveTab("icon")}
          style={{
            borderBottom:
              activeTab === "icon" ? "2px solid" : "2px solid transparent",
            borderImage:
              activeTab === "icon"
                ? "linear-gradient(to right, #ec4899, #8b5cf6) 1"
                : "none",
          }}
        >
          <span
            className={`${
              activeTab === "icon"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {t("Subject Icon")}
          </span>
        </div>
        <div
          className="flex-1 py-2 text-center cursor-pointer"
          onClick={() => setActiveTab("color")}
          style={{
            borderBottom:
              activeTab === "color" ? "2px solid" : "2px solid transparent",
            borderImage:
              activeTab === "color"
                ? "linear-gradient(to right, #ec4899, #8b5cf6) 1"
                : "none",
          }}
        >
          <span
            className={`${
              activeTab === "color"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {t("Frame Color")}
          </span>
        </div>
      </div>

      <div
        className={`flex flex-row p-2 w-full ${
          activeTab === "icon" ? "block" : "hidden"
        }`}
      >
        {iconGrid}
      </div>

      <div
        className={`flex flex-col items-center gap-2 ${
          activeTab === "color" ? "block" : "hidden"
        }`}
      >
        {renderColorOptions()}
        <div
          className="flex items-center justify-center w-32 h-14 mt-2 border rounded-md"
          style={{ backgroundColor: selectedColor || "#fff" }}
        >
          <span className="text-sm font-semibold">
            {selectedColor || "#ffffff"}
          </span>
        </div>
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
        <CreateEditIconModal onClose={closeModal} type="Subject" />
      )}
    </div>
  );
};

export default AddNewSubject;
