import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SingleFee from '../../MainSection/SingleFee';
import MassFee from '../../MainSection/MassFee';

const AddFeesForm = () => {
  const { t } = useTranslation("admExpense"); // Use translation hook
  const [feeType, setFeeType] = useState('single');

  const handleFeeTypeChange = (status) => {
    setFeeType(status);
  };

  return (
    <div className="p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('Add New Fees')}</h2>
      <label htmlFor="feeType" className="mr-2 text-sm">
        {t('Fees Type')}:
      </label>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {['single', 'mass'].map((status) => (
            <label key={status} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="feeType"
                value={feeType}
                checked={feeType === status}
                onChange={() => handleFeeTypeChange(status)}
                className="hidden"
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                  feeType === status ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}
              >
                {feeType === status && <div className="h-3 w-3 bg-white rounded-full"></div>}
              </div>
              <span
                className={`transition-colors duration-200 ${
                  feeType === status ? 'text-red-700' : 'text-gray-700'
                }`}
              >
                {t(status === 'single' ? 'Single Fee' : 'Mass Fee')}
              </span>
            </label>
          ))}
        </div>
      </div>
      {feeType === 'single' && <SingleFee />}
      {feeType === 'mass' && <MassFee />}
    </div>
  );
};

export default AddFeesForm;
