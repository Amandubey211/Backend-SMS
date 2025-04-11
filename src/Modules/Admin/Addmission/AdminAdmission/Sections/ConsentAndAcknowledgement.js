import React from "react";
import { useField } from "formik";
import { Radio, Checkbox } from "antd";

const ConsentAndAcknowledgement = ({ formRefs, errors, touched }) => {
  // Example for radio
  const [photoField, photoMeta, photoHelpers] = useField(
    "consent.photoPermission"
  );
  // Example for multiple check acknowledgements
  const [ackField, ackMeta, ackHelpers] = useField("consent.acknowledgements");

  const handleAckChange = (checkedValues) => {
    ackHelpers.setValue(checkedValues);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
        Consent & Acknowledgement
      </h2>

      <div
        ref={(el) => (formRefs.current["consent.photoPermission"] = el)}
        style={{ marginBottom: "1rem" }}
      >
        <label style={{ fontWeight: "bold" }}>
          Parental Consent for Photos & Videos
        </label>
        <Radio.Group
          onChange={(e) => photoHelpers.setValue(e.target.value)}
          value={photoField.value}
        >
          <Radio value="yes" style={{ marginRight: "1rem" }}>
            I give permission to use my child's photograph/videos.
          </Radio>
          <Radio value="no">I DO NOT give permission.</Radio>
        </Radio.Group>
        {photoMeta.touched && photoMeta.error && (
          <div style={{ color: "red", marginTop: 4 }}>{photoMeta.error}</div>
        )}
      </div>

      <div ref={(el) => (formRefs.current["consent.acknowledgements"] = el)}>
        <label style={{ fontWeight: "bold" }}>Acknowledgement</label>
        <Checkbox.Group
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "0.5rem",
          }}
          value={ackField.value}
          onChange={handleAckChange}
        >
          <Checkbox value="confirmData">
            Confirm all provided info is true and accurate.
          </Checkbox>
          <Checkbox value="legalCustody">Confirm legal custody.</Checkbox>
          <Checkbox value="acceptPolicies">Accept school policies.</Checkbox>
          <Checkbox value="infoUsage">
            Grant the school the right to use provided info for analytics.
          </Checkbox>
        </Checkbox.Group>
        {ackMeta.touched && ackMeta.error && (
          <div style={{ color: "red", marginTop: 4 }}>{ackMeta.error}</div>
        )}
      </div>
    </div>
  );
};

export default ConsentAndAcknowledgement;
