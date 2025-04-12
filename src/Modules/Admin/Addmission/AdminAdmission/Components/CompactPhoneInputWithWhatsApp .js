import React from "react";
import { useFormik, FormikProvider, Form } from "formik";
import { Form as AntForm, Button } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import { Space, Tooltip, Radio } from "antd";
import { useField } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";

/**
 * ---------------------------------------------------------
 * CompactPhoneInputWithWhatsApp Component
 * ---------------------------------------------------------
 *
 * Renders a phone input and a WhatsApp toggle side by side.
 * - phoneName: path to the phone object in Formik (e.g., "fatherInfo.cell1")
 * - whatsappName: path to the isWhatsapp boolean in Formik (e.g., also "fatherInfo.cell1")
 *   Typically, you only need to provide phoneName if your schema for
 *   phone is stored as an object { value: string, isWhatsapp: boolean }.
 */
const CompactPhoneInputWithWhatsApp = ({
  phoneName,
  tooltip,
  placeholder = "Enter phone number",
}) => {
  // Because 'phoneName' and 'whatsappName' both reference the same field in this design,
  // we only need one useField call (object format).
  const [field, meta, helpers] = useField(phoneName);

  const hasError = meta.touched && meta.error;

  // Safely extract phoneValue and isWhatsapp from our object
  const phoneValue = field.value?.value || "";
  const isWhatsapp = field.value?.isWhatsapp || false;

  // Update phone number in the object
  const handlePhoneChange = (value) => {
    helpers.setValue({
      ...field.value,
      value,
    });
  };

  // Toggle WhatsApp boolean in the object
  const handleWhatsappToggle = () => {
    helpers.setValue({
      ...field.value,
      isWhatsapp: !isWhatsapp,
    });
  };

  return (
    <AntForm.Item
      className="mb-2"
      validateStatus={hasError ? "error" : ""}
      help={hasError ? meta.error?.value || meta.error : ""}
    >
      <Tooltip title={tooltip}>
        <Space.Compact className="w-full" block>
          <PhoneInput
            country="qa" // or your default country
            value={phoneValue}
            onChange={handlePhoneChange}
            onBlur={() => helpers.setTouched(true)}
            placeholder={placeholder}
            inputStyle={{
              width: "100%",
              border: "1px solid #d9d9d9",
              borderRadius: 0,
            }}
            containerStyle={{
              width: "100%",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #d9d9d9",
              borderLeft: 0,
              borderRadius: "0 2px 2px 0",
              padding: "0 12px",
              background: isWhatsapp ? "#dcf8c6" : "#fff",
            }}
          >
            <Radio.Group
              value={isWhatsapp ? "active" : ""}
              onChange={handleWhatsappToggle}
              style={{ background: "transparent" }}
            >
              <Tooltip title="Mark this number as WhatsApp">
                <Radio.Button
                  value="active"
                  style={{
                    background: isWhatsapp ? "#dcf8c6" : "#fff",
                    border: "none",
                    padding: "4px",
                    cursor: "pointer",
                  }}
                  onClick={handleWhatsappToggle}
                >
                  <FaWhatsapp style={{ color: "#075E54", fontSize: 20 }} />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
          </div>
        </Space.Compact>
      </Tooltip>
    </AntForm.Item>
  );
};

export default CompactPhoneInputWithWhatsApp;
