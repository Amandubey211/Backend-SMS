import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Space, Typography, Select } from "antd";
import { fetchAdmissionOptions, updateAdmissionOptions } from "../../../../Store/Slices/Common/User/actions/userActions";

const { Option } = Select;

export default function AdmissionOption({ schoolId ,onclose}) {
  const [languages, setLanguages] = useState([]);
  const [valueEducation, setValueEducation] = useState([]);
  const [newLanguage, setNewLanguage] = useState(""); // For custom languages
  const [newValueEducation, setNewValueEducation] = useState(""); // For custom value education
  const dispatch = useDispatch();

  // Universal lists for languages and value education
  const languageOptions = [
    "Arabic", "Hindi", "Urdu", "Malayalam", "Tamil", "French", 
    "Bengali", "Tagalog (Filipino)", "Punjabi", "English", 
    "Spanish", "Farsi", "Sinhala", "Turkish", "Pashto", "Russian", 
    "German", "Mandarin"
  ];

  const valueEducationOptions = [
    "Moral Science", "Islamic Studies", "Christian Studies", 
    "Ethics / Life Skills", "Other"
  ];

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
    })).then(()=>onclose());

  };

  const handleLanguageChange = (selectedLanguages) => {
    setLanguages(selectedLanguages);
  };

  const handleValueEducationChange = (selectedValues) => {
    setValueEducation(selectedValues);
  };

  const handleAddCustomLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage(""); // Clear the input
    }
  };

  const handleAddCustomValueEducation = () => {
    if (newValueEducation.trim() && !valueEducation.includes(newValueEducation)) {
      setValueEducation([...valueEducation, newValueEducation.trim()]);
      setNewValueEducation(""); // Clear the input
    }
  };

  return (
    <div className="p-4">
      <Space direction="vertical" style={{ width: "100%" }}>
        <p className="font-semibold text-gray-700">Specify Available Second Languages for Students</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select languages"
          value={languages}
          onChange={handleLanguageChange}
        >
          {languageOptions.map((language) => (
            <Option key={language} value={language}>{language}</Option>
          ))}
        </Select>
        <Input
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          placeholder="Add custom language"
          style={{ marginTop: 10 }}
        />
        <Button onClick={handleAddCustomLanguage} className="mt-2">
          Add Custom Language
        </Button>

        <p className="font-semibold text-gray-700">Specify Core Value Education Themes</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select value education themes"
          value={valueEducation}
          onChange={handleValueEducationChange}
        >
          {valueEducationOptions.map((theme) => (
            <Option key={theme} value={theme}>{theme}</Option>
          ))}
        </Select>
        <Input
          value={newValueEducation}
          onChange={(e) => setNewValueEducation(e.target.value)}
          placeholder="Add custom value education theme"
          style={{ marginTop: 10 }}
        />
        <Button onClick={handleAddCustomValueEducation} className="mt-2">
          Add Custom Value Education
        </Button>

        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white" onClick={handleSubmit}>
          Save Options
        </Button>
      </Space>
    </div>
  );
}
