import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createNoticeThunk,
  updateNoticeThunk,
  fetchAllUsersThunk,
} from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import { fetchAllClasses } from "../../../../Store/Slices/Admin/Class/actions/classThunk";
import {
  FiLoader,
  FiInfo,
  FiCheck,
  FiEdit,
  FiStar,
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiUserCheck,
  FiDollarSign,
  FiBookOpen,
} from "react-icons/fi";
import dayjs from "dayjs";
import { AiOutlineFullscreen } from "react-icons/ai";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import { useTranslation } from "react-i18next";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Modal,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { FaSchool } from "react-icons/fa";
import EditorComponent from "../../Subjects/Component/AdminEditor";

const { Option } = Select;

/**
 * Role options with icons (unchanged)
 */
const roleOptions = [
  { value: "admin", label: "Admin", icon: <FiUserCheck /> },
  { value: "student", label: "Student", icon: <FiUser /> },
  { value: "parent", label: "Parent", icon: <FiUser /> },
  { value: "finance", label: "Finance", icon: <FiDollarSign /> },
  { value: "librarian", label: "Librarian", icon: <FiBookOpen /> },
  { value: "teacher", label: "Teacher", icon: <FiEdit /> },
  { value: "staff", label: "Staff", icon: <FiUser /> },
  { value: "all", label: "All", icon: <FiUser /> },
];

/**
 * Custom tag renderer for "Notice for Users" select.
 * We store userId in the form field, so we look up the user
 * by matching user.userId === value. Then we display the user's
 * avatar, name, and role. If not found, we fallback to showing the value.
 */
const userTagRender = (props, allUsers) => {
  const { value, closable, onClose } = props;
  // 'value' is userId from the form
  const user = allUsers?.find((u) => u.userId === value);

  if (!user) {
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, background: "#fff0f2" }}
      >
        {value}d
      </Tag>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#fff0f2",
        borderRadius: "4px",
        padding: "2px 4px",
        marginRight: "4px",
      }}
    >
      <img
        src={user.profile || "https://via.placeholder.com/20?text=No+Image"}
        alt={user.name}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{user.name}</span>
      <Tag color="blue" style={{ marginLeft: "auto", fontSize: "0.75rem" }}>
        {user.role}
      </Tag>
      {closable && (
        <span
          onClick={onClose}
          style={{ cursor: "pointer", marginLeft: "4px", fontWeight: "bold" }}
        >
          ×
        </span>
      )}
    </div>
  );
};

