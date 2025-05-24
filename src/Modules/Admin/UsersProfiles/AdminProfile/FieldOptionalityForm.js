import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Table, Select, Button, Space, Input } from "antd";
const { Option } = Select;

export default function FieldOptionalityForm({fields, setFields }) {

  const fieldNames = [
    "placeOfBirth","studentId","idExpiry","passportNumber","passportExpiry",
 "contactNumber", "nationality","religion", "fatherInfo", 
    "motherInfo", 
    "address", "academicHistory", "valueEducation", "medicalCondition", 
    "secondLanguage", "thirdLanguage","sourceOfFee","previousSchoolName",
    "previousClass","lastDayAtSchool","curriculum"
  ];  // List all fields from the student model

  const nestedFields = {
    address: [
      "type",
      "unitNumber",
      "buildingNumber",
      "streetNumber",
      "streetName",
      "zone",
      "compoundType",
      "compoundName",
      "nearestLandmark",
      "proposedCampus",
    ],
    fatherInfo: [
      "idNumber",
    "idExpiry",
    "middleName",
    "religion",
    "nationality",
    "company",
    "jobTitle",
    "cell1",
    "cell2",
    "workPhone",
    "homePhone",
    "email1",
    "email2",
    "fatherPhoto",
    ],
    motherInfo: [
      "idNumber",
    "idExpiry",
    "middleName",
    "religion",
    "nationality",
    "company",
    "jobTitle",
    "cell1",
    "cell2",
    "workPhone",
    "homePhone",
    "email1",
    "email2",
    "motherPhoto",
    ]
  };

  useEffect(() => {
    if(fields?.length < 1){
      const initialFields = fieldNames.map(field => {
        if (nestedFields[field]) {
          return nestedFields[field]?.map(nestedField => ({
            fieldName: `${field}.${nestedField}`,
            required: false
          }));
        }
        return {
          fieldName: field,
          required:  false
        };
      })?.flat();
      
      setFields(initialFields);
    }
  }, []);

  const handleChange = (value, fieldName) => {
    setFields(prevFields => 
      prevFields.map(field => 
        field.fieldName === fieldName ? { ...field, required: value == true } : field
      )
    );
  };

  const formatLabel = (text)=> {
    return text
      .split('.')
      .map(part =>
        part
          .replace(/([A-Z])/g, ' $1') 
          .replace(/^./, str => str.toUpperCase()) 
      )
      .join(' - ');
  }
  const columns = [
    {
      title: "Field Name",
      dataIndex: "fieldName",
      key: "fieldName",
      render: text => <span>{formatLabel(text)}</span>
    },
    {
      title: "Field Optionality",
      dataIndex: "fieldOptionality",
      key: "fieldOptionality",
      render: (text, record) => (
        <Select 
          value={record.required == true ? "required" : "optional"} 
          onChange={value => handleChange(value, record.fieldName)} 
          style={{ width: 120 }}
        >
          <Option value={false}>Optional</Option>
          <Option value={true}>Required</Option>
        </Select>
      )
    }
  ];

  const data = fields.map((field, index) => ({
    key: index,
    fieldName: field.fieldName,
    required: field.required
  }));

  return (
    <div className="p-4">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={false} 
          rowKey="fieldName" 
        />
      </Space>
    </div>
  );
}
