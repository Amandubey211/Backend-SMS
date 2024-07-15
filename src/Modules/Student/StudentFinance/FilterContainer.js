import React from "react";
import FormField from "../subClass/component/FormField";

const uniqueFilterOptions = (data, key) => {
  return [...new Set(data.map((item) => item[key]))].sort();
};

const FilterContainer = ({ filters, feesDetails, handleFilterChange }) => {
  console.log("filters",filters)
  console.log("feesDetails",feesDetails)
  console.log("handleFilterChange",handleFilterChange)
  const feesTypes = uniqueFilterOptions(feesDetails, "feeType").map((type) => ({
    label: type,
    value: type,
  }));
console.log("feetype",feesTypes)
  return (
    <div className="filter-container flex justify-between p-6 items-center ">
      <FormField
        id="feesType"
        name="feesType"
        label="Fees Type"
        value={filters.feesType}
        onChange={handleFilterChange}
        options={feesTypes}
      />
      <div className="flex justify-between gap-3">
        {/*  📌 check ->change later as per paid and unpaid later  */}
        {["Everyone", "Paid", "Unpaid"].map((status) => (
          <div key={status} className="">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={handleFilterChange}
                className="hidden"
              />
              <div
                className={`h-5 w-5 rounded-full mr-2 flex items-center justify-center border-2 ${
                  filters.status === status
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {filters.status === status && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
              <span
                className={`transition-colors duration-200 ${
                  filters.status === status
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                {status}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterContainer;
