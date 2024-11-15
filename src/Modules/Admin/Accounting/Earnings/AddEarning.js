import React from 'react';
import FormInput from '../subClass/component/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { createEarning, fetchEarning, fetchTotalAmounts } from '../../../../Store/Slices/Admin/Accounting/Earning/earning.action';
import { resetFormData, setFormData, setSidebarOpen } from '../../../../Store/Slices/Admin/Accounting/Earning/earningSlice';
import { useTranslation } from 'react-i18next';

const AddEarning = () => {
  const { formData } = useSelector((store) => store?.admin?.earning);
  const dispatch = useDispatch();
  const { t } = useTranslation('admExpense');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      from: formData.paymentFrom,
      amount: formData.amount,
      dateOfEarning: formData.paymentDate,
      description: formData.description,
    };

    dispatch(createEarning({ payload }))
      .then(() => {
        dispatch(fetchEarning());
        dispatch(fetchTotalAmounts());
        dispatch(setSidebarOpen(false));
        dispatch(resetFormData());
      })
      .catch((err) => {
        console.error("Error updating earning", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  return (
    <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
      <FormInput
        id="paymentFrom"
        label={t('From')}
        type="text"
        value={formData.paymentFrom}
        onChange={handleChange}
        required
      />
      <FormInput
        id="amount"
        label={t('Amount')}
        type="text"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <FormInput
        id="paymentDate"
        label={t('Earning Date')}
        type="date"
        value={formData.paymentDate}
        onChange={handleChange}
        required
      />
      <FormInput
        id="description"
        label={t('Description')}
        type="text"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full flex justify-center border border-transparent shadow-sm text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
      >
        {t('Add New Earning')}
      </button>
    </form>
  );
};

export default AddEarning;