const AddNotice = ({ isEditing, onClose }) => {
  const { t } = useTranslation("admNotice");
  const dispatch = useDispatch();
  const { selectedNotice, loading, allUsers } = useSelector(
    (state) => state.admin.notice
  );
  const { classes } = useSelector((state) => state.admin.class);
  const { role } = useSelector((store) => store.common.auth);
  const [form] = Form.useForm();
  const noticeTarget = Form.useWatch("noticeTarget", form);
  const titleRef = useRef(null);

  const [editorContent, setEditorContent] = useState("");
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    startDate: null,
    endDate: null,
    priority: "High priority",
    classId: "",
    noticeTarget: "roles",
    noticeForRoles: [],
    noticeForUsers: [],
  });
  const [isGuidelineModalVisible, setGuidelineModalVisible] = useState(false);
  const [isUserPickerVisible, setUserPickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllClasses());
    if (role === "admin") {
      dispatch(fetchAllUsersThunk());
    }
  }, [dispatch]);

  /**
   * Preload data if editing:
   * The backend returns noticeForUsers as an array of objects with "_id".
   * But the user array has "userId". We must map each `_id` to a `userId`
   * so the tag renderer can find the correct user data (avatar, name, role).
   */
  useEffect(() => {
    if (isEditing && selectedNotice) {
      // Convert each { _id } to the matching userId
      // so the form stores userId in noticeForUsers
      const mappedUserIds = [];
      if (selectedNotice.noticeForUsers?.length) {
        selectedNotice.noticeForUsers.forEach((nfUser) => {
          const matchedUser = allUsers?.find(
            (nu) => nu.userId === nfUser._id
          );
          // If we found a user whose userId == nfUser._id,
          // store that userId. Otherwise, store the raw _id
          mappedUserIds.push(matchedUser ? matchedUser.userId : nfUser._id);
        });
      }

      const preloadedData = {
        title: selectedNotice?.title || "",
        startDate: selectedNotice?.startDate
          ? dayjs(selectedNotice.startDate)
          : null,
        endDate: selectedNotice?.endDate
          ? dayjs(selectedNotice.endDate)
          : null,
        priority: selectedNotice?.priority || "High priority",
        classId: selectedNotice?.classId?._id || "",
        noticeTarget:
          selectedNotice?.noticeForRoles?.length > 0 ? "roles" : "users",
        noticeForRoles: selectedNotice?.noticeForRoles || [],
        // Now store userId in noticeForUsers for the form
        noticeForUsers: mappedUserIds,
      };
      setAnnouncementData(preloadedData);
      form.setFieldsValue(preloadedData);
      setEditorContent(selectedNotice?.description || "");
    } else {
      // Reset for creation
      const initialData = {
        title: "",
        startDate: null,
        endDate: null,
        priority: "High priority",
        classId: "",
        noticeTarget: "roles",
        noticeForRoles: [],
        noticeForUsers: [],
      };
      setAnnouncementData(initialData);
      form.resetFields();
      setEditorContent("");
    }
  }, [isEditing, selectedNotice, onClose]);

  /**
   * Filter user list for the full-screen user picker
   */
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return (allUsers || []).filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.role?.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  /**
   * Toggle user selection in the full-screen modal
   */
  const handleUserToggle = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  /**
   * Confirm selection: store the chosen userIds in the form
   */
  const confirmUserSelection = () => {
    form.setFieldsValue({ noticeForUsers: tempSelectedUsers });
    setUserPickerVisible(false);
  };

  /**
   * On submit, convert userId -> _id if your backend truly needs _id
   */
  const onFinish = async (values) => {
    if (!editorContent.trim()) {
      toast.error(t("Please enter event details."));
      titleRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Convert userIds to _id for final payload
    let finalNoticeForUsers = values.noticeForUsers || [];
    finalNoticeForUsers = finalNoticeForUsers.map((uid) => {
      // find matching user in allUsers
      const matched = allUsers?.find((nu) => nu.userId === uid);
      // if found, return matched userId or _id
      // in your data, you want the `_id` that matches the original backend references
      // but we only have userId. If your backend expects `_id`, you must have a link.
      // If you truly only have userId, then store userId in your DB.
      // For now, let's assume we want to store `_id` from the selectedNotice.
      // If you do not have that, you might need to store userId in the DB instead.
      // We'll do a fallback if not found.
      return matched ? matched.userId : uid;
    });

    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : "",
      endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : "",
      description: editorContent,
      noticeForUsers: finalNoticeForUsers,
    };

    if (!payload.title || !payload.startDate || !payload.endDate) {
      toast.error(t("Please fill in all required fields."));
      form.scrollToFirstError({ behavior: "smooth" });
      return;
    }

    try {
      if (isEditing) {
        const response = await dispatch(
          updateNoticeThunk({
            noticeId: selectedNotice._id,
            updatedData: payload,
          })
        ).unwrap();
        // console.log("Response", response)
        if (response.success) {

          toast.success(t("Notice Updated Successfully"));
        }
        else {
          toast.error(response.message || t("Failed to update notice."));
        }
      } else {
        const response = await dispatch(createNoticeThunk(payload)).unwrap();
        // console.log("Response", response)
        if (response.success) {

          toast.success(t("Notice Added Successfully"));
        }
        else {
          toast.error(response.message || t("Failed to add notice."));
        }
      }
      form.resetFields();
      setEditorContent("");
      onClose();
    } catch (error) {
      toast.error(t("An error occurred"));
    }
  };

  const handleClassChange = (value) => {
    if (value) {
      form.setFieldsValue({ classId: value });
      dispatch(fetchStudentsByClassAndSection(value));
    }
  };

  const openGuidelines = () => setGuidelineModalVisible(true);
  const closeGuidelines = () => setGuidelineModalVisible(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white relative"
      style={{ borderRadius: "8px" }}
    >
      {/* Guidelines Tooltip */}
      <Tooltip title={t("View Guidelines")}>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
          }}
          onClick={openGuidelines}
          aria-label={t("Guidelines")}
        >
          <FiInfo size={24} color="#1890ff" />
        </div>
      </Tooltip>

      {/* Guidelines Modal */}
      <Modal
        open={isGuidelineModalVisible}
        onCancel={closeGuidelines}
        footer={null}
        width={550}
        className="rounded-xl"
        bodyStyle={{ padding: 0 }}
      >
        <AnimatePresence>
          {isGuidelineModalVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiInfo className="text-purple-600 text-4xl" />
                </div>
                <h4 className="text-purple-800 text-xl font-semibold m-0">
                  {t("Notice Creation Guidelines")}
                </h4>
              </div>
              <ul className="list-none text-gray-700 pl-6 space-y-2 mt-4">
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Fill in the <strong>title</strong>, select the{" "}
                    <strong>available dates</strong>, choose the{" "}
                    <strong>priority</strong>, and add details via the rich
                    editor.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Use the radio button to decide whether to send the notice to
                    specific <strong>users</strong> or <strong>roles</strong>.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Optionally, select a <strong>class</strong> to target a
                    group.
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    Ensure all <strong>required fields (*)</strong> are filled
                    in.
                  </span>
                </li>
              </ul>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={closeGuidelines}
                  style={{
                    background: "linear-gradient(to right, #ff758c, #ff7eb3)",
                    color: "#fff",
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  {t("Close")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* Full-Screen User Picker Modal */}
      <Modal
        open={isUserPickerVisible}
        onCancel={() => setUserPickerVisible(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ background: "#fff", minHeight: "80vh" }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            {t("Select Users for this Notice")}
          </h2>
          <Input
            placeholder={t("Search by name or role")}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <Row gutter={[16, 16]}>
            {filteredUsers.map((user) => {
              // user.userId is the unique identifier
              const isSelected = tempSelectedUsers.includes(user.userId);
              return (
                <Col xs={12} sm={8} md={6} lg={4} key={user.userId}>
                  <div
                    className="border rounded-md p-2 flex flex-col items-center cursor-pointer"
                    style={{
                      borderColor: isSelected ? "#ff758c" : "#e5e7eb",
                      background: isSelected ? "#fff0f2" : "#fff",
                      transition: "all 0.3s",
                    }}
                    onClick={() => handleUserToggle(user.userId)}
                  >
                    <img
                      src={
                        user.profile ||
                        "https://via.placeholder.com/60?text=No+Image"
                      }
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover mb-1"
                    />
                    <p className="text-sm font-medium text-center">
                      {user.name}
                    </p>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                </Col>
              );
            })}
          </Row>
          <div className="flex justify-end mt-6">
            <Button
              onClick={confirmUserSelection}
              style={{
                background: "linear-gradient(to right, #ff758c, #ff7eb3)",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
              }}
            >
              {t("Confirm")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Main Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        requiredMark={false}
        initialValues={{
          title: announcementData.title,
          startDate: announcementData.startDate,
          endDate: announcementData.endDate,
          priority: announcementData.priority,
          classId: announcementData.classId,
          noticeTarget: announcementData.noticeTarget,
          noticeForRoles: announcementData.noticeForRoles,
          noticeForUsers: announcementData.noticeForUsers,
        }}
      >
        {/* SECTION 1: Notice Information */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">
            {t("1. Notice Information")}
          </h2>
          <Form.Item
            label={
              <span className="flex items-center">
                <FiEdit className="mr-1" /> {t("Title")} *
              </span>
            }
            name="title"
            rules={[{ required: true, message: t("Please enter a title") }]}
          >
            <Input
              ref={titleRef}
              size="large"
              maxLength={60}
              placeholder={t("Enter title")}
              aria-label={t("Title")}
            />
          </Form.Item>
          <Row gutter={16} className="flex items-center">
            <Col span={8}>
              <Form.Item
                label={
                  <span className="flex items-center">
                    <FiStar className="mr-1" /> {t("Priority")} *
                  </span>
                }
                name="priority"
                rules={[{ required: true, message: t("Select priority") }]}
              >
                <Select size="large" placeholder={t("Select priority")}>
                  <Option value="High priority">{t("High priority")}</Option>
                  <Option value="Low priority">{t("Low priority")}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" /> {t("Available from")} *
                  </span>
                }
                name="startDate"
                rules={[{ required: true, message: t("Select start date") }]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  placeholder={t("Select start date")}
                  aria-label={t("Available from")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="flex items-center">
                    <FiClock className="mr-1" /> {t("Until")} *
                  </span>
                }
                name="endDate"
                rules={[{ required: true, message: t("Select end date") }]}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  placeholder={t("Select end date")}
                  aria-label={t("Until")}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* SECTION 2: Notice Assignment */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">
            {t("2. Notice Assignment")}
          </h2>
          <Form.Item
            label={
              <span className="flex items-center">
                <FiUser className="mr-1" /> {t("Send Notice To")} *
              </span>
            }
            name="noticeTarget"
            rules={[{ required: true, message: t("Select notice target") }]}
          >
            <Radio.Group size="large" buttonStyle="solid">
              <Radio.Button value="users">{t("Users")}</Radio.Button>
              <Radio.Button value="roles">{t("Roles")}</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Notice for Roles */}
          {noticeTarget === "roles" && (
            <Form.Item
              label={
                <span className="flex items-center">
                  <FiUserCheck className="mr-1" /> {t("Notice for Roles")} *
                </span>
              }
              name="noticeForRoles"
              rules={[{ required: true, message: t("Select roles") }]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder={t("Select roles")}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                aria-label={t("Notice for Roles")}
              >
                {roleOptions.map((role) => (
                  <Option key={role.value} value={role.value}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {role.icon} {t(role.label)}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Notice for Users */}
          {noticeTarget === "users" && (
            <Form.Item
              label={
                <span className="flex items-center">
                  <FiUser className="mr-1" /> {t("Notice for Users")} *
                </span>
              }
              name="noticeForUsers"
              rules={[{ required: true, message: t("Select users") }]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder={t("Select users")}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option?.["data-search"]
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                aria-label={t("Notice for Users")}
                style={{ flex: 1 }}
                tagRender={(props) => userTagRender(props, allUsers)}
              >
                {(allUsers || []).map(({ userId, name, role, profile }) => (
                  <Option
                    key={userId}
                    value={userId}
                    data-search={`${name} ${role}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <img
                        src={
                          profile ||
                          "https://via.placeholder.com/20?text=No+Image"
                        }
                        alt={name}
                        style={{ width: 20, height: 20, borderRadius: "50%" }}
                      />
                      <span>{name}</span>
                      <Tag
                        color="blue"
                        style={{ marginLeft: "auto", fontSize: "0.75rem" }}
                      >
                        {role}
                      </Tag>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Optional Class Selection */}
          <Form.Item
            label={
              <span className="flex items-center">
                <FaSchool className="mr-1" /> {t("Select Class (Optional)")}
              </span>
            }
            name="classId"
          >
            <Select
              size="large"
              placeholder={t("Select class")}
              onChange={handleClassChange}
              allowClear
              aria-label={t("Class")}
            >
              <Option value="">{t("All")}</Option>
              {classes &&
                classes.map((classItem) => (
                  <Option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* SECTION 3: Notice Details */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">
            {t("3. Notice Details")}
          </h2>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FiFileText className="mr-1" /> {t("Event Details")} *
          </label>
          <EditorComponent
            assignmentLabel={t("Event Details")}
            hideInput={true}
            editorContent={editorContent}
            onEditorChange={(content) => setEditorContent(content)}
            inputPlaceHolder={t("Type here")}
            isCreateQuestion={false}
          />
        </div>

        {/* Submit Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            disabled={loading}
            style={{
              background: "linear-gradient(to right, #ff758c, #ff7eb3)",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : isEditing ? (
              t("Update Notice")
            ) : (
              t("Add Notice")
            )}
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default AddNotice;
