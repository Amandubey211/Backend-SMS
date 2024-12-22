// src/Components/Admin/Finance/Earnings/AddEarnings.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Header from "./Component/Header";
import { categories, subCategories } from "./constants/categories";
import { keysToCamel } from "../../../../../Utils/camelCase";
import { setReadOnly } from "../../../../../Store/Slices/Finance/Earnings/earningsSlice";
import {
  addEarnings,
  updateEarnings,
} from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons"; // Ant Design's edit icon
import { formComponentsMap, initialValuesMap } from "./Config/formConfig";
import { validationSchemas } from "./Config/validationSchemas";
import toast from "react-hot-toast";

const AddEarnings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { readOnly, loading, error } = useSelector(
    (state) => state.admin.earnings
  );

  const [selectedCategory, setSelectedCategory] = useState(
    "Facility-Based Revenue"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState("Rent Income");
  const [description, setDescription] = useState("");
  const [showError, setShowErrorLocal] = useState(false); // Local state for error visibility

  // Memoize form mapping based on the selected category
  const formMapping = useMemo(
    () => formComponentsMap[selectedCategory] || {},
    [selectedCategory]
  );

  // Handle the transition from read-only to editable mode
  const handleEdit = () => {
    dispatch(setReadOnly(false));
  };

  // Function to get initial form values based on the current state
  const getInitialValues = () => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      const subCategory = incomeData.subCategory;
      const revenueType = categories.find((type) =>
        subCategories[type].includes(subCategory)
      );

      return {
        categoryName: incomeData.categoryName || selectedCategory,
        subCategory: incomeData.subCategory || selectedSubCategory,
        ...initialValuesMap[subCategory],
        description: incomeData.description || "",
      };
    }

    // Initialize fields based on the selectedSubCategory
    const initialValues = {
      categoryName: selectedCategory,
      subCategory: selectedSubCategory,
      ...initialValuesMap[selectedSubCategory],
      description: "",
    };

    return initialValues;
  };

  // Reset the form to its initial state
  const handleReset = (resetForm) => {
    resetForm();
    setDescription("");
    if (location.state && location.state.incomeData) {
      navigate(-1);
    } else {
      // Reset to default category and subCategory
      setSelectedCategory("Facility-Based Revenue");
      setSelectedSubCategory("Rent Income");
    }
  };

  // Handle form submission for adding or updating earnings
  const handleSaveOrUpdate = async (values, actions) => {
    try {
      // Destructure fields
      const { categoryName, subCategory, description, receipt, ...rest } =
        values;

      let specificFields = {};

      switch (subCategory) {
        case "Rent Income":
          specificFields = {
            name: values.name,
            startDate: values.startDate,
            endDate: values.endDate,
            nameOfRenter: values.nameOfRenter,
          };
          break;
        case "Exam Center Fees":
          specificFields = {
            // examCentreFees: {
            examName: values.examName,
            startDate: values.startDate,
            endDate: values.endDate,
            mobileNumber: values.mobileNumber,
            // },
          };
          break;
        case "Parking Fees":
          specificFields = {
            // parkingFees: {
            vehicleType: values.vehicleType,
            name: values.name,
            userType: values.userType,
            otherVehicleDetails: values.otherVehicleDetails,
            otherUserDetails: values.otherUserDetails,
            // },
          };
          break;
        case "Stationery Fees":
          specificFields = {
            stationeryItems: values.stationeryItems,
          };
          break;
        case "Other Facility Fees":
          specificFields = {
            facilityName: values.facilityName,
            accessDuration: values.accessDuration,
          };
          break;
        case "Subscription Fees":
          specificFields = {
            subscriptionName: values.subscriptionName,
            description: values.description, // Assuming description is part of Subscription Fees
          };
          break;
        case "Workshop/Training Fees":
          specificFields = {
            sessionTitle: values.sessionTitle,
            hostName: values.hostName,
            timePeriod: values.timePeriod,
          };
          break;
        case "Canteen Profit":
          specificFields = {
            periodOfEarnings: values.periodOfEarnings,
            description: values.description,
          };
          break;
        case "Donations":
          specificFields = {
            name: values.name,
            phoneNumber: values.phoneNumber,
            address: values.address,
          };
          break;
        case "Fundraising/Sponsorships":
          specificFields = {
            companyName: values.companyName,
            phoneNumber: values.phoneNumber,
            address: values.address,
          };
          break;
        case "Investments":
          specificFields = {
            name: values.name,
            profitOrLoss: values.profitOrLoss,
            fromDate: values.fromDate,
            toDate: values.toDate,
            investmentAmount: values.investmentAmount,
            returnAmount: values.returnAmount,
          };
          break;
        // Add other subCategories as needed
        default:
          break;
      }

      // Construct the nested payload
      const payload = {
        categoryName, // Top-level field
        subCategory, // Top-level field
        description, // Top-level field
        receipt, // Top-level field
        paymentType: values.paymentType,
        paymentStatus: values.paymentStatus,
        paid_amount: values.paid_amount,
        paidBy: values.paidBy,
        advance_amount: values.advance_amount,
        remaining_amount: values.remaining_amount,
        tax: values.tax,
        discountType: values.discountType,
        discount: values.discount,
        penalty: values.penalty,
        frequencyOfPayment: values.frequencyOfPayment,
        dateTime: values.dateTime,
        total_amount: values.total_amount,
        final_amount: values.final_amount,
        ...specificFields,
      };

      // Convert all numeric fields to numbers to prevent NaN
      const numericFields = [
        "paid_amount",
        "advance_amount",
        "remaining_amount",
        "tax",
        "discount",
        "penalty",
        "total_amount",
        "final_amount",
        "investmentAmount",
        "returnAmount",
        // Add other numeric fields as necessary
      ];

      numericFields.forEach((field) => {
        if (payload[field] === "" || payload[field] === null) {
          payload[field] = 0;
        } else {
          payload[field] = Number(payload[field]);
        }
      });

      const category = selectedCategory;

      if (location.state && location.state.incomeData && !readOnly) {
        // Update existing record
        const id = values._id;
        await dispatch(
          updateEarnings({ values: payload, category, id })
        ).unwrap();
        toast.success("Earnings updated successfully!");
        navigate("/finance/total-revenue-list");
      } else if (!location.state?.incomeData) {
        // Add new record
        await dispatch(addEarnings({ values: payload, category })).unwrap();
        toast.success("Earnings added successfully!");
        navigate("/finance/total-revenue-list");
      }
    } catch (err) {
      // dispatch(setShowError(true));
      toast.error(err || "An unexpected error occurred while saving the data.");
      console.error("Error while saving data:", err);
      setShowErrorLocal(true); // Show the error message
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Initialize component state based on location state
  useEffect(() => {
    if (location.state && location.state.incomeData) {
      const incomeData = keysToCamel(location.state.incomeData);
      console.log(incomeData, "Income Data Loaded");
      setSelectedCategory(incomeData.categoryName || "Facility-Based Revenue");
      setSelectedSubCategory(incomeData.subCategory || "Rent Income");
      setDescription(incomeData.description || "");
    } else {
      dispatch(setReadOnly(false));
    }
  }, [location.state, dispatch]);

  // Get the appropriate validation schema based on the selected sub-category
  const getValidationSchema = () => {
    return validationSchemas[selectedSubCategory] || Yup.object({});
  };

  // Auto-hide the error message after 5 seconds
  useEffect(() => {
    let timer;
    if (error) {
      setShowErrorLocal(true);
      timer = setTimeout(() => {
        setShowErrorLocal(false);
        // dispatch(setShowError(false)); // Reset the error in Redux store
      }, 3000); // 5 seconds
    }
    return () => clearTimeout(timer);
  }, [error, dispatch]);

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
          // validationSchema={getValidationSchema()}
          onSubmit={handleSaveOrUpdate}
        >
          {({ resetForm, isSubmitting, values }) => (
            <Form className="p-3">
              {/* Read-Only Mode Notification */}
              {readOnly && (
                <div className="flex justify-between items-center bg-yellow-100 text-yellow-700 p-2 rounded-md text-sm">
                  <span>
                    Currently in read-only mode. You cannot edit these fields.
                  </span>
                  <Button
                    type="primary"
                    size="small"
                    icon={<EditOutlined />}
                    className="flex items-center"
                    style={{
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {/* {error && showError && (
                <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                  {error?.map((err, idx) => (
                    <div key={idx}>{err.msg}</div>
                  ))}
                </div>
              )} */}

              {/* Header with Dropdowns and Description */}
              <Header
                onCategoryChange={(category) => {
                  if (readOnly) return;
                  setSelectedCategory(category);
                  const firstSubCategory = subCategories[category][0];
                  setSelectedSubCategory(firstSubCategory);
                  resetForm({
                    values: {
                      categoryName: category,
                      subCategory: firstSubCategory,
                      ...initialValuesMap[firstSubCategory],
                      description: "",
                      // Initialize nested fields based on subCategory
                      ...(firstSubCategory === "Exam Center Fees" && {
                        examName: "",
                        startDate: "",
                        endDate: "",
                        mobileNumber: "",
                      }),
                      ...(firstSubCategory === "Rent Income" && {
                        name: "",
                        startDate: "",
                        endDate: "",
                        nameOfRenter: "",
                      }),
                      ...(firstSubCategory === "Parking Fees" && {
                        vehicleType: "",
                        name: "",
                        userType: "",
                        otherVehicleDetails: "",
                        otherUserDetails: "",
                      }),
                      ...(firstSubCategory === "Stationery Fees" && {
                        stationeryItems: [
                          {
                            itemName: "",
                            quantity: "",
                            unitCost: "",
                          },
                        ],
                      }),
                      ...(firstSubCategory === "Other Facility Fees" && {
                        facilityName: "",
                        accessDuration: "",
                      }),
                      ...(firstSubCategory === "Subscription Fees" && {
                        subscriptionName: "",
                        description: "",
                      }),
                      ...(firstSubCategory === "Workshop/Training Fees" && {
                        sessionTitle: "",
                        hostName: "",
                        timePeriod: "",
                      }),
                      ...(firstSubCategory === "Canteen Profit" && {
                        periodOfEarnings: "",
                        description: "",
                      }),
                      ...(firstSubCategory === "Donations" && {
                        name: "",
                        phoneNumber: "",
                        address: "",
                      }),
                      ...(firstSubCategory === "Fundraising/Sponsorships" && {
                        companyName: "",
                        phoneNumber: "",
                        address: "",
                      }),
                      ...(firstSubCategory === "Investments" && {
                        name: "",
                        profitOrLoss: "",
                        fromDate: "",
                        toDate: "",
                        investmentAmount: "",
                        returnAmount: "",
                      }),
                      // Add other subCategories as needed
                    },
                  });
                  setDescription("");
                }}
                onSubCategoryChange={(subCategory) => {
                  if (readOnly) return;
                  setSelectedSubCategory(subCategory);
                  resetForm({
                    values: {
                      categoryName: selectedCategory,
                      subCategory: subCategory,
                      ...initialValuesMap[subCategory],
                      description: "",
                      // Initialize nested fields based on subCategory
                      ...(subCategory === "Exam Center Fees" && {
                        examName: "",
                        startDate: "",
                        endDate: "",
                        mobileNumber: "",
                      }),
                      ...(subCategory === "Rent Income" && {
                        name: "",
                        startDate: "",
                        endDate: "",
                        nameOfRenter: "",
                      }),
                      ...(subCategory === "Parking Fees" && {
                        vehicleType: "",
                        name: "",
                        userType: "",
                        otherVehicleDetails: "",
                        otherUserDetails: "",
                      }),
                      ...(subCategory === "Stationery Fees" && {
                        stationeryItems: [
                          {
                            itemName: "",
                            quantity: "",
                            unitCost: "",
                          },
                        ],
                      }),
                      ...(subCategory === "Other Facility Fees" && {
                        facilityName: "",
                        accessDuration: "",
                      }),
                      ...(subCategory === "Subscription Fees" && {
                        subscriptionName: "",
                        description: "",
                      }),
                      ...(subCategory === "Workshop/Training Fees" && {
                        sessionTitle: "",
                        hostName: "",
                        timePeriod: "",
                      }),
                      ...(subCategory === "Canteen Profit" && {
                        periodOfEarnings: "",
                        description: "",
                      }),
                      ...(subCategory === "Donations" && {
                        name: "",
                        phoneNumber: "",
                        address: "",
                      }),
                      ...(subCategory === "Fundraising/Sponsorships" && {
                        companyName: "",
                        phoneNumber: "",
                        address: "",
                      }),
                      ...(subCategory === "Investments" && {
                        name: "",
                        profitOrLoss: "",
                        fromDate: "",
                        toDate: "",
                        investmentAmount: "",
                        returnAmount: "",
                      }),
                      // Add other subCategories as needed
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

              {/* Render the selected form component */}
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
