import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Space, Select } from "antd";
import { fetchAdmissionOptions, updateAdmissionOptions } from "../../../../Store/Slices/Common/User/actions/userActions";
import FieldOptionalityForm from "./FieldOptionalityForm";

const { Option } = Select;

export default function AdmissionOption({ schoolId, onClose }) {
  const [secondLanguages, setSecondLanguages] = useState([]);
  const [thirdLanguages, setThirdLanguages] = useState([]);
  const [newSecondLanguage, setNewSecondLanguage] = useState(""); // For custom second language
  const [newThirdLanguage, setNewThirdLanguage] = useState(""); // For custom third language
  const [valueEducation, setValueEducation] = useState([]);
  const [newValueEducation, setNewValueEducation] = useState(""); // For custom value education
  const dispatch = useDispatch();

  // Universal lists for value education
  const valueEducationOptions = [
    "Moral Science", "Islamic Studies", "Christian Studies", 
    "Ethics / Life Skills", "Other"
  ];

  // Static list of language options
  const languageOptions = [
    "Arabic", "Hindi", "Urdu", "Malayalam", "Tamil", "French", 
    "Bengali", "Tagalog (Filipino)", "Punjabi", "English", 
    "Spanish", "Farsi", "Sinhala", "Turkish", "Pashto", "Russian", 
    "German", "Mandarin"
  ];
  const [fields, setFields] = useState([]);
  useEffect(() => {
    setSecondLanguages([]);
    setThirdLanguages([]);
    setValueEducation([]);
    dispatch(fetchAdmissionOptions(schoolId)).then((res) => {
      const { languageOptions = {}, valueEducation = [] ,fieldOptionality} = res.payload?.data || {};
      setSecondLanguages(prevState => [...prevState, ...languageOptions?.secondLanguages || []]);
      setThirdLanguages(prevState => [...prevState, ...languageOptions?.thirdLanguages || []]);
      setValueEducation(prevState => [...prevState, ...valueEducation]);
      if(fieldOptionality?.length > 0){
        setFields(fieldOptionality)
      }
    });
  }, [dispatch, schoolId]);


  const handleSecondLanguageChange = (selectedLanguages) => {
    setSecondLanguages(selectedLanguages);
  };

  const handleThirdLanguageChange = (selectedLanguages) => {
    setThirdLanguages(selectedLanguages);
  };

  const handleValueEducationChange = (selectedValues) => {
    setValueEducation(selectedValues);
  };

  const handleAddCustomSecondLanguage = () => {
    if (newSecondLanguage.trim() && !secondLanguages.includes(newSecondLanguage)) {
      setSecondLanguages([...secondLanguages, newSecondLanguage.trim()]);
      setNewSecondLanguage(""); // Clear the input
    }
  };

  const handleAddCustomThirdLanguage = () => {
    if (newThirdLanguage.trim() && !thirdLanguages.includes(newThirdLanguage)) {
      setThirdLanguages([...thirdLanguages, newThirdLanguage.trim()]);
      setNewThirdLanguage(""); 
    }
  };

  const handleAddCustomValueEducation = () => {
    if (newValueEducation.trim() && !valueEducation.includes(newValueEducation)) {
      setValueEducation([...valueEducation, newValueEducation.trim()]);
      setNewValueEducation(""); 
    }
  };
 
  
  const handleSubmit = () => {
    dispatch(updateAdmissionOptions({
      schoolId,
      admissionOptions: {
        languageOptions: {
          secondLanguages,
          thirdLanguages
        },
        valueEducation,
        fieldOptionality:fields
      }
    })).then(() => onClose());
  };
  return (
    <div className="p-4">
      <Space direction="vertical" style={{ width: "100%" }}>
        <p className="font-semibold text-gray-700">Specify Available Second Languages for Students</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select second languages"
          value={secondLanguages}
          onChange={handleSecondLanguageChange}
        >
          {languageOptions.map((language) => (
            <Option key={language} value={language}>{language}</Option>
          ))}
        </Select>
        <Input
          value={newSecondLanguage}
          onChange={(e) => setNewSecondLanguage(e.target.value)}
          placeholder="Add custom second language"
          style={{ marginTop: 10 }}
        />
        <Button onClick={handleAddCustomSecondLanguage} className="mt-2">
          Add Custom Second Language
        </Button>

        <p className="font-semibold text-gray-700">Specify Available Third Languages for Students</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select third languages"
          value={thirdLanguages}
          onChange={handleThirdLanguageChange}
        >
          {languageOptions.map((language) => (
            <Option key={language} value={language}>{language}</Option>
          ))}
        </Select>
        <Input
          value={newThirdLanguage}
          onChange={(e) => setNewThirdLanguage(e.target.value)}
          placeholder="Add custom third language"
          style={{ marginTop: 10 }}
        />
        <Button onClick={handleAddCustomThirdLanguage} className="mt-2">
          Add Custom Third Language
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

<div>
  <FieldOptionalityForm fields={fields} setFields={setFields} schoolId={schoolId} handleSubmit={handleSubmit}/>
</div>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white m-4 mb-10 w-full" onClick={handleSubmit}>
          Save Options
        </Button>
      </Space>
    </div>
  );
}
