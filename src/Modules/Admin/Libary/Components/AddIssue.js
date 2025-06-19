import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooksThunk,
  issueBookThunk,
  fetchBookIssuesThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { Form, Select, Radio, DatePicker, Button, Input } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { FaSchool } from "react-icons/fa";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";
import { fetchAllUsersThunk } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import toast from "react-hot-toast";

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
  const [form] = Form.useForm();

  // Redux state
  const { books } = useSelector((state) => state.admin.library);
  const sectionList = useSelector(
    (state) => state.admin.group_section.sectionsList
  );
  const classList = useSelector((state) => state.admin.class.classes);
  const { allUsers } = useSelector((state) => state.admin.notice);
  const { loading } = useSelector((state) => state.admin.students);

  // Local role filter state for users
  const [selectedRole, setSelectedRole] = useState("all");

  // Local submitting state for the button
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  // Pre-populate form if editing
  useEffect(() => {
    if (editIssueData) {
      form.setFieldsValue({
        class: editIssueData.classId?._id || "",
        section: editIssueData.sectionId?._id || "",
        user: editIssueData.issuedTo?.userId?._id || "",
        book: editIssueData.bookId?._id || "",
        authorName: editIssueData.author || "",
        issueDate: editIssueData.issueDate
          ? dayjs(editIssueData.issueDate)
          : null,
        returnDate: editIssueData.returnDate
          ? dayjs(editIssueData.returnDate)
          : null,
        status: editIssueData.status || "Pending",
      });
      if (editIssueData.classId?._id) {
        dispatch(fetchSectionsNamesByClass(editIssueData.classId._id));
      }
    } else {
      form.resetFields();
    }
  }, [editIssueData, dispatch]);

  // Handle antd Select changes
  const handleSelectChange = (name, value) => {
    if (name === "class") {
      dispatch(fetchSectionsNamesByClass(value));
    }
    form.setFieldValue(name, value);
    if (name === "book") {
      const selectedBook = books?.find((b) => b._id === value);
      form.setFieldValue("authorName", selectedBook?.author || "");
    }
  };

  // Handle status changes via radio buttons
  const handleStatusChange = (e) => {
    form.setFieldValue("status", e.target.value);
  };

  // Handle date changes using DatePicker
  const handleDateChange = (name, dateObj) => {
    form.setFieldValue(name, dateObj);
  };

  // Filter out any user whose role is 'admin', then apply role-based filter using fuzzy search
  const filteredUsers =
    allUsers
      ?.filter((user) => user.role?.toLowerCase() !== "admin")
      .filter((user) =>
        selectedRole === "all"
          ? true
          : user.role?.toLowerCase() === selectedRole.toLowerCase()
      ) || [];

  // Submit handler with loading state
  const handleSubmit = async (values) => {
    setSubmitting(true);
    const selectedUser = allUsers?.find((usr) => usr.userId === values.user);
    const userRole = selectedUser ? selectedUser.role : "";
    const submissionData = {
      id: editIssueData ? editIssueData._id : null,
      status: values.status,
      returnDate: values.returnDate ? values.returnDate.format("YYYY-MM-DD") : "",
      issueDate: values.issueDate ? values.issueDate.format("YYYY-MM-DD") : "",
      author: values.authorName,
      bookId: values.book,
      userId: values.user,
      userType: userRole,
      sectionId: values.section,
      classId: values.class,
    };
    try {
      await dispatch(issueBookThunk(submissionData)).unwrap().then(() => {
        dispatch(fetchBookIssuesThunk({ page: 1, limit: 10 }));
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        class: "",
        section: "",
        user: "",
        book: "",
        authorName: "",
        issueDate: null,
        returnDate: null,
        status: "Pending",
      }}
      className="flex flex-col h-full space-y-6"
    >
      <div className="flex-1 overflow-auto no-scrollbar px-5 space-y-4">
        {/* Role Filter for Users */}
        <div>
          <label
            htmlFor="roleFilter"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Filter by Role")}
          </label>
          <Form.Item name="roleFilter" initialValue="all">
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
          </Form.Item>
        </div>
        {/* Conditionally render Class & Section side by side if role is 'student' */}
        {selectedRole === "student" && (
          <div className="flex gap-4">
            <div className="flex-1">
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FaSchool /> {t("Class")}
                  </span>
                }
                name="class"
                rules={[{ required: true, message: t("Select Class") }]}
              >
                <Select
                  id="class"
                  value={form.getFieldValue("class")}
                  onChange={(value) => handleSelectChange("class", value)}
                  placeholder={t("Select Class")}
                  style={{ width: "100%" }}
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {classList?.map((cls) => (
                    <Option key={cls._id} value={cls._id}>
                      {cls.className}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label={
                  <span className="block text-sm font-medium text-gray-700">
                    {t("Section")}
                  </span>
                }
                name="section"
              >
                <Select
                  id="section"
                  value={form.getFieldValue("section")}
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
              </Form.Item>
            </div>
          </div>
        )}
        {/* User Field */}
        <Form.Item
          label={
            <span className="block text-sm font-medium text-gray-700">
              {t("User")}
            </span>
          }
          name="user"
          rules={[{ required: true, message: t("Select User") }]}
        >
          <Select
            id="user"
            value={form.getFieldValue("user")}
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
          >
            {filteredUsers?.map((usr) => {
              const searchString = `${usr.name} ${usr.role} ${usr.admissionNumber || ""}`;
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
        </Form.Item>
        {/* Book Field */}
        <Form.Item
          label={
            <span className="block text-sm font-medium text-gray-700">
              {t("Book")}
            </span>
          }
          name="book"
          rules={[{ required: true, message: t("Select Book") }]}
        >
          <Select
            id="book"
            value={form.getFieldValue("book")}
            onChange={(value) => handleSelectChange("book", value)}
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
        </Form.Item>
        {/* Author Name using AntD Input (read-only) */}
        <Form.Item
          label={
            <span className="block text-sm font-medium text-gray-700">
              {t("Author Name")}
            </span>
          }
          name="authorName"
        >
          <Input
            id="authorName"
            value={
              form.getFieldValue("book")
                ? books?.find((b) => b._id === form.getFieldValue("book"))?.author ||
                ""
                : ""
            }
            size="large"
            placeholder={t("Enter author name")}
            disabled
            readOnly
          />
        </Form.Item>
        {/* Issue Date & Return Date side by side using DatePicker */}
        <div className="flex gap-4">
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiCalendar /> {t("Issue Date")}
              </span>
            }
            name="issueDate"
            rules={[{ required: true, message: t("Select Issue Date") }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="dd-mm-yyyy"
              format="DD-MM-YYYY"
              onChange={(dateObj) => handleDateChange("issueDate", dateObj)}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FiClock /> {t("Return Date")}
              </span>
            }
            name="returnDate"
            rules={[
              { required: true, message: t("Select Return Date") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const issueDate = getFieldValue("issueDate");
                  if (!value || !issueDate || value.isAfter(issueDate)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("Return date must be greater than issue date"))
                  );
                },
              }),
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="dd-mm-yyyy"
              format="DD-MM-YYYY"
              onChange={(dateObj) => handleDateChange("returnDate", dateObj)}
              allowClear
            />
          </Form.Item>
        </div>
        {/* Status as Radio Buttons */}
        <Form.Item
          label={
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FiAlertCircle /> {t("Status")}
            </span>
          }
          name="status"
          initialValue="Pending"
        >
          <Radio.Group onChange={handleStatusChange} size="large">
            <Radio value="Pending">
              <span className="flex items-center gap-1">{t("Pending")}</span>
            </Radio>
            <Radio value="Returned">
              <span className="flex items-center gap-1">{t("Returned")}</span>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      {/* Submit Button with loading state */}
      <div className="sticky bottom-0 w-full bg-white pb-3 px-5">
        <Form.Item>
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
        </Form.Item>
      </div>
    </Form>
  );
};

export default AddIssue;