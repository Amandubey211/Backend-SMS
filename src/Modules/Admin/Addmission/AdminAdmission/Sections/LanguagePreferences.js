import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Form, Select, Radio, Input, Modal, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSchoolOption,
  fetchAdmissionOptionsBySchoolId,
} from "../../../../../Store/Slices/Admin/Admission/admissionThunk";

const { Option } = Select;

const LanguagePreferences = memo(({ showThirdLang }) => {
  const form = Form.useFormInstance();
  const dispatch = useDispatch();
  const { admissionOptions = {}, loading } = useSelector(
    (s) => s.admin.admissionAttachment
  );

  // watch form values
  const second = Form.useWatch(["languagePrefs", "second"], form) || [];
  const third = Form.useWatch(["languagePrefs", "third"], form) || [];
  const valueEd = Form.useWatch(["languagePrefs", "valueEd"], form) || [];
  const leftHanded = Form.useWatch(["languagePrefs", "leftHanded"], form);
  const medicalInfo = Form.useWatch("medicalInfo", form);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [newItem, setNewItem] = useState("");

  const languageOpts = useMemo(
    () => ({
      secondLanguages: admissionOptions.languageOptions?.secondLanguages || [],
      thirdLanguages: admissionOptions.languageOptions?.thirdLanguages || [],
    }),
    [admissionOptions]
  );

  useEffect(() => {
    dispatch(fetchAdmissionOptionsBySchoolId());
  }, [dispatch]);

  const saveNew = useCallback(async () => {
    if (!newItem.trim()) {
      message.warning("Please enter a value");
      return;
    }
    const updated = { ...admissionOptions };
    if (modalType === "second" || modalType === "third") {
      const key = modalType + "Languages";
      updated.languageOptions = { ...updated.languageOptions };
      updated.languageOptions[key] = [
        ...(updated.languageOptions[key] || []),
        newItem.trim(),
      ];
    } else {
      updated.valueEducation = [
        ...(updated.valueEducation || []),
        newItem.trim(),
      ];
    }
    try {
      await dispatch(
        updateSchoolOption({ admissionOptions: updated })
      ).unwrap();
      message.success("Added successfully");
      setNewItem("");
      setModalVisible(false);
    } catch {
      message.error("Failed to update");
    }
  }, [admissionOptions, dispatch, modalType, newItem]);

  const removeItem = useCallback(
    async (val, type) => {
      const updated = { ...admissionOptions };
      if (type === "second" || type === "third") {
        const key = type + "Languages";
        updated.languageOptions = { ...updated.languageOptions };
        updated.languageOptions[key] = updated.languageOptions[key].filter(
          (x) => x !== val
        );
      } else {
        updated.valueEducation = updated.valueEducation.filter(
          (x) => x !== val
        );
      }
      try {
        await dispatch(
          updateSchoolOption({ admissionOptions: updated })
        ).unwrap();
        message.success("Removed successfully");
      } catch {
        message.error("Failed to remove");
      }
    },
    [admissionOptions, dispatch]
  );

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Languages & Preferences
      </h2>
      <div className="p-3 flex flex-col gap-4">
        {/* Second Language */}
        <div className="flex justify-between items-center gap-2 ">
          <div className="w-4/5">
            <Form.Item
              name={["languagePrefs", "second"]}
              label="Second language preference"
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select Second Language"
                value={second}
                loading={loading}
                onChange={(v) =>
                  form.setFieldsValue({
                    languagePrefs: {
                      ...form.getFieldValue("languagePrefs"),
                      second: v,
                    },
                  })
                }
              >
                {languageOpts.secondLanguages.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="w-1/5 flex gap-2">
            <Button
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              onClick={() => openModal("second")}
            >
              Add
            </Button>
            {languageOpts.secondLanguages.length > 0 && (
              <Button
                className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                onClick={() => openModal("second")}
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        {/* Third Language */}
        {/* {showThirdLang && ( */}
        <div className="flex justify-between items-center gap-2">
          <div className="w-4/5">
            <Form.Item
              name={["languagePrefs", "third"]}
              label="Third language preference (Grade 3+)"
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select Third Language"
                value={third}
                loading={loading}
                onChange={(v) =>
                  form.setFieldsValue({
                    languagePrefs: {
                      ...form.getFieldValue("languagePrefs"),
                      third: v,
                    },
                  })
                }
              >
                {languageOpts.thirdLanguages.map((l) => (
                  <Option key={l} value={l}>
                    {l}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="w-1/5 flex gap-2">
            <Button
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              onClick={() => openModal("third")}
            >
              Add
            </Button>
            {languageOpts.thirdLanguages.length > 0 && (
              <Button
                className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                onClick={() => openModal("third")}
              >
                Manage
              </Button>
            )}
          </div>
        </div>
        {/* )} */}

        {/* Value Education */}
        <div className="flex justify-between items-center  gap-2">
          <div className="w-4/5">
            <Form.Item
              name={["languagePrefs", "valueEd"]}
              label="Value education preference"
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select Value Education"
                value={valueEd}
                loading={loading}
                onChange={(v) =>
                  form.setFieldsValue({
                    languagePrefs: {
                      ...form.getFieldValue("languagePrefs"),
                      valueEd: v,
                    },
                  })
                }
              >
                {(admissionOptions.valueEducation || []).map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="w-1/5 flex gap-2">
            <Button
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              onClick={() => openModal("valueEd")}
            >
              Add
            </Button>
            {(admissionOptions.valueEducation || []).length > 0 && (
              <Button
                className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                onClick={() => openModal("valueEd")}
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        {/* Left-handed */}
        <Form.Item name={["languagePrefs", "leftHanded"]} label="Left-handed">
          <Radio.Group
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            optionType="button"
            value={leftHanded}
            onChange={(e) =>
              form.setFieldsValue({
                languagePrefs: {
                  ...form.getFieldValue("languagePrefs"),
                  leftHanded: e.target.value,
                },
              })
            }
          />
        </Form.Item>

        {/* Medical Info */}
        <Form.Item
          name="medicalInfo"
          label="Medical information (allergies/ailments)"
        >
          <Input.TextArea
            rows={4}
            value={medicalInfo}
            onChange={(e) =>
              form.setFieldsValue({ medicalInfo: e.target.value })
            }
            placeholder="Describe any condition the school should know..."
          />
        </Form.Item>
      </div>

      {/* Add / Manage Modal */}
      <Modal
        title={
          modalType === "valueEd"
            ? "Add Value Education Option"
            : `Add ${modalType === "second" ? "Second" : "Third"} Language`
        }
        open={modalVisible}
        onOk={saveNew}
        onCancel={() => {
          setModalVisible(false);
          setNewItem("");
        }}
        okText="Add"
        okButtonProps={{
          className: "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white",
        }}
      >
        <Input
          placeholder="Enter name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <ul className="list-disc pl-5 mt-4">
          {(modalType === "valueEd"
            ? admissionOptions.valueEducation || []
            : languageOpts[`${modalType}Languages`] || []
          ).map((opt) => (
            <li key={opt} className="flex justify-between items-center py-1">
              {opt}
              <Button
                type="text"
                danger
                size="small"
                onClick={() => removeItem(opt, modalType)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
});

export default LanguagePreferences;
