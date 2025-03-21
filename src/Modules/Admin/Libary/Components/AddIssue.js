import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooksThunk,
  issueBookThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { Select, Radio, DatePicker, Button, Input } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { FaSchool } from "react-icons/fa";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";
import { fetchNoticeUsersThunk } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";

const { Option } = Select;

/**
 * A simple fuzzy search helper.
 * Checks if all characters in 'search' appear in order in 'text'.
 */
const fuzzySearch = (search, text) => {
  search = search.toLowerCase();
  text = text.toLowerCase();
  let j = 0;
  for (let i = 0; i < text.length && j < search.length; i++) {
    if (text[i] === search[j]) {
      j++;
    }
  }
  return j === search.length;
};

/**
 * Role options for filtering.
 * The admin role is commented out. Uncomment the line below to enable it in the future.
 */
const roleOptions = [
  { value: "all", label: "All" },
  // { value: "admin", label: "Admin" }, // Admin role removed; uncomment to re-enable in future
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "finance", label: "Finance" },
  { value: "librarian", label: "Librarian" },
  { value: "teacher", label: "Teacher" },
  { value: "staff", label: "Staff" },
];

const AddIssue = ({ onClose, editIssueData }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();

  // Redux state
  const { books } = useSelector((state) => state.admin.library);
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const classList = useSelector((state) => state.admin.class.classes);
  const { noticeUsers } = useSelector((state) => state.admin.notice);
  const { loading } = useSelector((state) => state.admin.students);

  // Local form state
  const [issueData, setIssueData] = useState({
    class: "",
    section: "",
    user: "",
    book: "",
    authorName: "",
    issueDate: "",
    returnDate: "",
    status: "Pending",
  });

  // Local role filter state for users
  const [selectedRole, setSelectedRole] = useState("all");

  // Local submitting state for the button
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchNoticeUsersThunk());
  }, [dispatch]);

  // Pre-populate form if editing
  useEffect(() => {
    if (editIssueData) {
      setIssueData({
        class: editIssueData.classId?._id || "",
        section: editIssueData.sectionId?._id || "",
        user: editIssueData.issuedTo?.userId?._id || "",
        book: editIssueData.bookId?._id || "",
        authorName: editIssueData.author || "",
        issueDate: editIssueData.issueDate
          ? editIssueData.issueDate.slice(0, 10)
          : "",
        returnDate: editIssueData.returnDate
          ? editIssueData.returnDate.slice(0, 10)
          : "",
        status: editIssueData.status || "Pending",
      });
      if (editIssueData.classId?._id) {
        dispatch(fetchSectionsNamesByClass(editIssueData.classId._id));
      }
    } else {
      setIssueData({
        class: "",
        section: "",
        user: "",
        book: "",
        authorName: "",
        issueDate: "",
        returnDate: "",
        status: "Pending",
      });
    }
  }, [editIssueData, dispatch]);

  // Handle native input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssueData((prev) => ({ ...prev, [name]: value }));
  };

  // When a book is selected, auto-fill the authorName field
  const handleBookChange = (bookId) => {
    setIssueData((prev) => ({ ...prev, book: bookId }));
    const selectedBook = books?.find((b) => b._id === bookId);
    if (selectedBook) {
      setIssueData((prev) => ({
        ...prev,
        authorName: selectedBook.author,
      }));
    }
  };

  // Handle antd Select changes
  const handleSelectChange = (name, value) => {
    if (name === "class") {
      dispatch(fetchSectionsNamesByClass(value));
    }
    setIssueData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status changes via radio buttons
  const handleStatusChange = (e) => {
    setIssueData((prev) => ({ ...prev, status: e.target.value }));
  };

  // Handle date changes using DatePicker
  const handleDateChange = (name, dateObj) => {
    if (dateObj && dateObj.isValid?.()) {
      setIssueData((prev) => ({
        ...prev,
        [name]: dateObj.format("YYYY-MM-DD"),
      }));
    } else {
      setIssueData((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Filter out any user whose role is 'admin', then apply role-based filter using fuzzy search
  const filteredUsers =
    noticeUsers
      ?.filter((user) => user.role?.toLowerCase() !== "admin")
      .filter((user) =>
        selectedRole === "all"
          ? true
          : user.role?.toLowerCase() === selectedRole.toLowerCase()
      ) || [];

  // Submit handler with loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const selectedUser = noticeUsers?.find(
      (usr) => usr.userId === issueData.user
    );
    const userRole = selectedUser ? selectedUser.role : "";
    const submissionData = {
      id: editIssueData ? editIssueData._id : null,
      status: issueData.status,
      returnDate: issueData.returnDate,
      issueDate: issueData.issueDate,
      author: issueData.authorName,
      bookId: issueData.book,
      userId: issueData.user,
      userType: userRole,
      sectionId: issueData.section,
      classId: issueData.class,
    };
    try {
      await dispatch(issueBookThunk(submissionData)).unwrap();
    } catch (error) {
      // Handle error if needed
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <form className="flex flex-col h-full space-y-6" onSubmit={handleSubmit}>
      <div className="flex-1 overflow-auto no-scrollbar px-5 space-y-4">
        {/* Role Filter for Users */}
        <div>
          <label
            htmlFor="roleFilter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Filter by Role")}
          </label>
          <Select
            id="roleFilter"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
            placeholder={t("Select Role")}
            style={{ width: "100%" }}
            size="large"
          >
            {roleOptions?.map((roleOption) => (
              <Option key={roleOption.value} value={roleOption.value}>
                {t(roleOption.label)}
              </Option>
            ))}
          </Select>
        </div>
        {/* Conditionally render Class & Section side by side if role is 'student' */}
        {selectedRole === "student" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="class"
                className="block text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                <FaSchool /> {t("Class")}
              </label>
              <Select
                id="class"
                name="class"
                value={issueData.class}
                onChange={(value) => handleSelectChange("class", value)}
                placeholder={t("Select Class")}
                style={{ width: "100%" }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                required
              >
                {classList?.map((cls) => (
                  <Option key={cls._id} value={cls._id}>
                    {cls.className}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="section"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Section")}
              </label>
              <Select
                id="section"
                name="section"
                value={issueData.section}
                onChange={(value) => handleSelectChange("section", value)}
                placeholder={t("Select Section")}
                style={{ width: "100%" }}
                size="large"
                disabled={loading}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sectionList?.map((section) => (
                  <Option key={section._id} value={section._id}>
                    {section.sectionName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
        {/* User Field */}
        <div>
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            {t("User")}
          </label>
          <Select
            id="user"
            name="user"
            value={issueData.user}
            onChange={(value) => handleSelectChange("user", value)}
            placeholder={t("Select User")}
            style={{ width: "100%" }}
            size="large"
            showSearch
            optionFilterProp="data-search"
            filterOption={(input, option) =>
              option.props["data-search"] &&
              fuzzySearch(input, option.props["data-search"])
            }
            required
          >
            {filteredUsers?.map((usr) => {
              const searchString = `${usr.name} ${usr.role} ${
                usr.admissionNumber || ""
              }`;
              return (
                <Option
                  key={usr.userId}
                  value={usr.userId}
                  data-search={searchString}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        usr.profile ||
                        "https://via.placeholder.com/20?text=No+Image"
                      }
                      alt={usr.name}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>{usr.name}</span>
                    <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      {usr.role}
                    </span>
                    {usr.role?.toLowerCase() === "student" && (
                      <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
                        {usr.admissionNumber || "N/A"}
                      </span>
                    )}
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>
        {/* Book Field */}
        <div>
          <label
            htmlFor="book"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Book")}
          </label>
          <Select
            id="book"
            name="book"
            value={issueData.book}
            onChange={handleBookChange}
            placeholder={t("Select Book")}
            style={{ width: "100%" }}
            size="large"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {books?.map((b) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </div>
        {/* Author Name using AntD Input (read-only) */}
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Author Name")}
          </label>
          <Input
            id="authorName"
            name="authorName"
            value={issueData.authorName}
            onChange={handleInputChange}
            size="large"
            placeholder={t("Enter author name")}
            disabled
            readOnly
          />
        </div>
        {/* Issue Date & Return Date side by side using DatePicker */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="issueDate"
              className="block text-sm font-medium text-gray-700 flex items-center gap-1"
            >
              <FiCalendar /> {t("Issue Date")}
            </label>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="dd-mm-yyyy"
              format="DD-MM-YYYY"
              value={
                issueData.issueDate
                  ? moment(issueData.issueDate, "YYYY-MM-DD")
                  : null
              }
              onChange={(dateObj) => handleDateChange("issueDate", dateObj)}
              allowClear
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="returnDate"
              className="block text-sm font-medium text-gray-700 flex items-center gap-1"
            >
              <FiClock /> {t("Return Date")}
            </label>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="dd-mm-yyyy"
              format="DD-MM-YYYY"
              value={
                issueData.returnDate
                  ? moment(issueData.returnDate, "YYYY-MM-DD")
                  : null
              }
              onChange={(dateObj) => handleDateChange("returnDate", dateObj)}
              allowClear
              required
            />
          </div>
        </div>
        {/* Status as Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <FiAlertCircle /> {t("Status")}
          </label>
          <Radio.Group
            onChange={handleStatusChange}
            value={issueData.status}
            size="large"
          >
            <Radio value="Pending">
              <span className="flex items-center gap-1">{t("Pending")}</span>
            </Radio>
            <Radio value="Returned">
              <span className="flex items-center gap-1">{t("Returned")}</span>
            </Radio>
          </Radio.Group>
        </div>
      </div>
      {/* Submit Button with loading state */}
      <div className="sticky bottom-0 w-full bg-white pb-3 px-5">
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          disabled={submitting}
          block
          size="large"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
        >
          {editIssueData ? t("Edit Book Issue") : t("Add Book Issue")}
        </Button>
      </div>
    </form>
  );
};

export default AddIssue;
