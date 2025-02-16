import { useEffect } from "react";
import { useFormikContext } from "formik";
import TextInput from "./Components/TextInput";

export const TotalInputs = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    // Calculate subtotal (total amount from lineItems)
    const subtotal = values?.lineItems?.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.amount) || 0);
    }, 0);
    
    setFieldValue("totalAmount", subtotal);

    // Calculate discount amount based on discountType
    let discountAmount = 0;
    if (values.discountType === "percentage" && values.discount) {
      discountAmount = (subtotal * Number(values.discount)) / 100;
    } else if (values.discountType === "amount" && values.discount) {
      discountAmount = Number(values.discount);
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    // Subtotal after discount
    const discountedSubtotal = subtotal - discountAmount;

    // Calculate tax on the discounted subtotal
    const taxAmount = (discountedSubtotal * (Number(values.tax) || 0)) / 100;

    // Add penalty to calculate the final amount
    const finalAmount =
      discountedSubtotal + taxAmount + (Number(values.penalty) || 0);

    // Update the fields in Formik
    setFieldValue("finalAmount", finalAmount?.toFixed(2));
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
