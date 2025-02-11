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
  Tooltip,
  Spin,
} from "antd";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegEdit } from "react-icons/fa";
import { FiEye, FiInfo, FiCheck } from "react-icons/fi"; // Added FiInfo and FiCheck
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillPatchCheckFill, BsPatchCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

// Redux thunks for semester CRUD operations
import {
  fetchSemestersByClass,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../../../../Store/Slices/Admin/Class/Semester/semesterThunks";
// Import the setSelectedSemester action from the common user slice
import { setSelectedSemester } from "../../../../Store/Slices/Common/User/reducers/userSlice";

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
  // Get the persisted selected semester from the common user slice
  const { selectedSemester } = useSelector(
    (state) => state.common.user.classInfo
  );

  // Local state for optimistic updates
  const [localSemesters, setLocalSemesters] = useState([]);
  const [form] = Form.useForm();
  const [editingSemester, setEditingSemester] = useState(null);
  const [descModalVisible, setDescModalVisible] = useState(false);
  const [modalDesc, setModalDesc] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [guidelinesModalVisible, setGuidelinesModalVisible] = useState(false);

  useEffect(() => {
    form.resetFields();
    setEditingSemester(null);
  }, [form]);

  useEffect(() => {
    setLocalSemesters(reduxSemesters);
  }, [reduxSemesters]);

  useEffect(() => {
    if (classId) {
      dispatch(fetchSemestersByClass({ classId }));
    }
  }, [dispatch, classId]);

  useEffect(() => {
    if (error) {
      message.error(
        error.message || "An error occurred while fetching semesters"
      );
    }
  }, [error]);

  // Note: We remove selectedSemester from the dependency array to prevent infinite loops.
  useEffect(() => {
    if (reduxSemesters && reduxSemesters.length > 0) {
      // Check if the current selectedSemester is in the fetched array
      if (
        selectedSemester &&
        !reduxSemesters.some((sem) => sem._id === selectedSemester.id)
      ) {
        dispatch(setSelectedSemester({ id: null, name: "" }));
      }
    } else {
      // If there are no semesters, clear the selectedSemester
      dispatch(setSelectedSemester({ id: null, name: "" }));
    }
  }, [reduxSemesters, dispatch]);

  // Handle semester selection with notification (updates common user slice)
  const onSelectSemester = (semester) => {
    if (!semester) return;
    dispatch(setSelectedSemester({ id: semester._id, name: semester.title }));
    message.success(`Semester "${semester.title}" selected`);
  };

  // Render the "Select" column with tooltip and icon
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
      startDate: moment(semester.startDate, "DD-MM-YYYY"),
      endDate: moment(semester.endDate, "DD-MM-YYYY"),
    });
  };

  // Optimistic delete with Modal confirmation (maskClosable disabled)
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

  // Handle form submission for create/update with button-level loader
  const onFinish = (values) => {
    if (!values.startDate || !values.startDate.isValid()) {
      message.error("Invalid Start Date. Please select a valid date.");
      return;
    }
    if (!values.endDate || !values.endDate.isValid()) {
      message.error("Invalid End Date. Please select a valid date.");
      return;
    }
    const payload = {
      title: values.title,
      description: values.description,
      startDate: values.startDate.format("DD-MM-YYYY"),
      endDate: values.endDate.format("DD-MM-YYYY"),
    };

    setFormLoading(true);
    if (editingSemester) {
      dispatch(
        updateSemester({
          semesterId: editingSemester._id,
          semesterData: payload,
        })
      )
        .unwrap()
        .then(() => {
          setFormLoading(false);
          message.success("Semester updated successfully");
          setEditingSemester(null);
          form.resetFields();
          dispatch(fetchSemestersByClass({ classId }));
        })
        .catch(() => {
          setFormLoading(false);
        });
    } else {
      dispatch(createSemester({ semesterData: payload, classId }))
        .unwrap()
        .then(() => {
          setFormLoading(false);
          message.success("Semester created successfully");
          form.resetFields();
          dispatch(fetchSemestersByClass({ classId }));
        })
        .catch(() => {
          setFormLoading(false);
        });
    }
  };

  // Define table columns with updated layout:
  // - Truncated description, merged dates column, and row highlighting if selected
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
      render: (_, record) => (
        <span>
          {moment(record.startDate, "DD-MM-YYYY").format("DD MMM YYYY")} -{" "}
          {moment(record.endDate, "DD-MM-YYYY").format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Semester">
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              style={{ background: primaryGradient, border: "none" }}
              icon={<FaRegEdit />}
              aria-label={`Edit semester ${record.title}`}
            />
          </Tooltip>
          <Tooltip title="Delete Semester">
            <Button
              danger
              onClick={() => handleDelete(record._id)}
              icon={<RiDeleteBin5Line />}
              aria-label={`Delete semester ${record.title}`}
            />
          </Tooltip>
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
                  </Tooltip>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </motion.div>
      </div>

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

      <Modal
        getContainer={false}
        visible={guidelinesModalVisible}
        onCancel={() => setGuidelinesModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setGuidelinesModalVisible(false)}>
            Close
          </Button>,
        ]}
        title="Semester Creation Guidelines"
      >
        <AnimatePresence>
          {guidelinesModalVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="list-disc ml-6 space-y-2">
                <li className="flex items-center">
                  <FiCheck className="mr-1" />
                  Use a descriptive title for the semester.
                </li>
                <li className="flex items-center">
                  <FiCheck className="mr-1" />
                  Provide a clear and concise description.
                </li>
                <li className="flex items-center">
                  <FiCheck className="mr-1" />
                  Ensure that start and end dates are valid and within the
                  academic year.
                </li>
                <li className="flex items-center">
                  <FiCheck className="mr-1" />
                  End date must be after the start date.
                </li>
                <li className="flex items-center">
                  <FiCheck className="mr-1" />
                  Fill all required fields before submission.
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default SemesterManagement;
