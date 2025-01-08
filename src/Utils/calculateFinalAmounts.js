// src/utils/calculateFinalAmounts.js

/**
 * Calculates the sub amount (discount) and final amount based on provided financial data.
 *
 * @param {Object} data - The financial data required for calculations.
 * @param {number} data.total_amount - The total amount before any discounts, taxes, or penalties.
 * @param {string} data.discountType - The type of discount ('percentage' or 'amount').
 * @param {number} data.discount - The discount value.
 * @param {number} data.tax - The tax percentage.
 * @param {number} data.penalty - The penalty amount.
 * @param {number} [data.paid_amount=0] - The amount already paid.
 * @param {number} [data.advance_amount=0] - The advance amount (if any).
 *
 * @returns {Object} An object containing the calculated discount value, final amount, remaining amount, advance amount, and total paid.
 */
export const calculateFinalAmounts = ({
    total_amount,
    discountType,
    discount,
    tax,
    penalty,
    paid_amount = 0,
    advance_amount = 0,
  }) => {
    // Ensure all numerical inputs are numbers
    const totalAmount = Number(total_amount) || 0;
    const discountVal = Number(discount) || 0;
    const taxVal = Number(tax) || 0;
    const penaltyVal = Number(penalty) || 0;
    const paidAmount = Number(paid_amount) || 0;
    const advanceAmountVal = Number(advance_amount) || 0;
  
    // Calculate discount based on discount type
    let discountValue = 0;
    if (discountType === 'percentage') {
      discountValue = (totalAmount * discountVal) / 100;
    } else if (discountType === 'amount') {
      discountValue = discountVal;
    }
  
    // Ensure discount does not exceed total amount
    discountValue = Math.min(discountValue, totalAmount);
  
    // Round discount value to 2 decimal places
    discountValue = parseFloat(discountValue.toFixed(2));
  
    // Calculate total with tax
    const totalWithTax = parseFloat((totalAmount + (totalAmount * taxVal) / 100).toFixed(2));
  
    // Calculate the final amount
    const finalAmount = parseFloat((totalWithTax - discountValue + penaltyVal).toFixed(2));
  
    // Combine paid_amount and advance_amount
    let totalPaid = paidAmount + advanceAmountVal;
  
    let remainingAmount = 0;
    let finalAdvanceAmount = advanceAmountVal;
  
    if (totalPaid >= finalAmount) {
      // If total paid exceeds or equals finalAmount
      finalAdvanceAmount = parseFloat((totalPaid - finalAmount).toFixed(2));
      totalPaid = finalAmount; // Cap paid_amount to finalAmount
      remainingAmount = 0;
    } else {
      // Calculate remaining amount
      remainingAmount = parseFloat((finalAmount - totalPaid).toFixed(2));
      finalAdvanceAmount = 0; // No surplus in advance
    }
  
    return {
      discountValue,
      finalAmount,
      remainingAmount,
      advanceAmount: finalAdvanceAmount,
      totalPaid,
    };
  };
  