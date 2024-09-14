import React from "react";
import { GoDotFill } from "react-icons/go";
import FormField from "../Component/FormField";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../Store/Slices/Student/Finance/financeSlice";
import { gt } from "../../../Utils/translator/translation";
import { useTranslation } from "react-i18next";


const uniqueFilterOptions = (data, key) => {
  return [...new Set(data?.map((item) => item[key]))]?.sort();
};

const FilterContainer = () => {

  const { filters, stdFinanceData } = useSelector((store) => store.studentFinance);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const feesTypes = uniqueFilterOptions(stdFinanceData, "feeType")?.map((type) => ({
    label: type,
    value: type,
  }));

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ ...filters, [name]: value }));
  };


  return (
    <div className="filter-container flex gap-16  p-6 items-center bg-white shadow-sm rounded-lg">
      {/* Fees Type */}
      <div className="flex flex-col w-1/3">
        <FormField
          id="feesType"
          name="feesType"
          label="Fees Type"
          value={filters.feesType}
          onChange={handleFilterChange}
          options={feesTypes}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col w-2/3">
        <label className="text-gray-500 text-sm font-medium mb-2">{t(`Status`, gt.stdFinance)}</label>
        <div className="flex gap-5">
          {["Everyone", "Paid", "Unpaid"].map((status) => (
            <label key={status} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={handleFilterChange}
                className="hidden"
                aria-checked={filters.status === status}
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 transition-colors duration-300 ${filters.status === status
                  ? "border-green-500"
                  : "border-gray-300"
                  }`}
              >
                {/* Icon for selected radio button */}
                {filters.status === status && (
                  <GoDotFill className="text-green-500" size={18} />
                )}
              </div>
              <span
                className={`transition-colors duration-300 text-md ${filters.status === status ? "text-gradient" : "text-gray-600"
                  } hover:text-pink-500 focus:outline-none`}
              >
                {status === "Everyone" ? t("All", gt.stdFinance) : t(status, gt.stdFinance)}

              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterContainer;
