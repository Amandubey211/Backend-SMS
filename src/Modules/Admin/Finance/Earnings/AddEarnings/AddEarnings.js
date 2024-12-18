// AddEarnings.jsx
import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./Component/Header";
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
import { categories, subCategories } from "./constants/categories"; // Adjust the path as necessary
import { initialValuesMap } from "./constants/formInitialValues"; // Import initialValuesMap
import { Formik, Form } from "formik"; // Ensure only one Formik import
import { keysToCamel } from "../../../../../Utils/camelCase";

const AddEarnings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(
    "Student-Based Revenue"
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Tuition Fees");
  const [description, setDescription] = useState("");

  // Define form mapping
  const formMapping = useMemo(
    () => ({
      "Tuition Fees": <StudentFeesForm />,
      "Exam Fees": <ExamFeesForm />,
      "Stationery Fees": <StationeryFeesForm />,
      Donations: <DonationForm />,
      "Fundraising/Sponsorships": <FundraisingForm />,
      Investments: <InvestmentForm />,
      "Rent Income": <RentIncomeForm />,
      "Other Facility Fees": <OtherFacilityForm />,
      "Workshop/Training Fees": <WorkshopTrainingFeesForm />,
      "Canteen Profit": <CanteenProfitForm />,
      "Subscription Fees": <SubscriptionFeesForm />,
      "Exam Center Fees": <ExamCenterFeesForm />,
      "Parking Fees": <ParkingFeesForm />,
      "Membership fees": <MembershipFeesForm />,
      "Borrow Books": <BorrowBooksForm />,
      "Book Sales": <BookSalesForm />,
      Other: <div>Other form placeholder</div>,
    }),
    []
  );

  // Function to get initial values based on subcategory
  const getInitialValues = () => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      const subCategory = incomeData.subCategory;
      return { ...initialValuesMap[subCategory], ...incomeData };
    }

    // Return default values based on selectedSubCategory
    return initialValuesMap[selectedSubCategory] || {};
  };

  // Function to handle form reset
  const handleReset = (resetForm) => {
    resetForm();
    setDescription("");
    if (location.state && location.state.incomeData) {
      navigate(-1); // Go back to the list page
    }
  };

  // Function to handle form submission
  const handleSaveOrUpdate = (values, actions) => {
    if (location.state && location.state.incomeData) {
      console.log("Updating earnings data:", values);
      // dispatch(updateEarnings(values));
    } else {
      console.log("Saving new earnings data:", values);
      // dispatch(addEarnings(values));
    }
    actions.setSubmitting(false);
    // navigate("/earnings-list"); // Uncomment if you want to redirect after submission
  };

  // Effect to preload form data if editing
  useEffect(() => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      console.log(incomeData);
      setSelectedCategory(incomeData.category);
      setSelectedSubCategory(incomeData.subCategory);
      setDescription(incomeData.description || "");
    }
  }, [location.state]);

  return (
    <Layout
      title={
        location.state && location.state.incomeData
          ? "Update Earnings | Student Diwan"
          : "Add Earnings | Student Diwan"
      }
    >
      <DashLayout>
        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          // validationSchema={getValidationSchema(selectedSubCategory)}
          onSubmit={handleSaveOrUpdate}
        >
          {({ setFieldValue, handleSubmit, resetForm, values }) => (
            <Form className="p-5">
              <Header
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  const firstSubCategory = subCategories[category][0];
                  setSelectedSubCategory(firstSubCategory);

                  // Reset form when category changes
                  resetForm({
                    values: {
                      ...initialValuesMap[firstSubCategory],
                      category,
                      subCategory: firstSubCategory,
                    },
                  });
                  setDescription("");
                }}
                onSubCategoryChange={(subCategory) => {
                  setSelectedSubCategory(subCategory);

                  // Reset form when subcategory changes
                  resetForm({
                    values: {
                      ...initialValuesMap[subCategory],
                      subCategory,
                    },
                  });
                  setDescription("");
                }}
                onReset={() => handleReset(resetForm)}
                onSave={() => handleSubmit()}
                description={description}
                setDescription={setDescription}
                initialCategory={selectedCategory}
                initialSubCategory={selectedSubCategory}
              />

              {/* Render the appropriate form based on the selected subcategory */}
              {formMapping[selectedSubCategory] || (
                <div>Select a sub-category to proceed.</div>
              )}
            </Form>
          )}
        </Formik>
      </DashLayout>
    </Layout>
  );
};

export default AddEarnings;
