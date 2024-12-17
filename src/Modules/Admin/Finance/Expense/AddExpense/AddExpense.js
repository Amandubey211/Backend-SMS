import React, { useState } from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
// import ExpenseForm from "./ExpenseForm/ExpenseForm";
// import Header from "./Component/Header";

const AddExpense = () => {
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Salaries and Wages");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({});

  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const handleReset = () => {
    console.log("Reset form");
    setFormData({});
    setDescription("");
  };

  const handleSave = () => {
    console.log("Save expense data:", formData);
  };

  // const expenseForms = {
  //   "Salaries and Wages": (
  //     <ExpenseForm
  //       description={description}
  //       formData={formData}
  //       onFormChange={handleFormChange}
  //     />
  //   ),
  //   // "Utility bills": (
  //   //   <ExpenseForm
  //   //     description={description}
  //   //     formData={formData}
  //   //     onFormChange={handleFormChange}
  //   //   />
  //   // ),
  //   // "Maintenance costs": (
  //   //   <ExpenseForm
  //   //     description={description}
  //   //     formData={formData}
  //   //     onFormChange={handleFormChange}
  //   //   />
  //   // ),
  //   Others: <div>Other Expense Placeholder</div>,
  // };

  return (
    <Layout title="Add Expense | Student Diwan">
      <DashLayout>
        {/* <Header
          selectedSubCategory={selectedSubCategory}
          onCategoryChange={(category) => {
            console.log("Selected Category:", category);
          }}
          onSubCategoryChange={(subCategory) => {
            console.log("Selected Sub-Category:", subCategory);
            setSelectedSubCategory(subCategory);
            setFormData({});
          }}
          onReset={handleReset}
          onSave={handleSave}
          description={description}
          setDescription={setDescription}
        /> */}
        {/* <div className="p-5">{expenseForms[selectedSubCategory] || null}</div> */}
      </DashLayout>
    </Layout>
  );
};

export default AddExpense;
