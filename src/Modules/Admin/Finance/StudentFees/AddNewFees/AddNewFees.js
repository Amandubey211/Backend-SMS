import React, { useState } from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import Header from "./Component/Header";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
// Import custom forms
import StudentFeesForm from "./AddFeesForm/StudentFeesForm";
import StationeryFeesForm from "./AddFeesForm/StationeryFeesForm";
import RentIncomeForm from "./AddFeesForm/RentIncomeForm";
import ParkingFeesForm from "./AddFeesForm/ParkingFeesForm";
import WorkshopTrainingFeesForm from "./AddFeesForm/WorkshopTrainingFeesForm";
import SubscriptionFeesForm from "./AddFeesForm/SubscriptionFeesForm";
import OtherFacilityForm from "./AddFeesForm/OtherFacilityForm";

// Subcategory-to-form mapping
const formMapping = {
    "Student Fees": <StudentFeesForm />,
    "Stationery Fees": <StationeryFeesForm />,
    "Rent Income": <RentIncomeForm />,
    "Parking Fees": <ParkingFeesForm />,
    "Workshop/Training Fees": <WorkshopTrainingFeesForm />,
    "Subscription Fees": <SubscriptionFeesForm />,
    "Other Facility": <OtherFacilityForm />,
};

const AddNewFees = () => {

    useNavHeading("Finance", "Add New Fees");
    const [selectedSubCategory, setSelectedSubCategory] = useState("Student Fees");

    // Handle sub-category selection
    const handleSubCategoryChange = (subCategory) => {
        setSelectedSubCategory(subCategory);
    };

    // Handlers for reset and save
    const handleReset = () => console.log("Resetting form...");
    const handleSave = () => console.log("Saving data...");

    return (
        <Layout title="Add New Fees | Finance">
            <DashLayout>
                <Header
                    onSubCategoryChange={handleSubCategoryChange}
                    onReset={handleReset}
                    onSave={handleSave}
                />
                <div className="mt-6">
                    {/* Render selected form */}
                    {formMapping[selectedSubCategory]}
                </div>
            </DashLayout>
        </Layout>
    );
};

export default AddNewFees;
