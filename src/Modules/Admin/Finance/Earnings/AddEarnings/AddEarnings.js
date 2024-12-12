import React, { useState } from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";

// Import your custom forms
import StudentFeesForm from "./EarningsForm/StudentFeesForm";
import ExamFeesForm from "./EarningsForm/ExamFeesForm";
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

import Header from "./Component/Header";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

// A mapping of sub-category to the corresponding form component
const formMapping = {
  "Tuition fees": <StudentFeesForm />,
  "Exam fees": <ExamFeesForm />,
  "Stationery fees": <StationeryFeesForm />,
  Donation: <DonationForm />,
  "Fund raising": <FundraisingForm />,
  Investments: <InvestmentForm />,
  "Rent Income": <RentIncomeForm />,
  "Other facility fees": <OtherFacilityForm />,
  "Workshop/Training fees": <WorkshopTrainingFeesForm />,
  "Canteen profit": <CanteenProfitForm />,
  "Subscription fees": <SubscriptionFeesForm />,
  "Exam center fees": <ExamCenterFeesForm />,
  "Parking fees": <ParkingFeesForm />,
  "Membership fees": <MembershipFeesForm />,
  "Borrow books": <BorrowBooksForm />,
  "Book sales": <BookSalesForm />,
};

const AddEarnings = () => {
  useNavHeading("Finance", "Add Earnings");

  // State to track the currently selected sub-category (used to render the right form)
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Tuition fees");

  // Callback to update the category (currently just logs; you can extend as needed)
  const handleCategoryChange = (category) => {
    console.log("Selected Category:", category);
    // Optionally, reset the selected sub-category if needed
  };

  // Callback to update the sub-category
  const handleSubCategoryChange = (subCategory) => {
    console.log("Selected Sub-Category:", subCategory);
    setSelectedSubCategory(subCategory);
  };

  // Optionally implement reset/save handlers if needed
  const handleReset = () => {
    console.log("Reset form");
    // Add logic to reset states here
  };

  const handleSave = () => {
    console.log("Save earnings");
    // Add logic to save form data (e.g., send POST request to your Node/Express API)
  };

  return (
    <Layout title="ADD Earnings | Student Diwan">
      <DashLayout>
        <Header
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
          onReset={handleReset}
          onSave={handleSave}
        />
        <div className="mt-6">
          {/* Render the corresponding form based on the selected sub-category */}
          {formMapping[selectedSubCategory] || null}
        </div>
      </DashLayout>
    </Layout>
  );
};

export default AddEarnings;
