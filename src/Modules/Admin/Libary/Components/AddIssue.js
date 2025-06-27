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
  Spin,
  Alert,
  Steps,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { FaSchool, FaCheckCircle } from "react-icons/fa";
import {
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { BsQrCodeScan, BsExclamationTriangle } from "react-icons/bs";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/* 📷 Enhanced Scanner Modal                                          */
/* ------------------------------------------------------------------ */
const BookScannerModal = ({ visible, onClose, onScanComplete, status }) => {
  const { t } = useTranslation("admLibrary");
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [scanStatus, setScanStatus] = useState("ready"); // ready, scanning, success, error

  const handleClose = () => {
    setScanning(false);
    setScannedData("");
    setScanStatus("ready");
    onClose();
  };

  useEffect(() => {
    if (!visible) {
      setScannedData("");
      setScanStatus("ready");
      return;
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (scannedData) {
          setScanStatus("scanning");
          onScanComplete(scannedData)
            .then(() => setScanStatus("success"))
            .catch(() => setScanStatus("error"))
            .finally(() => {
              setTimeout(() => setScannedData(""), 1000);
            });
        }
      } else {
        setScannedData((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [visible, scannedData, onScanComplete]);

  const getStatusColor = () => {
    switch (scanStatus) {
      case "success":
        return "bg-green-100 border-green-400";
      case "error":
        return "bg-red-100 border-red-400";
      case "scanning":
        return "bg-blue-100 border-blue-400";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = () => {
    switch (scanStatus) {
      case "success":
        return <FiCheck className="text-green-500" />;
      case "error":
        return <BsExclamationTriangle className="text-red-500" />;
      case "scanning":
        return <Spin />;
      default:
        return <BsQrCodeScan className="text-gray-500" />;
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      destroyOnClose
      closable={scanStatus !== "scanning"}
      maskClosable={false}
      title={
        <div className="flex items-center gap-2">
          <BsQrCodeScan className="text-purple-500" />
          <span className="font-semibold">{t("Book Return Validation")}</span>
        </div>
      }
    >
      <div className="space-y-6">
        <Steps
          current={
            scanStatus === "ready" ? 0 : scanStatus === "scanning" ? 1 : 2
          }
          items={[
            {
              title: t("Ready"),
              description: t("Prepare to scan"),
            },
            {
              title: t("Scanning"),
              description: t("Validating book"),
            },
            {
              title: t(status === "success" ? "Verified" : "Failed"),
              description: t(
                status === "success" ? "Validation complete" : "Try again"
              ),
            },
          ]}
        />

        <div className="rounded-xl overflow-hidden border">
          <div className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] p-6 text-center">
            <div className="mx-auto w-20 h-20 flex items-center justify-center bg-white/20 rounded-full mb-4">
              <div className="text-3xl text-white animate-pulse">
                {getStatusIcon()}
              </div>
            </div>
            <p className="text-white font-medium">
              {scanStatus === "ready" && t("Scan the book barcode")}
              {scanStatus === "scanning" && t("Validating...")}
              {scanStatus === "success" && t("Validation successful!")}
              {scanStatus === "error" && t("Validation failed")}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">{t("Scanner input")}</p>
          <div
            className={`${getStatusColor()} rounded-lg p-3 font-mono h-12 flex items-center justify-between`}
          >
            <span className={scannedData ? "text-gray-800" : "text-gray-400"}>
              {scannedData || t("[Waiting for input]")}
            </span>
            {scanStatus !== "ready" && (
              <Tag
                color={
                  scanStatus === "success"
                    ? "green"
                    : scanStatus === "error"
                    ? "red"
                    : "blue"
                }
              >
                {scanStatus}
              </Tag>
            )}
          </div>
        </div>

        {scanStatus === "error" && (
          <Alert
            message={t("Validation failed")}
            description={t("The scanned book doesn't match the issued book.")}
            type="error"
            showIcon
          />
        )}

        <div className="flex gap-3">
          <Button
            block
            size="large"
            onClick={handleClose}
            disabled={scanStatus === "scanning"}
          >
            {scanStatus === "success" ? t("Done") : t("Cancel")}
          </Button>
          {scanStatus !== "success" && (
            <Button
              block
              type="primary"
              size="large"
              loading={scanning}
              onClick={() => setScanning(true)}
              disabled={scanning || scanStatus === "scanning"}
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD]"
            >
              {t("Start Scan")}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const fuzzySearch = (search, text) => {
  search = search.toLowerCase();
  text = text.toLowerCase();
  let j = 0;
  for (let i = 0; i < text.length && j < search.length; i++) {
    if (text[i] === search[j]) j++;
  }
  return j === search.length;
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

  const { books } = useSelector((s) => s.admin.library);
  const sectionList = useSelector((s) => s.admin.group_section.sectionsList);
  const classList = useSelector((s) => s.admin.class.classes);
  const { allUsers } = useSelector((s) => s.admin.notice);
  const { loading } = useSelector((s) => s.admin.students);

  const [studentsList, setStudentsList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [validationOK, setValidationOK] = useState(
    editIssueData ? editIssueData.status === "Returned" : false
  );

  /* -------------------------------------------------------------- */
  /* lifecycle                                                     */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, []);

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
  }, [editIssueData, dispatch, form]);

  /* -------------------------------------------------------------- */
  /* handlers                                                      */
  /* -------------------------------------------------------------- */
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
      editIssueData &&
      editIssueData.status === "Pending" &&
      val === "Returned"
    ) {
      setShowScanner(true);
      setValidationOK(false);
    }
  };

  const handleDateChange = (name, date) => form.setFieldValue(name, date);

  const handleScanComplete = async (barcode) => {
    if (!editIssueData) return;
    try {
      await dispatch(
        validateIssuedBookThunk({
          bookIssueId: editIssueData._id,
          barcodeValue: barcode,
        })
      ).unwrap();
      setValidationOK(true);
      return Promise.resolve();
    } catch (_) {
      setValidationOK(false);
      return Promise.reject();
    }
  };

  const handleSubmit = async (values) => {
    if (
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

  /* -------------------------------------------------------------- */
  /* filtering helpers for users                                    */
  /* -------------------------------------------------------------- */
  const filteredUsers =
    allUsers
      ?.filter((u) => u.role?.toLowerCase() !== "admin")
      .filter((u) =>
        selectedRole === "all" ? true : u.role?.toLowerCase() === selectedRole
      ) || [];

  /* -------------------------------------------------------------- */
  /* JSX                                                            */
  /* -------------------------------------------------------------- */
  const { Option } = Select;
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
                onChange={(v) => handleSelectChange("class", v)}
                size="large"
                showSearch
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
                onChange={(v) => handleSelectChange("section", v)}
                loading={loading}
                size="large"
                disabled={loading}
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
            filterOption={(i, o) =>
              fuzzySearch(i, o.props["data-search"] || "")
            }
            onChange={(v) => handleSelectChange("user", v)}
          >
            {(selectedRole === "student" ? studentsList : filteredUsers).map(
              (u) => {
                const val = selectedRole === "student" ? u._id : u.userId;
                const name =
                  selectedRole === "student"
                    ? `${u.firstName} ${u.lastName}`
                    : u.name;
                const role = selectedRole === "student" ? "student" : u.role;
                const searchStr = `${name} ${role}`;
                return (
                  <Option key={val} value={val} data-search={searchStr}>
                    {name}{" "}
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
          <Input disabled size="large" />
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
            <DatePicker
              format="DD-MM-YYYY"
              size="large"
              onChange={(d) => handleDateChange("issueDate", d)}
            />
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
              {
                required: true,
                message: t("Select Return Date"),
              },
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
            <DatePicker
              format="DD-MM-YYYY"
              size="large"
              onChange={(d) => handleDateChange("returnDate", d)}
            />
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
              <div className="flex items-center gap-2">
                {t("Returned")}
                {validationOK && (
                  <Tag icon={<FaCheckCircle />} color="green">
                    {t("Verified")}
                  </Tag>
                )}
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      {/* Submit */}
      <div className="sticky bottom-0 w-full bg-white pb-3 px-5">
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            disabled={
              submitting ||
              (editIssueData &&
                form.getFieldValue("status") === "Returned" &&
                !validationOK)
            }
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          >
            {editIssueData ? t("Update Book Issue") : t("Add Book Issue")}
          </Button>
        </Form.Item>
      </div>

      {/* Enhanced Scanner modal */}
      <BookScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={handleScanComplete}
        status={validationOK ? "success" : "error"}
      />
    </Form>
  );
};

export default AddIssue;
