import React, { useState } from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
// import ExamFeesForm from "./EarningsForm/ExamFeesForm";
import StationeryFeesForm from "./EarningsForm/StationeryFeesForm";
import DonationForm from "./EarningsForm/DonationForm";
import FundraisingForm from "./EarningsForm/FundraisingForm";
import InvestmentForm from "./EarningsForm/InvestmentForm";
import RentIncomeForm from "./EarningsForm/RentIncomeForm";
import OtherFacilityForm from "./EarningsForm/OtherFacilityForm";
import WorkshopTrainingFeesForm from "./EarningsForm/WorkshopTrainingFeesForm";
import CanteenProfitForm from "./EarningsForm/CanteenProfitForm";
import SubscriptionFeesForm from "./EarningsForm/SubscriptionFeesForm";
import ExamCenterFeesForm from "./EarningsForm/ExamCenterFeesForm";
import ParkingFeesForm from "./EarningsForm/ParkingFeesForm";
import MembershipFeesForm from "./EarningsForm/MembershipFeesForm";
import BorrowBooksForm from "./EarningsForm/BorrowBooksForm";
import BookSalesForm from "./EarningsForm/BookSalesForm";
// Import other form components...

import Header from "./Component/Header";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
const AddEarnings = () => {
  useNavHeading("Finance", "Add Earnings");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Tuition fees");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({});

  // Handler to update form data from child forms
  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  const handleReset = () => {
    console.log("Reset form");
    setFormData({});
    setDescription("");
  };

  // Save button handler to log the data
  const handleSave = () => {
    console.log("Save earnings data:", formData); // This will log the collected data
  };

  const formMapping = {
    "Stationery fees": (
      <StationeryFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    Donation: (
      <DonationForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Fund raising": (
      <FundraisingForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    Investments: (
      <InvestmentForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Rent Income": (
      <RentIncomeForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Other facility fees": (
      <OtherFacilityForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Workshop/Training fees": (
      <WorkshopTrainingFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Canteen profit": (
      <CanteenProfitForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Subscription fees": (
      <SubscriptionFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Exam center fees": (
      <ExamCenterFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Parking fees": (
      <ParkingFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Membership fees": (
      <MembershipFeesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Borrow books": (
      <BorrowBooksForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    "Book sales": (
      <BookSalesForm
        description={description}
        formData={formData}
        onFormChange={handleFormChange}
      />
    ),
    Others: <div>Other Form Placeholder</div>, // For dynamic "Others"
  };

  return (
    <Layout title="Add Earnings | Student Diwan">
      <DashLayout>
        <Header
          selectedSubCategory={selectedSubCategory}
          onCategoryChange={(category) => {
            console.log("Selected Category:", category);
          }}
          onSubCategoryChange={(subCategory) => {
            console.log("Selected Sub-Category:", subCategory);
            setSelectedSubCategory(subCategory);
            setFormData({}); // Reset form data when sub-category changes
          }}
          onReset={handleReset}
          onSave={handleSave}
          description={description}
          setDescription={setDescription}
        />
        <div className="p-5">{formMapping[selectedSubCategory] || null}</div>
      </DashLayout>
    </Layout>
  );
};

export default AddEarnings;
