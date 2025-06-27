import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  issueBookThunk,
  fetchBookIssuesThunk,
  validateIssuedBookThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { fetchSectionsNamesByClass } from "../../../../Store/Slices/Admin/Class/Section_Groups/groupSectionThunks";
import { fetchAllUsersThunk } from "../../../../Store/Slices/Admin/NoticeBoard/Notice/noticeThunks";
import { fetchStudentsByClassAndSection } from "../../../../Store/Slices/Admin/Class/Students/studentThunks";
import {
  Form,
  Select,
  Radio,
  DatePicker,
  Button,
  Input,
  Modal,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { FaSchool, FaCheckCircle } from "react-icons/fa";
import { FiAlertCircle, FiCalendar, FiClock } from "react-icons/fi";
import { BsQrCodeScan } from "react-icons/bs";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/* In-file scanner modal (very light UI)                              */
/* ------------------------------------------------------------------ */
const BookScannerModal = ({ visible, onClose, onScanComplete }) => {
  const { t } = useTranslation("admLibrary");
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    if (!visible) {
      setBuffer("");
      return;
    }
    const handler = (e) => {
      if (e.key === "Enter") {
        if (buffer.trim()) {
          onScanComplete(buffer.trim());
          setBuffer("");
        }
      } else {
        setBuffer((p) => p + e.key);
      }
    };
    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  }, [visible, buffer, onScanComplete]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      destroyOnClose
      title={<span className="font-semibold">{t("Scan Book Barcode")}</span>}
    >
      <div className="text-center p-4 space-y-4">
        <BsQrCodeScan className="text-5xl text-purple-600 mx-auto animate-pulse" />
        <div className="bg-gray-50 border rounded font-mono p-3 h-12 flex items-center justify-center">
          {buffer || t("[Waiting…]")}
        </div>
        <p className="text-gray-600 text-sm">{t("Scan and press Enter")}</p>
      </div>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const fuzzySearch = (q, txt) => {
  q = q.toLowerCase();
  txt = txt.toLowerCase();
  let j = 0;
  for (let i = 0; i < txt.length && j < q.length; i++) if (txt[i] === q[j]) j++;
  return j === q.length;
};

const roleOptions = [
  { value: "all", label: "All" },
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "finance", label: "Finance" },
  { value: "librarian", label: "Librarian" },
  { value: "teacher", label: "Teacher" },
  { value: "staff", label: "Staff" },
];

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
const AddIssue = ({ onClose, editIssueData }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  /* redux state */
  const { books } = useSelector((s) => s.admin.library);
  const sectionList = useSelector((s) => s.admin.group_section.sectionsList);
  const classList = useSelector((s) => s.admin.class.classes);
  const { allUsers } = useSelector((s) => s.admin.notice);
  const { loading } = useSelector((s) => s.admin.students);

  /* local state */
  const [studentsList, setStudentsList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  /* does the book we are editing carry a barcode? */
  const hasBarcode = Boolean(editIssueData?.bookId?.barcodeValue);
  const [validationOK, setValidationOK] = useState(
    !hasBarcode || editIssueData?.status === "Returned"
  );

  /* ---------------------------------------------------------------- */
  /* lifecycle                                                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

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
      if (editIssueData.classId?._id)
        dispatch(fetchSectionsNamesByClass(editIssueData.classId._id));
    } else {
      form.resetFields();
    }
  }, [editIssueData, dispatch, form]);

  /* ---------------------------------------------------------------- */
  /* handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleSelectChange = (name, value) => {
    if (name === "class") {
      dispatch(fetchSectionsNamesByClass(value));
      dispatch(fetchStudentsByClassAndSection(value))
        .unwrap()
        .then((list) => setStudentsList(list || []));
    }
    form.setFieldValue(name, value);

    if (name === "book") {
      const sel = books?.find((b) => b._id === value);
      form.setFieldValue("authorName", sel?.author || "");
    }
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    form.setFieldValue("status", val);

    if (
      hasBarcode &&
      editIssueData &&
      editIssueData.status === "Pending" &&
      val === "Returned"
    ) {
      setShowScanner(true);
      setValidationOK(false);
    }
  };

  const handleScanComplete = async (barcode) => {
    try {
      await dispatch(
        validateIssuedBookThunk({
          bookIssueId: editIssueData._id,
          barcodeValue: barcode,
        })
      ).unwrap();
      setValidationOK(true);
    } catch {
      setValidationOK(false);
      // toast.error(t("Validation failed"));
    } finally {
      setShowScanner(false);
    }
  };

  const handleSubmit = async (values) => {
    if (
      hasBarcode &&
      editIssueData &&
      editIssueData.status === "Pending" &&
      values.status === "Returned" &&
      !validationOK
    ) {
      toast.error(t("Please validate the book before marking as returned."));
      return;
    }

    setSubmitting(true);
    const userRec = allUsers?.find((u) => u.userId === values.user);
    const payload = {
      id: editIssueData ? editIssueData._id : null,
      status: values.status,
      returnDate: values.returnDate
        ? values.returnDate.format("YYYY-MM-DD")
        : "",
      issueDate: values.issueDate ? values.issueDate.format("YYYY-MM-DD") : "",
      author: values.authorName,
      bookId: values.book,
      userId: values.user,
      userType: userRec ? userRec.role : "",
      sectionId: values.section,
      classId: values.class,
    };
    try {
      await dispatch(issueBookThunk(payload)).unwrap();
      dispatch(fetchBookIssuesThunk({ page: 1, limit: 10 }));
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  /* users list for dropdown */
  const filteredUsers =
    allUsers
      ?.filter((u) => u.role?.toLowerCase() !== "admin")
      .filter((u) =>
        selectedRole === "all" ? true : u.role?.toLowerCase() === selectedRole
      ) || [];

  /* ---------------------------------------------------------------- */
  /* JSX                                                              */
  /* ---------------------------------------------------------------- */
  const { Option } = Select;
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="flex flex-col h-full space-y-6"
      initialValues={{
        status: "Pending",
      }}
    >
      <div className="flex-1 overflow-auto no-scrollbar px-5 space-y-4">
        {/* Role filter */}
        <Form.Item label={t("Filter by Role")}>
          <Select value={selectedRole} onChange={setSelectedRole} size="large">
            {roleOptions.map((r) => (
              <Option key={r.value} value={r.value}>
                {t(r.label)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Class & Section if student */}
        {selectedRole === "student" && (
          <div className="flex gap-4">
            <Form.Item
              className="flex-1"
              label={
                <span className="flex items-center gap-1">
                  <FaSchool /> {t("Class")}
                </span>
              }
              name="class"
              rules={[{ required: true, message: t("Select Class") }]}
            >
              <Select
                size="large"
                showSearch
                onChange={(v) => handleSelectChange("class", v)}
                filterOption={(i, o) =>
                  o.children.toLowerCase().includes(i.toLowerCase())
                }
              >
                {classList?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.className}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className="flex-1" label={t("Section")} name="section">
              <Select
                size="large"
                disabled={loading}
                onChange={(v) => handleSelectChange("section", v)}
                loading={loading}
              >
                {sectionList?.map((s) => (
                  <Option key={s._id} value={s._id}>
                    {s.sectionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        )}

        {/* User */}
        <Form.Item
          label={t("User")}
          name="user"
          rules={[{ required: true, message: t("Select User") }]}
        >
          <Select
            size="large"
            showSearch
            optionFilterProp="data-search"
            filterOption={(inp, opt) =>
              fuzzySearch(inp, opt?.props["data-search"] || "")
            }
            onChange={(v) => handleSelectChange("user", v)}
          >
            {(selectedRole === "student" ? studentsList : filteredUsers).map(
              (u) => {
                const id = selectedRole === "student" ? u._id : u.userId;
                const name =
                  selectedRole === "student"
                    ? `${u.firstName} ${u.lastName}`
                    : u.name;
                const role = selectedRole === "student" ? "student" : u.role;
                return (
                  <Option key={id} value={id} data-search={`${name} ${role}`}>
                    {name}
                    <span className="ml-2 text-xs text-blue-600">{role}</span>
                  </Option>
                );
              }
            )}
          </Select>
        </Form.Item>

        {/* Book */}
        <Form.Item
          label={t("Book")}
          name="book"
          rules={[{ required: true, message: t("Select Book") }]}
        >
          <Select
            size="large"
            showSearch
            onChange={(v) => handleSelectChange("book", v)}
            filterOption={(i, o) =>
              o.children.toLowerCase().includes(i.toLowerCase())
            }
          >
            {books?.map((b) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Author */}
        <Form.Item label={t("Author Name")} name="authorName">
          <Input size="large" disabled />
        </Form.Item>

        {/* Dates */}
        <div className="flex gap-4">
          <Form.Item
            className="flex-1"
            label={
              <span className="flex items-center gap-1">
                <FiCalendar /> {t("Issue Date")}
              </span>
            }
            name="issueDate"
            rules={[{ required: true, message: t("Select Issue Date") }]}
          >
            <DatePicker format="DD-MM-YYYY" size="large" />
          </Form.Item>
          <Form.Item
            className="flex-1"
            label={
              <span className="flex items-center gap-1">
                <FiClock /> {t("Return Date")}
              </span>
            }
            name="returnDate"
            rules={[
              { required: true, message: t("Select Return Date") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const issue = getFieldValue("issueDate");
                  if (!value || !issue || !value.isBefore(issue))
                    return Promise.resolve();
                  return Promise.reject(
                    new Error(
                      t("Return date must be greater than or Equal issue date")
                    )
                  );
                },
              }),
            ]}
          >
            <DatePicker format="DD-MM-YYYY" size="large" />
          </Form.Item>
        </div>

        {/* Status */}
        <Form.Item
          label={
            <span className="flex items-center gap-1">
              <FiAlertCircle /> {t("Status")}
            </span>
          }
          name="status"
        >
          <Radio.Group onChange={handleStatusChange} size="large">
            <Radio value="Pending">{t("Pending")}</Radio>
            <Radio value="Returned">
              <span className="flex items-center gap-2">
                {t("Returned")}
                {validationOK && hasBarcode && (
                  <Tag icon={<FaCheckCircle />} color="green">
                    {t("Verified")}
                  </Tag>
                )}
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Submit */}
      <div className="sticky bottom-0 w-full bg-white pb-3 px-5">
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={
              submitting ||
              (hasBarcode &&
                editIssueData &&
                form.getFieldValue("status") === "Returned" &&
                !validationOK)
            }
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          >
            {editIssueData ? t("Update Book Issue") : t("Add Book Issue")}
          </Button>
        </Form.Item>
      </div>

      <BookScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={handleScanComplete}
      />
    </Form>
  );
};

export default AddIssue;
