// formConfig.js
export const studentFeesFormConfig = {
  title: "Student Details",
  fields: [
    {
      type: "text",
      name: "studentName",
      label: "Student Name",
      placeholder: "Enter Name",
    },
    {
      type: "text",
      name: "class",
      label: "Class",
      placeholder: "Enter Class",
    },
    {
      type: "text",
      name: "section",
      label: "Section",
      placeholder: "Enter Section",
    },
    {
      type: "date",
      name: "dueDate",
      label: "Due Date",
    },
    {
      type: "time",
      name: "dueTime",
      label: "Due Time",
    },
    {
      type: "number",
      name: "tax",
      label: "Tax Percentage",
      placeholder: "Enter Tax Percentage",
    },
    {
      type: "number",
      name: "discount",
      label: "Discount Percentage",
      placeholder: "Enter Discount",
    },
    {
      type: "file",
      name: "receipt",
      label: "Upload Receipt",
    },
    // Add more fields as needed...
  ],
};
