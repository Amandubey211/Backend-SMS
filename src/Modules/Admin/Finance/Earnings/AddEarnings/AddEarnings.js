// src/Components/Admin/Finance/Earnings/AddEarnings.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Header from "./Component/Header";
import { categories, subCategories } from "./constants/categories";
import {
  setReadOnly,
  clearSelectedIncome,
} from "../../../../../Store/Slices/Finance/Earnings/earningsSlice";
import {
  addEarnings,
  updateEarnings,
} from "../../../../../Store/Slices/Finance/Earnings/earningsThunks";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { formComponentsMap, initialValuesMap } from "./Config/formConfig";
import { validationSchemas } from "./Config/validationSchemas";
import toast from "react-hot-toast";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import ProtectedAction from "../../../../../Routes/ProtectedRoutes/ProtectedAction";
import { PERMISSIONS } from "../../../../../config/permission";

const AddEarnings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve readOnly, loading, error, and selectedIncome from Redux
  const { readOnly, loading, error, selectedIncome } = useSelector(
    (state) => state.admin.earnings
  );

  const [selectedCategory, setSelectedCategory] = useState(
    "Facility-Based Revenue"
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState("Rent Income");
  const [description, setDescription] = useState("");
  const [showError, setShowErrorLocal] = useState(false); // Local state for error visibility

  // Memoize form component based on the selected category and subcategory
  const formComponent = useMemo(() => {
    const SubCategoryComponent =
      formComponentsMap[selectedCategory]?.[selectedSubCategory];
    return SubCategoryComponent ? (
      <SubCategoryComponent readOnly={readOnly} />
    ) : null;
  }, [selectedCategory, selectedSubCategory, formComponentsMap, readOnly]);

  // Function to get initial form values based on the selectedIncome
  const getInitialValues = () => {
    if (selectedIncome) {
      const incomeData = selectedIncome;
      console.log("Prefilled Income Data:", incomeData); // Debugging line

      // **1. Extract 'subCategory' correctly from 'selectedIncome'**
      const subCategory = incomeData.subCategory || incomeData.sub_category;

      const categoryName =
        incomeData.category?.categoryName || "Facility-Based Revenue";

      console.log(categoryName, "categoryNamecategoryName");
      // **2. Extract subcategory-specific fields from 'selectedIncome'**
      // Assuming subcategory-specific data is directly present in 'selectedIncome'
      // If they are nested, adjust accordingly (e.g., incomeData.rentIncome.name)
      let specificFields = {};

      switch (subCategory) {
        case "Rent Income":
          specificFields = {
            name: incomeData.rentIncome.name || "",
            startDate: incomeData.rentIncome.startDate?.slice(0, 10) || "",
            endDate: incomeData.rentIncome.endDate?.slice(0, 10) || "",
            nameOfRenter: incomeData.rentIncome.nameOfRenter || "",
          };
          break;
        case "Exam Center Fees":
          specificFields = {
            examName: incomeData.examCentreFees.examName || "",
            startDate: incomeData.examCentreFees.startDate?.slice(0, 10) || "",
            endDate: incomeData.examCentreFees.endDate?.slice(0, 10) || "",
            mobileNumber:
              incomeData.examCentreFees.mobileNumber?.slice(0, 10) || "",
          };
          break;
        case "Parking Fees":
          specificFields = {
            vehicleType: incomeData.parkingFees.vehicleType || "",
            name: incomeData.parkingFees.name || "",
            userType: incomeData.parkingFees.userType || "",
            otherVehicleDetails:
              incomeData.parkingFees.otherVehicleDetails || "",
            otherUserDetails: incomeData.parkingFees.otherUserDetails || "",
          };
          break;
        case "Stationery Fees":
          specificFields = {
            stationeryItems: incomeData.stationeryItems || "",
          };
          break;
        case "Other Facility Fees":
          specificFields = {
            facilityName: incomeData.facilityName || "",
            accessDuration: incomeData.accessDuration || "",
          };
          break;
        case "Subscription Fees":
          specificFields = {
            subscriptionName: incomeData.subscriptionName || "",
            description: incomeData.description || "",
          };
          break;
        case "Workshop/Training Fees":
          specificFields = {
            sessionTitle: incomeData.sessionTitle || "",
            hostName: incomeData.hostName || "",
            timePeriod: incomeData.timePeriod || "",
          };
          break;
        case "Canteen Profit":
          specificFields = {
            periodOfEarnings: incomeData.periodOfEarnings || "",
            description: incomeData.description || "",
          };
          break;
        case "Donations":
          specificFields = {
            name: incomeData.name || "",
            phoneNumber: incomeData.phoneNumber || "",
            address: incomeData.address || "",
          };
          break;
        case "Fundraising/Sponsorships":
          specificFields = {
            companyName: incomeData.companyName || "",
            phoneNumber: incomeData.phoneNumber || "",
            address: incomeData.address || "",
          };
          break;
        case "Investments":
          specificFields = {
            name: incomeData.name || "",
            profitOrLoss: incomeData.profitOrLoss || "",
            fromDate: incomeData.fromDate || "",
            toDate: incomeData.toDate || "",
            investmentAmount: incomeData.investmentAmount || 0,
            returnAmount: incomeData.returnAmount || 0,
          };
          break;
        // Add other subCategories as needed
        default:
          break;
      }

      // **3. Construct 'initialValues' without spreading 'initialValuesMap'**
      const initialValues = {
        _id: incomeData._id || "",
        categoryName: categoryName,
        sub_category: subCategory || selectedSubCategory, // Assign to 'sub_category'
        paymentType: incomeData.paymentType || "cash",
        paymentStatus: incomeData.paymentStatus || "paid",
        paid_amount: incomeData.paid_amount || 0,
        paidBy: incomeData.paidBy || "Auto",
        advance_amount: incomeData.advance_amount || 0,
        remaining_amount: incomeData.remaining_amount || 0,
        tax: incomeData.tax || 0,
        discountType: incomeData.discountType || "percentage",
        discount: incomeData.discount || 0,
        penalty: incomeData.penalty || 0,
        frequencyOfPayment: incomeData.frequencyOfPayment || "Monthly",
        dateTime: incomeData.dateTime || "",
        total_amount: incomeData.total_amount || 0,
        final_amount: incomeData.final_amount || 0,
        document: incomeData.document || null,
        description: incomeData.description || "",
        chequeNumber: incomeData.chequeNumber || "",
        onlineTransactionId: incomeData.onlineTransactionId || "",
        // **4. Spread subcategory-specific fields from 'specificFields'**
        ...specificFields,
      };

      console.log("Initial Form Values:", initialValues); // Debugging line

      return initialValues;
    }

    // **5. When not editing, initialize with default values and spread 'initialValuesMap'**
    const initialValues = {
      _id: "",
      categoryName: selectedCategory,
      sub_category: selectedSubCategory,
      paymentType: "cash",
      paymentStatus: "paid",
      paid_amount: 0,
      paidBy: "Auto",
      advance_amount: 0,
      remaining_amount: 0,
      tax: 0,
      discountType: "percentage",
      discount: 0,
      penalty: 0,
      frequencyOfPayment: "Monthly",
      dateTime: "",
      total_amount: 0,
      final_amount: 0,
      document: null,
      description: "",
      ...initialValuesMap[selectedSubCategory],
    };

    console.log("Default Initial Form Values:", initialValues); // Debugging line

    return initialValues;
  };

  // Reset the form to its initial state
  const handleReset = (resetForm) => {
    resetForm();
    setDescription("");
    if (selectedIncome) {
      dispatch(clearSelectedIncome()); // Clear selected income from Redux
      navigate("/finance/earning/total-revenue-list"); // Navigate back to revenue list
    } else {
      // Reset to default category and subCategory
      setSelectedCategory("Facility-Based Revenue");
      setSelectedSubCategory("Rent Income");
    }
  };

  // Handle form submission for adding or updating earnings
  const handleSaveOrUpdate = async (values, actions) => {
    try {
      // **1. Destructure 'sub_category' instead of 'subCategory'**
      const {
        _id,
        categoryName,
        sub_category,
        description,
        document,
        ...rest
      } = values;

      let specificFields = {};

      switch (
        sub_category // Use 'sub_category'
      ) {
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
            examName: values.examName,
            startDate: values.startDate,
            endDate: values.endDate,
            mobileNumber: values.mobileNumber,
          };
          break;
        case "Parking Fees":
          specificFields = {
            vehicleType: values.vehicleType,
            name: values.name,
            userType: values.userType,
            otherVehicleDetails: values.otherVehicleDetails,
            otherUserDetails: values.otherUserDetails,
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
            description: values.description,
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

      // **2. Map 'sub_category' back to 'subCategory' in the payload**
      const payloadCamelCase = {
        categoryName: categoryName, // Top-level field
        subCategory: sub_category, // Map 'sub_category' to 'subCategory'
        description: description, // Top-level field
        document: document, // Top-level field
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
      if (values.paymentType === "cheque") {
        payloadCamelCase.chequeNumber = values.chequeNumber || "";
      }
      if (values.paymentType === "online") {
        payloadCamelCase.onlineTransactionId = values.onlineTransactionId || "";
      }
      // **3. Convert all numeric fields to numbers to prevent NaN**
      const numericFields = [
        "paid_amount",
        "advance_amount",
        "remaining_amount",
        "tax",
        "discount",
        "penalty",
        "total_amount",
        "final_amount",
        "investment_amount",
        "return_amount",
        // Add other numeric fields as necessary
      ];

      numericFields.forEach((field) => {
        if (
          payloadCamelCase[field] === "" ||
          payloadCamelCase[field] === null
        ) {
          payloadCamelCase[field] = 0;
        } else {
          payloadCamelCase[field] = Number(payloadCamelCase[field]);
        }
      });

      const category = selectedCategory;

      if (selectedIncome && !readOnly) {
        // Update existing record
        const id = selectedIncome?._id;
        await dispatch(
          updateEarnings({ values: payloadCamelCase, category, id })
        ).unwrap();
        toast.success("Earnings updated successfully!");
        dispatch(clearSelectedIncome()); // Clear the selected income after update
        navigate("/finance/earning/total-revenue-list");
      } else if (!selectedIncome) {
        // Add new record
        await dispatch(
          addEarnings({ values: payloadCamelCase, category })
        ).unwrap();
        toast.success("Earnings added successfully!");
        navigate("/finance/earning/total-revenue-list");
      }
    } catch (err) {
      // toast.error(err || "An unexpected error occurred while saving the data.");
      // console.error("Error while saving data:", err);
      // setShowErrorLocal(true); // Show the error message
    } finally {
      actions.setSubmitting(false);
    }
  };

  // **4. Update the useEffect Hook to correctly set 'selectedSubCategory'**
  useEffect(() => {
    if (selectedIncome) {
      const incomeData = selectedIncome;
      console.log("Income Data Loaded:", incomeData); // Debugging line
      const categoryName =
        incomeData.category?.categoryName || "Facility-Based Revenue";
      setSelectedCategory(categoryName);
      setSelectedSubCategory(incomeData.subCategory || "Rent Income"); // Use 'subCategory'
      setDescription(incomeData.description || "");
    } else {
      dispatch(setReadOnly(false));
    }

    // Optional: Clear selectedIncome when component unmounts
    return () => {
      dispatch(clearSelectedIncome());
    };
  }, [selectedIncome, dispatch]);

  // Get the appropriate validation schema based on the selected sub-category
  const getValidationSchema = () => {
    return validationSchemas[selectedSubCategory] || Yup.object({});
  };

  // Auto-hide the error message after 3 seconds
  useEffect(() => {
    let timer;
    if (error) {
      setShowErrorLocal(true);
      timer = setTimeout(() => {
        setShowErrorLocal(false);
        // Optionally, reset the error in Redux store if implemented
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer);
  }, [error]);
  useNavHeading("Earnings", "Manage");
  return (
    <Layout
      title={
        selectedIncome
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
          {({ resetForm, isSubmitting, values, setFieldValue }) => (
            <Form className="p-3">
              {/* Read-Only Mode Notification */}
              {/* {readOnly && (
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
                    onClick={() => dispatch(setReadOnly(false))}
                  >
                    Edit
                  </Button>
                </div>
              )} */}

              {/* Error Message */}
              {/* {error && showError && (
                <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                  {Array.isArray(error)
                    ? error.map((err, idx) => (
                        <div key={idx}>{err.msg || err}</div>
                      ))
                    : error}
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
                      _id: "", // Reset _id for new entries
                      categoryName: category,
                      sub_category: firstSubCategory, // Use 'sub_category'
                      paymentType: "cash",
                      paymentStatus: "paid",
                      paid_amount: 0,
                      paidBy: "Auto",
                      advance_amount: 0,
                      remaining_amount: 0,
                      tax: 0,
                      discountType: "percentage",
                      discount: 0,
                      penalty: 0,
                      frequencyOfPayment: "Monthly",
                      dateTime: "",
                      total_amount: 0,
                      final_amount: 0,
                      document: null,
                      description: "",
                      // **6. Spread 'initialValuesMap' only for the new subcategory**
                      ...initialValuesMap[firstSubCategory],
                    },
                  });
                  setDescription("");
                }}
                onSubCategoryChange={(subCategory) => {
                  if (readOnly) return;
                  setSelectedSubCategory(subCategory);
                  resetForm({
                    values: {
                      _id: "", // Reset _id for new entries
                      categoryName: selectedCategory,
                      sub_category: subCategory, // Use 'sub_category'
                      paymentType: "cash",
                      paymentStatus: "paid",
                      paid_amount: 0,
                      paidBy: "Auto",
                      advance_amount: 0,
                      remaining_amount: 0,
                      tax: 0,
                      discountType: "percentage",
                      discount: 0,
                      penalty: 0,
                      frequencyOfPayment: "Monthly",
                      dateTime: "",
                      total_amount: 0,
                      final_amount: 0,
                      document: null,
                      description: "",
                      // **7. Spread 'initialValuesMap' only for the new subcategory**
                      ...initialValuesMap[subCategory],
                    },
                  });
                  setDescription("");
                }}
                onReset={() => handleReset(resetForm)}
                description={description}
                setDescription={readOnly ? () => {} : setDescription}
                initialCategory={selectedCategory}
                initialSubCategory={selectedSubCategory}
                isUpdate={!!selectedIncome}
              />

              {/* Render the selected form component */}
              {formComponent || (
                <div className="text-center text-gray-500 text-xs py-4">
                  Select a sub-category to proceed.
                </div>
              )}

              {/* Submit Button is handled within Header.jsx */}
            </Form>
          )}
        </Formik>
      </DashLayout>
    </Layout>
  );
};

export default AddEarnings;
