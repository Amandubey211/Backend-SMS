// src/Components/Admin/Finance/Expenses/AddExpenses.jsx

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import Layout from "../../../../../Components/Common/Layout";
import DashLayout from "../../../../../Components/Admin/AdminDashLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Header from "./Components/Header";
import { categories, subCategories } from "../Config/categories";
import {
  setReadOnly,
  clearSelectedExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesSlice";
import {
  addExpense,
  updateExpense,
} from "../../../../../Store/Slices/Finance/Expenses/expensesThunks";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { formComponentsMap, initialValuesMap } from "../Config/formConfig";
import { validationSchemas } from "../Config/validationSchemas";
import toast from "react-hot-toast";
import useNavHeading from "../../../../../Hooks/CommonHooks/useNavHeading ";

const AddExpenses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useNavHeading("Expenses", "Manage");
  // Redux state
  const { readOnly, error, selectedExpense } = useSelector(
    (state) => state.admin.expenses
  );

  const [selectedCategory, setSelectedCategory] =
    useState("Salaries and Wages");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState("Teaching Staffs");
  const [description, setDescription] = useState("");
  const [showError, setShowErrorLocal] = useState(false);

  // Memoized form component
  const formComponent = useMemo(() => {
    const SubCategoryComponent =
      formComponentsMap[selectedCategory]?.[selectedSubCategory];
    return SubCategoryComponent ? (
      <SubCategoryComponent readOnly={readOnly} />
    ) : (
      <div className="text-center text-gray-500 text-sm py-4">
        Form for this sub-category is under development.
      </div>
    );
  }, [selectedCategory, selectedSubCategory, readOnly]);

  // Initial form values
  const getInitialValues = () => {
    if (selectedExpense) {
      const expenseData = selectedExpense;

      // Extract 'subCategory' correctly
      const subCategory = expenseData.subCategory || expenseData.sub_category;

      const categoryName =
        expenseData.category?.[0]?.categoryName || "Salaries and Wages";

      // Construct initial values with subcategory-specific fields
      const initialValues = {
        _id: expenseData._id || "",
        categoryName: categoryName,
        sub_category: subCategory || selectedSubCategory,
        paymentMethod: expenseData.paymentMethod || "cash",
        receipt: expenseData.receipt || null,
        description: expenseData.description || "",
        ...initialValuesMap[subCategory],
        // Spread expenseData after initialValuesMap to override if necessary
        ...expenseData,
      };

      return initialValues;
    }

    // When not editing, initialize with default values and spread 'initialValuesMap'
    return {
      _id: "",
      categoryName: selectedCategory,
      sub_category: selectedSubCategory,
      paymentMethod: "cash",
      receipt: null,
      description: "",
      ...initialValuesMap[selectedSubCategory],
    };
  };

  // Reset the form
  const handleReset = (resetForm) => {
    resetForm();
    setDescription("");
    if (selectedExpense) {
      dispatch(clearSelectedExpense());
      navigate("/finance/total-expense-list");
    } else {
      setSelectedCategory("Salaries and Wages");
      setSelectedSubCategory("Teaching Staffs");
    }
  };

  // Handle form submission
  const handleSaveOrUpdate = async (values, actions) => {
    try {
      const { _id, categoryName, sub_category, description, receipt, ...rest } =
        values;

      // Construct payload
      const payload = {
        categoryName,
        subCategory: sub_category,
        description,
        receipt,
        paymentMethod: values.paymentMethod,
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
        "final_amount",
        "return_amount",
        // Add other numeric fields as necessary
      ];

      numericFields.forEach((field) => {
        if (payload[field] === "" || payload[field] === null) {
          payload[field] = 0;
        } else {
          payload[field] = Number(payload[field]);
        }
      });
      let category = selectedCategory;
      if (selectedExpense) {
        // Update existing record
        const id = selectedExpense._id;
        await dispatch(
          updateExpense({ values: payload, category, id })
        ).unwrap();
        toast.success("Expense updated successfully!");
        dispatch(clearSelectedExpense());
        navigate("/finance/expenses/total-expense-list");
      } else {
        // Add new record
        await dispatch(addExpense({ values: payload, category })).unwrap();
        toast.success("Expense added successfully!");
        navigate("/finance/expenses/total-expense-list");
      }
    } catch (err) {
      toast.error(
        err.message || "An unexpected error occurred while saving the data."
      );
      console.error("Error while saving data:", err);
      setShowErrorLocal(true);
    } finally {
      actions.setSubmitting(false);
    }
  };

  // Populate selectedExpense when editing
  useEffect(() => {
    if (selectedExpense) {
      const categoryName =
        selectedExpense.category?.[0]?.categoryName || "Salaries and Wages";
      const subCategory = selectedExpense.subCategory || "Teaching Staffs";
      setSelectedCategory(categoryName);
      setSelectedSubCategory(subCategory);
      setDescription(selectedExpense.description || "");
    } else {
      dispatch(setReadOnly(false));
    }
    return () => dispatch(clearSelectedExpense());
  }, [selectedExpense, dispatch]);

  // Validation schema
  const getValidationSchema = () => {
    return validationSchemas[selectedSubCategory] || Yup.object({});
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
          enableReinitialize
          initialValues={getInitialValues()}
          // validationSchema={getValidationSchema()}
          onSubmit={handleSaveOrUpdate}
        >
          {({ resetForm }) => (
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
                    onClick={() => dispatch(setReadOnly(false))}
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {error && showError && (
                <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
                  {Array.isArray(error)
                    ? error.map((err, idx) => (
                        <div key={idx}>{err.msg || err}</div>
                      ))
                    : error}
                </div>
              )}

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
                      paymentMethod: "cash",
                      receipt: null,
                      description: "",
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
                      paymentMethod: "cash",
                      receipt: null,
                      description: "",
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
                isUpdate={!!selectedExpense}
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

export default AddExpenses;
