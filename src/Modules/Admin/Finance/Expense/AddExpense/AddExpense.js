// src/Modules/Admin/Finance/Expense/AddExpense/AddExpenses.jsx

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Formik, Form } from "formik";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import { subCategories, categories } from "../Config/categories";
import {
  setReadOnly,
  clearSelectedExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesSlice";
import {
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import { formComponentsMap, initialValuesMap } from "../Config/formConfig";
import { validationSchemas } from "../Config/validationSchemas";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { frontendToBackendSubCategoryMap } from "../Config/subCategoryMapping";
import { mapBackendToFrontend } from "../Config/fieldMapping";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";
import { useNavigate } from "react-router-dom";

const AddExpenses = () => {
  const dispatch = useDispatch();
  useNavHeading("Expenses", "Manage");

  // Redux state
  const { readOnly, error, selectedExpense } = useSelector(
    (state) => state.admin.expenses
  );
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState("Salaries and Wages");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Teaching Staffs");
  // Removed the separate description state
  const [showError, setShowErrorLocal] = useState(false);

  // Ref to store Formik's resetForm function
  const formikRef = useRef();

  // Memoized form component
  const formComponent = useMemo(() => {
    const formMap = formComponentsMap[selectedCategory];
    if (!formMap) {
      return (
        <div className="text-center text-gray-500 text-sm py-4">
          Form for this category is under development.
        </div>
      );
    }

    // Check if formMap is an object (multiple subcategories) or a single component (single subcategory)
    if (typeof formMap === "object") {
      const SubCategoryComponent = formMap[selectedSubCategory];
      if (SubCategoryComponent) {
        return <SubCategoryComponent readOnly={readOnly} />;
      } else {
        return (
          <div className="text-center text-gray-500 text-sm py-4">
            Form for this sub-category is under development.
          </div>
        );
      }
    } else if (typeof formMap === "function") {
      // In your current setup, all categories have at least one subcategory,
      // so this block might not be necessary. Keeping it for future scalability.
      return <formMap readOnly={readOnly} />;
    } else {
      return (
        <div className="text-center text-gray-500 text-sm py-4">
          Form for this category is under development.
        </div>
      );
    }
  }, [selectedCategory, selectedSubCategory, readOnly]);

  // Initial form values
  // const getInitialValues = () => {
  //   if (selectedExpense) {
  //     const mappedData = mapBackendToFrontend(selectedExpense);
  //     const actualSubCategory = mappedData.sub_category;
  //     const expenseData = selectedExpense;

  //     // Merge mapped data with initialValuesMap
  //     const initialValues = {
  //       ...initialValuesMap[actualSubCategory],
  //       ...mappedData,
  //       ...expenseData,
  //     };

  //     return initialValues;
  //   }

  //   // When not editing, initialize with default values and spread 'initialValuesMap'
  //   const hasMultipleSubCategories =
  //     subCategories[selectedCategory]?.length > 1;
  //   const initialSubCat = hasMultipleSubCategories
  //     ? selectedSubCategory
  //     : subCategories[selectedCategory]?.[0] || selectedCategory;

  //   return {
  //     _id: "",
  //     categoryName: selectedCategory,
  //     sub_category: initialSubCat || "",
  //     payment_type: "cash",
  //     description: "", // Ensure description is initialized
  //     ...initialValuesMap[initialSubCat],
  //   };
  // };

  const getInitialValues = () => {
    if (selectedExpense) {
      const mappedData = mapBackendToFrontend(selectedExpense);
      const actualSubCategory = mappedData.sub_category;
      const expenseData = selectedExpense;

      // Merge mapped data with initialValuesMap
      const initialValues = {
        ...initialValuesMap[actualSubCategory],
        ...mappedData,
        ...expenseData,
        // Ensure startDate and endDate are included for relevant forms
        startDate: mappedData.startDate || "",
        endDate: mappedData.endDate || "",
        // purchasedDate: mappedData.purchasedDate || "",
      };

      return initialValues;
    }

    // When not editing, initialize with default values and spread 'initialValuesMap'
    const hasMultipleSubCategories =
      subCategories[selectedCategory]?.length > 1;
    const initialSubCat = hasMultipleSubCategories
      ? selectedSubCategory
      : subCategories[selectedCategory]?.[0] || selectedCategory;

    return {
      _id: "",
      categoryName: selectedCategory,
      sub_category: initialSubCat || "",
      payment_type: "cash",
      description: "", // Ensure description is initialized
      startDate: "", // Default startDate
      endDate: "", // Default endDate
      ...initialValuesMap[initialSubCat],
    };
  };

  // Handler for category change
  const handleCategoryChange = (category) => {
    if (readOnly) return;
    setSelectedCategory(category);
    const hasMultipleSubCategories = subCategories[category]?.length > 1;
    const firstSubCategory = hasMultipleSubCategories
      ? subCategories[category][0]
      : subCategories[category][0]; // Only one subcategory
    setSelectedSubCategory(firstSubCategory);
    handleSubCategoryChange(firstSubCategory); // Call the subcategory handler

    if (formikRef.current) {
      formikRef.current.resetForm({
        values: {
          _id: "", // Reset _id for new entries
          categoryName: category,
          sub_category: firstSubCategory,
          payment_type: "cash",
          receipt: "",
          description: "", // Reset description via Formik
          ...initialValuesMap[firstSubCategory],
        },
      });
    }
    // Removed setDescription("");
  };

  // Handler for subcategory change
  const handleSubCategoryChange = (subCategory) => {
    if (readOnly) return;
    setSelectedSubCategory(subCategory);
    if (formikRef.current) {
      formikRef.current.resetForm({
        values: {
          _id: "", // Reset _id for new entries
          categoryName: selectedCategory,
          sub_category: subCategory,
          payment_type: "cash",
          receipt: "",
          description: "", // Reset description via Formik
          ...initialValuesMap[subCategory],
        },
      });
    }
    // Removed setDescription("");
  };

  // Reset the form
  const handleReset = (resetForm) => {
    resetForm();
    // Removed setDescription("");
    if (selectedExpense) {
      dispatch(clearSelectedExpense());
      // Optionally navigate to the expenses list
      navigate("/finance/expenses/total-expense-list");
    } else {
      setSelectedCategory("Salaries and Wages");
      setSelectedSubCategory("Teaching Staffs");
    }
  };

  // Handle form submission
  const handleSaveOrUpdate = async (values, actions) => {
    try {
      console.log(values, "values");
      const { _id, categoryName, sub_category, description, receipt, ...rest } =
        values;

      // Convert frontend sub_category to backend value
      const backendSubCategory =
        frontendToBackendSubCategoryMap[sub_category] || sub_category;

      // Construct payload
      const payload = {
        categoryName,
        // Use the appropriate backend field based on category
        ...(categoryName === "Salaries and Wages"
          ? { staffType: backendSubCategory }
          : categoryName === "Utilities and Maintenance"
          ? { expenseSubCategory: backendSubCategory }
          : { sub_category: sub_category }),
        description, // Ensure description is included
        receipt,
        payment_type: values.payment_type,
        ...rest,
      };

      // Convert numeric fields to numbers
      const numericFields = [
        "paid_amount",
        "remaining_amount",
        "tax",
        "discount",
        "penalty",
        "total_amount",
        "finalAmount",
        "return_amount",
        "advanceAmount",
        // Add other numeric fields as necessary
      ];

      numericFields.forEach((field) => {
        if (payload[field] === "" || payload[field] === null) {
          payload[field] = 0;
        } else {
          payload[field] = Number(payload[field]);
        }
      });

      let category = categoryName;
      if (selectedExpense) {
        // Update existing record
        const id = selectedExpense._id;
        console.log(payload, "payload");
        await dispatch(
          updateExpense({ values: payload, category, expenseId: id })
        ).unwrap();
        toast.success("Expense updated successfully!");
        dispatch(clearSelectedExpense());
        // Optionally navigate to the expenses list
        navigate("/finance/expenses/total-expense-list");
      } else {
        // Add new record
        await dispatch(addExpense({ values: payload, category })).unwrap();
        toast.success("Expense added successfully!");
        // Optionally navigate to the expenses list
        navigate("/finance/expenses/total-expense-list");
      }
    } catch (err) {
      // setShowErrorLocal(true);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Populate selectedExpense when editing or viewing
  useEffect(() => {
    if (selectedExpense) {
      const categoryName =
        selectedExpense.category?.categoryName || "Salaries and Wages";
      let subCategory =
        selectedExpense.subcategory || selectedExpense.sub_category;

      // Handle special mappings for 'staffType' and 'expenseSubCategory'
      if (selectedExpense.staffType) {
        subCategory =
          selectedExpense.staffType === "nonteaching"
            ? "Non-Teaching Staffs"
            : "Teaching Staffs";
      } else if (selectedExpense.expenseSubCategory) {
        subCategory =
          selectedExpense.expenseSubCategory === "maintenance"
            ? "Maintenance"
            : "Utilities";
      }

      setSelectedCategory(categoryName);

      const hasMultipleSubCategories = subCategories[categoryName]?.length > 1;

      const actualSubCategory = hasMultipleSubCategories
        ? subCategory
        : subCategories[categoryName]?.[0] || subCategory;

      console.log(actualSubCategory, "actualSubCategory");
      setSelectedSubCategory(actualSubCategory);
      // Removed setDescription; Formik manages description
    } else {
      dispatch(setReadOnly(false));
    }
    return () => dispatch(clearSelectedExpense());
  }, [selectedExpense, dispatch]);

  // Validation schema
  const getValidationSchema = () => {
    if (readOnly) return null; // No validation in read-only mode
    const schema = validationSchemas[selectedSubCategory];
    return schema || Yup.object({});
  };

  // Auto-hide error message
  useEffect(() => {
    let timer;
    if (error) {
      setShowErrorLocal(true);
      timer = setTimeout(() => setShowErrorLocal(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <Layout
      title={
        selectedExpense
          ? readOnly
            ? "View Expense | Student Diwan"
            : "Update Expense | Student Diwan"
          : "Add Expense | Student Diwan"
      }
    >
      <DashLayout>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={getInitialValues()}
          // validationSchema={getValidationSchema()} // Uncommented validationSchema
          onSubmit={handleSaveOrUpdate}
        >
          {({ isSubmitting, setFieldValue, values }) => (
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

              {/* Header Component */}
              <Header
                onCategoryChange={handleCategoryChange}
                onSubCategoryChange={handleSubCategoryChange}
                onReset={() => handleReset(formikRef.current.resetForm)}
                description={values.description} // Use Formik's description
                setDescription={(desc) => setFieldValue("description", desc)} // Use Formik's setFieldValue
                initialCategory={selectedCategory}
                initialSubCategory={selectedSubCategory}
                isUpdate={!!selectedExpense}
              />

              {/* Form Section */}
              {formComponent || (
                <div className="text-center text-gray-500 text-xs py-4">
                  Select a sub-category to proceed.
                </div>
              )}
            </Form>
          )}
        </Formik>
      </DashLayout>
    </Layout>
  );
};

export default AddExpenses;
