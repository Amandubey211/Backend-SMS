import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Input,
  DatePicker,
  Button,
  Modal,
  Space,
  message,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegEdit } from "react-icons/fa";
import { FiEye, FiInfo, FiCheck } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Redux thunks for semester CRUD operations
import {
  fetchSemestersByClass,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
// Import the setSelectedSemester action from the common user slice
import { setSelectedSemester } from "../../../../Store/Slices/Common/User/reducers/userSlice";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const pinkColor = "#EC407A";
const purpleColor = "#AB47BC";
const primaryGradient = `linear-gradient(to right, ${pinkColor}, ${purpleColor})`;

const SemesterManagement = ({ classId }) => {
  const dispatch = useDispatch();
  const {
    semesters: reduxSemesters,
    loading,
    error,
  } = useSelector((state) => state.admin.semesters);

  // Persisted selected semester from common user slice
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  const { t } = useTranslation("admClass");
  const { Title } = Typography;

  // Local state
  const [localSemesters, setLocalSemesters] = useState([]);
  const [form] = Form.useForm();
  const [editingSemester, setEditingSemester] = useState(null);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [guidelinesModalVisible, setGuidelinesModalVisible] = useState(false);

  /**
   * Reset the form and clear editing state
   * whenever the form itself is reset
   */
  useEffect(() => {
    form.resetFields();
    setEditingSemester(null);
  }, [form]);

  // Keep local copy of semesters in sync with Redux
  useEffect(() => {
    setLocalSemesters(reduxSemesters);
  }, [reduxSemesters]);

  // Fetch semesters whenever classId changes
  useEffect(() => {
    if (classId) {
      dispatch(fetchSemestersByClass({ classId }));
    }
  }, [dispatch, classId]);

  // Show errors if any
  useEffect(() => {
    if (error) {
      message.error(
        error.message || "An error occurred while fetching semesters"
      );
    }
  }, [error]);

  /**
   * Auto-select a semester if no valid one is selected:
   * 1) Look for an active semester whose date range includes today's date.
   * 2) If none found, select the first semester in the list.
   * 3) If no semesters exist, clear any persisted selection.
   */
  useEffect(() => {
    if (reduxSemesters && reduxSemesters.length > 0) {
      const isValid =
        selectedSemester && selectedSemester.id
          ? reduxSemesters.some((sem) => sem._id === selectedSemester.id)
          : false;
      if (!isValid) {
        const now = moment();
        const activeSemester = reduxSemesters.find((sem) => {
          const start = moment(sem.startDate);
          const end = moment(sem.endDate);
          return now.isBetween(start, end, "day", "[]");
        });
        if (activeSemester) {
          dispatch(
            setSelectedSemester({
              id: activeSemester._id,
              name: activeSemester.title,
            })
          );
        } else {
          // Otherwise, select the first available semester
          const firstSemester = reduxSemesters[0];
          dispatch(
            setSelectedSemester({
              id: firstSemester._id,
              name: firstSemester.title,
            })
          );
        }
      }
    } else {
      // If no semesters exist, clear selection
      if (selectedSemester && selectedSemester.id) {
        dispatch(setSelectedSemester({ id: null, name: "" }));
      }
    }
  }, [reduxSemesters, dispatch, selectedSemester?.id]);

  // Handler to select a semester
  const onSelectSemester = (semester) => {
    if (!semester) return;
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    message.success(`Semester "${semester.title}" selected`);
  };

  // Select column icon logic
  const renderSelectColumn = (semester) => {
    if (!semester) return null;
    return (
      <Tooltip title="Select this semester">
        <button
          onClick={() => onSelectSemester(semester)}
          className="focus:outline-none"
          aria-label={`Select semester ${semester.title}`}
        >
          {selectedSemester && selectedSemester.id === semester._id ? (
            <BsFillPatchCheckFill className="text-green-500 text-2xl" />
          ) : (
            <BsPatchCheck className="text-gray-400 text-2xl" />
          )}
        </button>
      </Tooltip>
    );
  };

  // Load semester data into the form for editing
  const handleEdit = (semester) => {
    setEditingSemester(semester);
    form.setFieldsValue({
      title: semester.title,
      description: semester.description,
      // Convert from ISO string to moment for form fields
      startDate: moment(semester.startDate),
      endDate: moment(semester.endDate),
    });
  };

  // Confirm deletion
  const handleDelete = (semesterId) => {
    Modal.confirm({
      title: "Delete Semester",
      content:
        "Are you sure you want to delete this semester? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: false,
      onOk: () => {
        const originalSemesters = [...localSemesters];
        setLocalSemesters((prev) =>
          prev.filter((sem) => sem._id !== semesterId)
        );
        return dispatch(deleteSemester({ semesterId }))
          .unwrap()
          .then(() => {
            message.success("Semester deleted successfully");
            dispatch(fetchSemestersByClass({ classId }));
          })
          .catch(() => {
            message.error("Deletion failed, reverting changes");
            setLocalSemesters(originalSemesters);
            return Promise.reject();
          });
      },
    });
  };

  /**
   * Handle form submission for CREATE or UPDATE.
   * NOTE: We send dates in "YYYY-MM-DD" so the backend
   * can parse them with `new Date(`${date}T00:00:00.000Z`)`
   */
  const onFinish = (values) => {
    // Debug: Log the selected dates (they should be moment objects)
    console.log(
      "startDate:",
      values.startDate.format("YYYY-MM-DD"),
      "endDate:",
      values.endDate.format("YYYY-MM-DD")
    );

    if (!values.startDate || !values.startDate.isValid()) {
      message.error("Invalid Start Date. Please select a valid date.");
      return;
    }
    if (!values.endDate || !values.endDate.isValid()) {
      message.error("Invalid End Date. Please select a valid date.");
      return;
    }

    // For update, we send "DD-MM-YYYY" because the backend update uses parseDate.
    // For create, we send "YYYY-MM-DD" because new Date("YYYY-MM-DDT00:00:00.000Z") works.
    const dateFormat = editingSemester ? "DD-MM-YYYY" : "YYYY-MM-DD";

    const payload = {
      title: values.title,
      description: values.description,
      startDate: values.startDate.format(dateFormat),
      endDate: values.endDate.format(dateFormat),
    };

    setFormLoading(true);

    if (editingSemester) {
      // Update an existing semester
      dispatch(
        updateSemester({
          semesterId: editingSemester._id,
          semesterData: payload,
        })
      )
        .unwrap()
        .then(() => {
          message.success("Semester updated successfully");
          setEditingSemester(null);
          form.resetFields();
          dispatch(fetchSemestersByClass({ classId }));
        })
        .finally(() => {
          setFormLoading(false);
        });
    } else {
      // Create a new semester
      dispatch(createSemester({ semesterData: payload, classId }))
        .unwrap()
        .then((newSemester) => {
          message.success("Semester created successfully");
          form.resetFields();

          // Refresh the list
          dispatch(fetchSemestersByClass({ classId }));

          // Auto-select the newly created semester
          if (newSemester?.data) {
            dispatch(
              setSelectedSemester({
                id: newSemester.data._id,
                name: newSemester.data.title,
              })
            );
          }
        })
        .finally(() => {
          setFormLoading(false);
        });
    }
  };

  // Table columns
  const columns = [
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_, record) => renderSelectColumn(record),
      width: 80,
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
      render: (text, record) =>
        record._id === (selectedSemester ? selectedSemester.id : null) ? (
          <span className="bg-pink-100 px-1 rounded">{text}</span>
        ) : (
          text
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) => {
        const maxLength = 30;
        if (desc && desc.length > maxLength) {
          const truncated = desc.substring(0, maxLength) + "...";
          return (
            <div className="flex items-center space-x-0.5">
              <span>{truncated}</span>
              <Tooltip title="View full description">
                <button
                  onClick={() => {
                    setModalDesc(desc);
                    setDescModalVisible(true);
                  }}
                  className="focus:outline-none"
                  aria-label="View full description"
                >
                  <FiEye className="text-blue-500" />
                </button>
              </Tooltip>
            </div>
          );
        } else {
          return desc;
        }
      },
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => {
        // record.startDate & record.endDate are likely stored in ISO format
        const start = moment(record.startDate).format("DD MMM YYYY");
        const end = moment(record.endDate).format("DD MMM YYYY");
        return <span>{`${start} - ${end}`}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <ProtectedAction requiredPermission={PERMISSIONS.UPDATE_SEMESTER}>

         
          <Tooltip title="Edit Semester">
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              style={{ background: primaryGradient, border: "none" }}
              icon={<FaRegEdit />}
              aria-label={`Edit semester ${record.title}`}
            />
          </Tooltip>
          </ProtectedAction>
          <ProtectedAction requiredPermission={PERMISSIONS.DELETE_SEMESTER}>


          <Tooltip title="Delete Semester">
            <Button
              danger
              onClick={() => handleDelete(record._id)}
              icon={<RiDeleteBin5Line />}
              aria-label={`Delete semester ${record.title}`}
            />
          </Tooltip>
          </ProtectedAction>
        </Space>
      ),
    },
  ];

  return (
    <div className="relative p-4">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Spin size="large" tip="Loading..." />
        </div>
      )}
      <div className="flex flex-col md:flex-row w-full">
        {/* Semester List */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-2/3 p-4"
        >
          <div className="overflow-x-auto">
            <Table
              dataSource={localSemesters}
              columns={columns}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              bordered
              rowClassName={(record) =>
                record._id === (selectedSemester ? selectedSemester.id : null)
                  ? "bg-pink-100"
                  : ""
              }
            />
          </div>
        </motion.div>

        {/* Form Area */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/3 p-4"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: purpleColor }}>
                {editingSemester ? "Edit Semester" : "Create Semester"}
              </h2>
              <Tooltip title="View Semester Guidelines">
                <button
                  onClick={() => setGuidelinesModalVisible(true)}
                  className="ml-2 focus:outline-none"
                  aria-label="Semester Guidelines"
                >
                  <FiInfo className="text-blue-500 text-2xl" />
                </button>
              </Tooltip>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
              requiredMark="optional"
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter semester title" },
                ]}
                hasFeedback
              >
                <Input
                  placeholder="Enter semester title"
                  className="rounded-md border-gray-300 focus:ring-2"
                  aria-label="Semester Title"
                />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea
                  placeholder="Enter description"
                  rows={3}
                  className="rounded-md border-gray-300 focus:ring-2"
                  aria-label="Semester Description"
                />
              </Form.Item>

              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  { required: true, message: "Please select start date" },
                ]}
                hasFeedback
              >
                {/* Format "DD-MM-YYYY" for display if you like, 
                    but the `onFinish` will submit "YYYY-MM-DD" */}
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  className="rounded-md"
                  aria-label="Start Date"
                />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "Please select end date" }]}
                hasFeedback
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  className="rounded-md"
                  aria-label="End Date"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Tooltip title="Clear form fields">
                    <Button
                      type="default"
                      onClick={() => {
                        setEditingSemester(null);
                        form.resetFields();
                      }}
                      aria-label="Clear form"
                    >
                      Clear
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      editingSemester ? "Update Semester" : "Create Semester"
                    }
                  >
                    <ProtectedAction requiredPermission={editingSemester ? PERMISSIONS.ADD_SEMESTER : PERMISSIONS.UPDATE_SEMESTER}>


                   
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ background: primaryGradient, border: "none" }}
                      aria-label={
                        editingSemester ? "Update Semester" : "Create Semester"
                      }
                      loading={formLoading}
                    >
                      {editingSemester ? "Update Semester" : "Create Semester"}
                    </Button>
                    </ProtectedAction>
                  </Tooltip>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </motion.div>
      </div>

      {/* Full Description Modal */}
      <Modal
        getContainer={false}
        title="Full Description"
        visible={descModalVisible}
        onCancel={() => setDescModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDescModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p>{modalDesc}</p>
      </Modal>

      {/* Guidelines Modal */}
      <Modal
        visible={guidelinesModalVisible}
        onCancel={() => setGuidelinesModalVisible(false)}
        footer={null}
        width={550}
        className="rounded-xl shadow-lg"
      >
        <AnimatePresence>
          {guidelinesModalVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col p-6"
            >
              {/* Header with Icon */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiInfo className="text-purple-600 text-4xl" />
                </div>
                <Title level={3} className="text-purple-800">
                  {t("Semester Creation Guidelines")}
                </Title>
              </div>

              {/* Left-Aligned Guidelines */}
              <ul className="list-none text-gray-700 pl-6 space-y-2">
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>{t("Use a descriptive title for the semester.")}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>{t("Provide a clear and concise description.")}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t(
                      "Ensure start and end dates are valid and within the academic year."
                    )}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>{t("End date must be after the start date.")}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FiCheck className="text-green-500" />
                  <span>
                    {t("Fill all required fields before submission.")}
                  </span>
                </li>
              </ul>

              {/* Close Button (Right-Aligned) */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setGuidelinesModalVisible(false)}
                  className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-all"
                >
                  {t("Close")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default SemesterManagement;
