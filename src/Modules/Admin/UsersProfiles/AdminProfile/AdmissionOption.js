import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Space, Typography } from "antd";
import { fetchAdmissionOptions, updateAdmissionOptions } from "../../../../Store/Slices/Common/User/actions/userActions";

export default function AdmissionOption({ schoolId }) {
  const [languages, setLanguages] = useState([]);
  const [valueEducation, setValueEducation] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdmissionOptions(schoolId)).then((res) => {
      const { languages = [], valueEducation = [] } = res.payload?.data || {};
      setLanguages(languages);
      setValueEducation(valueEducation);
    });
  }, [dispatch, schoolId]);

  const handleSubmit = () => {
    dispatch(updateAdmissionOptions({
      schoolId,
      admissionOptions: {
        languages,
        valueEducation
      }
    }));
  };

  return (
    <div className="p-4">
      <Space direction="vertical" style={{ width: "100%" }}>
      <p className="font-semibold text-gray-700">Specify Available Second Languages for Students</p>
        <Input.TextArea
          rows={3}
          value={languages.join(", ")}
          onChange={(e) => setLanguages(e.target.value.split(",").map(v => v.trim()))}
          placeholder="Comma-separated languages (e.g., English, Arabic)"
        />
          <p className="font-semibold text-gray-700">Specify Core Value Education Themes</p>
        <Input.TextArea
          rows={3}
          value={valueEducation.join(", ")}
          onChange={(e) => setValueEducation(e.target.value.split(",").map(v => v.trim()))}
          placeholder="Comma-separated value education (e.g., Honesty, Respect)"
        />
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white" onClick={handleSubmit}>
          Save Options
        </Button>
      </Space>
    </div>
  );
}
