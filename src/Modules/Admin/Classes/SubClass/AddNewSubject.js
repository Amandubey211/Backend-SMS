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
  "#FCD34D",
  "#93C5FD",
  "#6EE7B7",
  "#FCA5A5",
  "#D8B4FE",
  "#F9A8D4",
  "#A5B4FC",
  "#FDBA74",
  "#6EE7C9",
  "#67E8F9",
  "#D9F99D",
  "#FBBF24",
  "#34D399",
  "#F472B6",
  "#C4B5FD",
  "#7DD3FC",
  "#D1D5DB",
];

const AddNewSubject = ({ onClose, subject }) => {
  const { t } = useTranslation("admClass");
  const [activeTab, setActiveTab] = useState("icon");
  const [selectedColor, setSelectedColor] = useState("#FCD34D");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [isOptional, setIsOptional] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  // Local state to track the loading state based on button clicked ("publish" or "save")
  const [activeLoading, setActiveLoading] = useState(null);

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

  useEffect(() => {
    if (subject) {
      setSelectedColor(subject?.subjectColor || "#FCD34D");
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
      if (subject?.isOptional && subject?.studentIds) {
        const preloadedStudentIds = subject.studentIds.map((student) =>
          student._id ? student._id : student
        );
        setSelectedStudentIds(preloadedStudentIds);
      }
    } else {
      setSelectedColor("#FCD34D");
      setSubjectTitle("");
      setIsOptional(false);
      setSelectedStudentIds([]);
      dispatch(selectIcon(null));
    }
  }, [subject, dispatch, icons]);

  // Validation: only ensure the subject has a title
  const validateInputs = useCallback(() => {
    if (!subjectTitle.trim()) {
      toast.error(t("Subject name is required."));
      return false;
    }
    return true;
  }, [subjectTitle, t]);

  const handleSave = (publish = false) => {
    if (!validateInputs()) return;
    // Set local loading state based on which button was clicked
    setActiveLoading(publish ? "publish" : "save");

    const subjectData = {
      name: subjectTitle,
      classId: cid,
      isPublished: publish,
      subjectIcon: selectedIcon?.imageLink,
      subjectColor: selectedColor,
      isOptional,
      ...(isOptional && { studentIds: selectedStudentIds }),
    };

    const action = subject
      ? updateSubject({ subjectId: subject._id, subjectData })
      : createSubject(subjectData);

    dispatch(action)
      .unwrap()
      .then(() => {
        clearForm();
        onClose();
      })
      .catch((error) => {
        // Handle error if necessary
      })
      .finally(() => {
        setActiveLoading(null);
      });
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
            selectedIcon ? selectedIcon._id || selectedIcon.id : null
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

  const isEditing = Boolean(subject);

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      {/* Subject Title */}
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

      {/* Optional Subject Checkbox */}
      <div className="mb-4">
        <Checkbox
          checked={isOptional}
          onChange={(e) => setIsOptional(e.target.checked)}
        >
          {t("Optional Subject")}
        </Checkbox>
      </div>

      {/* Student Selection */}
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

      {/* Tab Navigation */}
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
            className={
              activeTab === "icon"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold"
                : "text-gray-500"
            }
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
            className={
              activeTab === "color"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold"
                : "text-gray-500"
            }
          >
            {t("Frame Color")}
          </span>
        </div>
      </div>

      {/* Tab Content */}
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

      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex justify-between space-x-2 sticky bottom-0 bg-white py-4">
        <button
          onClick={() => handleSave(true)}
          disabled={loading || activeLoading !== null}
          className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          {activeLoading === "publish" ? (
            <ImSpinner3 className="animate-spin mx-auto" />
          ) : isEditing ? (
            t("Update & Publish")
          ) : (
            t("Create & Publish")
          )}
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={loading || activeLoading !== null}
          className="w-full py-2 rounded-md bg-gradient-to-r from-purple-500 to-red-500 text-white"
        >
          {activeLoading === "save" ? (
            <ImSpinner3 className="animate-spin mx-auto" />
          ) : isEditing ? (
            t("Update")
          ) : (
            t("Create")
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
