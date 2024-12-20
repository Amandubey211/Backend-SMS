// src/Components/Admin/Finance/Earnings/AddEarnings.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

import { categories, subCategories } from "./constants/categories";
import { initialValuesMap } from "./constants/formInitialValues";
import { keysToCamel } from "../../../../../Utils/camelCase";
import { setReadOnly } from "../../../../../Store/Slices/Finance/Earnings/earningsSlice";
import {
  addEarnings,
  updateEarnings,
} from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { setShowError } from "../../../../../Store/Slices/Common/Alerts/alertsSlice";

const AddEarnings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const readOnly = useSelector((state) => state.admin.earnings.readOnly);
  const loading = useSelector((state) => state.admin.earnings.loading);
  const error = useSelector((state) => state.admin.earnings.error);

  const [selectedCategory, setSelectedCategory] = useState(
    "Student-Based Revenue"
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Tuition Fees");
  const [description, setDescription] = useState("");

  // Map subCategories to forms
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

  const getInitialValues = () => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      const subCategory = incomeData.subCategory;
      return { ...initialValuesMap[subCategory], ...incomeData };
    }
    return initialValuesMap[selectedSubCategory] || {};
  };

  const handleReset = (resetForm) => {
    resetForm();
    setDescription("");
    if (location.state && location.state.incomeData) {
      navigate(-1);
    }
  };

  const handleSaveOrUpdate = async (values, actions) => {
    try {
      // Prepare payload for backend
      const payload = {
        categoryName: selectedCategory,
        subCategory: selectedSubCategory,
        description: description || values.description,

        paymentType: values.paymentType || "cash",
        paymentStatus: values.paymentStatus || "paid",
        tax: values.tax || 0,
        discountType: values.discountType || "percentage",
        discount: values.discount || 0,
        penalty: values.penalty || 0,
        total_amount: values.totalAmount || 0,
        final_amount: values.finalAmount || 0,
        paid_amount: values.paidAmount || 0,
        remaining_amount: values.remainingAmount || 0,
        advance_amount: values.advanceAmount || 0,
        // Additional fields for Rent Income (or other subcategories) if needed
        name: values.name,
        nameOfRenter: values.nameOfRenter,
        startDate: values.startDate,
        endDate: values.endDate,
      };

      const category = selectedCategory;

      if (location.state && location.state.incomeData && !readOnly) {
        // Update existing record
        const id = values._id;
        await dispatch(
          updateEarnings({ values: payload, category, id })
        ).unwrap();
        navigate(-1);
      } else if (!location.state?.incomeData) {
        // Add new record
        await dispatch(addEarnings({ values: payload, category })).unwrap();
        navigate(-1);
      }
    } catch (err) {
      dispatch(setShowError(true));
      console.error("Error while saving data:", err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      setSelectedCategory(incomeData.category);
      setSelectedSubCategory(incomeData.subCategory);
      setDescription(incomeData.description || "");
    } else {
      dispatch(setReadOnly(false));
    }
  }, [location.state, dispatch]);

  return (
    <Layout
      title={
        location.state && location.state.incomeData
          ? readOnly
            ? "View Earnings | Student Diwan"
            : "Update Earnings | Student Diwan"
          : "Add Earnings | Student Diwan"
      }
    >
      <DashLayout>
        <Formik
          enableReinitialize
          initialValues={getInitialValues()}
          onSubmit={handleSaveOrUpdate}
        >
          {({ resetForm, isSubmitting }) => (
            <Form className="p-5 space-y-4">
              {readOnly && (
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded-md text-sm">
                  Currently in read-only mode. You cannot edit these fields.
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              {!readOnly && (
                <Header
                  onCategoryChange={(category) => {
                    if (readOnly) return;
                    setSelectedCategory(category);
                    const firstSubCategory = subCategories[category][0];
                    setSelectedSubCategory(firstSubCategory);
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
                    if (readOnly) return;
                    setSelectedSubCategory(subCategory);
                    resetForm({
                      values: {
                        ...initialValuesMap[subCategory],
                        subCategory,
                      },
                    });
                    setDescription("");
                  }}
                  onReset={() => handleReset(resetForm)}
                  description={description}
                  setDescription={readOnly ? () => {} : setDescription}
                  initialCategory={selectedCategory}
                  initialSubCategory={selectedSubCategory}
                  isUpdate={!!location.state?.incomeData}
                />
              )}

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
