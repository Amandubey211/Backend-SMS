import { useEffect } from "react";
import { useFormikContext } from "formik";
import TextInput from "./Components/TextInput";

export const TotalInputs = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Calculate totalAmount from lineItems
    const total = values?.lineItems?.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0);
    }, 0);
    setFieldValue("totalAmount", total);
  
    // Calculate discounted amount based on discountType
    let discountedAmount = total;
    if (values.discountType === "percentage" && values.discount) {
      discountedAmount -= (total * Number(values.discount)) / 100;
    } else if (values.discountType === "amount" && values.discount) {
      discountedAmount -= Number(values.discount);
    }
  
    // Calculate tax amount based on discountedAmount
    const taxAmount = (discountedAmount * (Number(values.tax) || 0)) / 100;
  
    // Add penalty and tax to discounted amount for final amount
    const finalAmount =
      discountedAmount + taxAmount + (Number(values.penalty) || 0);
  
    setFieldValue("finalAmount", finalAmount.toFixed(2)); // Ensure 2 decimal precision
  }, [
    values.lineItems,
    values.discount,
    values.discountType,
    values.tax,
    values.penalty,
    setFieldValue,
  ]);
  
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-6">
        <TextInput
          label="Total Amount"
          name="totalAmount"
          placeholder="Total amount"
          type="number"
          disabled={true}
        />
        <TextInput
          label="Final Amount (After tax/discount/penalty)"
          name="finalAmount"
          placeholder="Final amount"
          type="number"
          disabled={true}
        />
      </div>
    </div>
  );
};
