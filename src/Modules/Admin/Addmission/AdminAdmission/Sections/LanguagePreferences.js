import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Row, Col, Select, Radio, Input, Modal, Button, message } from "antd";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSchoolOption,
  fetchAdmissionOptionsBySchoolId,
} from "../../../../../Store/Slices/Admin/Admission/admissionThunk";

const { Option } = Select;

const LanguagePreferences = memo(({ showThirdLang, formRefs }) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { admissionOptions, loading } = useSelector(
    (s) => s.admin.admissionAttachment
  );

  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isValueEdModalVisible, setIsValueEdModalVisible] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [newValueEd, setNewValueEd] = useState("");
  const [modalType, setModalType] = useState("");

  const languageOptions = useMemo(
    () => ({
      secondLanguages: admissionOptions?.languageOptions?.secondLanguages || [],
      thirdLanguages: admissionOptions?.languageOptions?.thirdLanguages || [],
    }),
    [admissionOptions]
  );

  useEffect(() => {
    dispatch(fetchAdmissionOptionsBySchoolId());
  }, [dispatch]);

  const handleAddLanguage = useCallback(async () => {
    if (!newLanguage.trim()) {
      message.warning("Please enter a language");
      return;
    }

    const updatedOptions = JSON.parse(JSON.stringify(admissionOptions || {}));
    updatedOptions.languageOptions = updatedOptions.languageOptions || {
      secondLanguages: [],
      thirdLanguages: [],
    };

    if (modalType === "second") {
      updatedOptions.languageOptions.secondLanguages = [
        ...(updatedOptions.languageOptions.secondLanguages || []),
        newLanguage.trim(),
      ];
    } else if (modalType === "third") {
      updatedOptions.languageOptions.thirdLanguages = [
        ...(updatedOptions.languageOptions.thirdLanguages || []),
        newLanguage.trim(),
      ];
    }

    try {
      await dispatch(
        updateSchoolOption({
          admissionOptions: updatedOptions,
        })
      ).unwrap();
      message.success("Language added successfully");
      setNewLanguage("");
      setIsLanguageModalVisible(false);
    } catch (error) {
      message.error("Failed to add language");
    }
  }, [admissionOptions, dispatch, modalType, newLanguage]);

  const handleAddValueEd = useCallback(async () => {
    if (!newValueEd.trim()) {
      message.warning("Please enter a value education option");
      return;
    }

    const updatedOptions = JSON.parse(JSON.stringify(admissionOptions || {}));
    updatedOptions.valueEducation = [
      ...(updatedOptions.valueEducation || []),
      newValueEd.trim(),
    ];

    try {
      await dispatch(
        updateSchoolOption({
          admissionOptions: updatedOptions,
        })
      ).unwrap();
      message.success("Value education option added successfully");
      setNewValueEd("");
      setIsValueEdModalVisible(false);
    } catch (error) {
      message.error("Failed to add value education option");
    }
  }, [admissionOptions, dispatch, newValueEd]);

  const handleRemoveLanguage = useCallback(
    async (language, type) => {
      const updatedOptions = JSON.parse(JSON.stringify(admissionOptions || {}));
      updatedOptions.languageOptions = updatedOptions.languageOptions || {
        secondLanguages: [],
        thirdLanguages: [],
      };

      if (type === "second") {
        updatedOptions.languageOptions.secondLanguages =
          updatedOptions.languageOptions.secondLanguages.filter(
            (lang) => lang !== language
          );
      } else if (type === "third") {
        updatedOptions.languageOptions.thirdLanguages =
          updatedOptions.languageOptions.thirdLanguages.filter(
            (lang) => lang !== language
          );
      }

      try {
        await dispatch(
          updateSchoolOption({
            admissionOptions: updatedOptions,
          })
        ).unwrap();
        message.success("Language removed successfully");
      } catch (error) {
        message.error("Failed to remove language");
      }
    },
    [admissionOptions, dispatch]
  );

  const handleRemoveValueEd = useCallback(
    async (value) => {
      const updatedOptions = JSON.parse(JSON.stringify(admissionOptions || {}));
      updatedOptions.valueEducation = (
        updatedOptions.valueEducation || []
      ).filter((v) => v !== value);

      try {
        await dispatch(
          updateSchoolOption({
            admissionOptions: updatedOptions,
          })
        ).unwrap();
        message.success("Value education option removed successfully");
      } catch (error) {
        message.error("Failed to remove value education option");
      }
    },
    [admissionOptions, dispatch]
  );

  const showLanguageModal = (type) => {
    setModalType(type);
    setIsLanguageModalVisible(true);
  };

  return (
    <div>
      <h2 className="text-purple-500 bg-purple-100 rounded-md py-2 px-3 mb-0">
        Languages & Preferences
      </h2>

      <div className="p-3 flex flex-col gap-4">
        <div className="flex justify-between items-end gap-2">
          <div className="w-4/5">
            <label className="font-semibold block mb-1">
              Second language preference
            </label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Second Language"
              value={values.languagePrefs.second}
              mode="multiple"
              onChange={(value) => setFieldValue("languagePrefs.second", value)}
              loading={loading}
              ref={(el) => (formRefs.current["languagePrefs.second"] = el)}
            >
              {languageOptions.secondLanguages?.map((lang) => (
                <Option key={lang} value={lang}>
                  {lang}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-1/5 flex gap-2">
            <Button
              type="primary"
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              onClick={() => showLanguageModal("second")}
            >
              Add
            </Button>
            {languageOptions.secondLanguages?.length > 0 && (
              <Button
                className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                onClick={() => showLanguageModal("second")}
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        {showThirdLang && (
          <div className="flex justify-between items-end gap-2">
            <div className="w-4/5">
              <label className="font-semibold block mb-1 text-red-500">
                Third language preference (Grade 3+)
              </label>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Third Language"
                value={values.languagePrefs.third}
                mode="multiple"
                onChange={(value) =>
                  setFieldValue("languagePrefs.third", value)
                }
                loading={loading}
                ref={(el) => (formRefs.current["languagePrefs.third"] = el)}
              >
                {languageOptions.thirdLanguages?.map((lang) => (
                  <Option key={lang} value={lang}>
                    {lang}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-1/5 flex gap-2">
              <Button
                type="primary"
                className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
                onClick={() => showLanguageModal("third")}
              >
                Add
              </Button>
              {languageOptions.thirdLanguages?.length > 0 && (
                <Button
                  className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                  onClick={() => showLanguageModal("third")}
                >
                  Manage
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-end gap-2">
          <div className="w-4/5">
            <label className="font-semibold block mb-1">
              Value education preference
            </label>
            <Select
              style={{ width: "100%" }}
              value={values.languagePrefs.valueEd}
              mode="multiple"
              placeholder="Select Value Education Option"
              onChange={(value) =>
                setFieldValue("languagePrefs.valueEd", value)
              }
              loading={loading}
              ref={(el) => (formRefs.current["languagePrefs.valueEd"] = el)}
            >
              {admissionOptions?.valueEducation?.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-1/5 flex gap-2">
            <Button
              type="primary"
              className="bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white flex items-center gap-1 hover:opacity-90"
              onClick={() => setIsValueEdModalVisible(true)}
            >
              Add
            </Button>
            {admissionOptions?.valueEducation?.length > 0 && (
              <Button
                className="border border-[#C83B62] text-[#C83B62] hover:bg-[#f9f0f5]"
                onClick={() => setIsValueEdModalVisible(true)}
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="font-semibold block mb-1">Left-handed</label>
          <Radio.Group
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            optionType="button"
            value={values.languagePrefs.leftHanded}
            onChange={(e) =>
              setFieldValue("languagePrefs.leftHanded", e.target.value)
            }
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">
            Medical information (allergies / ailments)
          </label>
          <Input.TextArea
            rows={4}
            value={values.medicalInfo}
            onChange={(e) => setFieldValue("medicalInfo", e.target.value)}
            placeholder="Describe any condition the school should know..."
            ref={(el) => (formRefs.current["medicalInfo"] = el)}
          />
        </div>
      </div>

      {/* Language Modal */}
      <Modal
        title={`Add ${modalType === "second" ? "Second" : "Third"} Language`}
        visible={isLanguageModalVisible}
        onOk={handleAddLanguage}
        onCancel={() => {
          setIsLanguageModalVisible(false);
          setNewLanguage("");
        }}
        okText="Add Language"
        okButtonProps={{
          className: "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white",
        }}
      >
        <Input
          placeholder="Enter language name"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
        />
        {languageOptions[`${modalType}Languages`]?.length > 0 && (
          <div className="mt-4">
            <h4>Current Options:</h4>
            <ul className="list-disc pl-5">
              {languageOptions[`${modalType}Languages`]?.map((lang) => (
                <li
                  key={lang}
                  className="flex justify-between items-center py-1"
                >
                  {lang}
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => handleRemoveLanguage(lang, modalType)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Value Education Modal */}
      <Modal
        title="Add Value Education Option"
        visible={isValueEdModalVisible}
        onOk={handleAddValueEd}
        onCancel={() => {
          setIsValueEdModalVisible(false);
          setNewValueEd("");
        }}
        okText="Add Option"
        okButtonProps={{
          className: "bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white",
        }}
      >
        <Input
          placeholder="Enter value education option"
          value={newValueEd}
          onChange={(e) => setNewValueEd(e.target.value)}
        />
        {admissionOptions?.valueEducation?.length > 0 && (
          <div className="mt-4">
            <h4>Current Options:</h4>
            <ul className="list-disc pl-5">
              {admissionOptions.valueEducation.map((option) => (
                <li
                  key={option}
                  className="flex justify-between items-center py-1"
                >
                  {option}
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => handleRemoveValueEd(option)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default LanguagePreferences;
