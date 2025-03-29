import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../../../../Store/Slices/Finance/Category/financeCategory.Thunk";

const FinanceCategorySelect = ({ categoryType, onSelect, disabled = false, categoryName = "",onClose }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(categoryName);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = useSelector((state) => state.admin.financialCategory.categories);

  useEffect(() => {
    dispatch(fetchCategory({ categoryType, search: "", page: 1, limit: 10000 }));
  }, [, dispatch]);

  useEffect(() => {
    if (searchText && searchText !== categoryName) {
      const filtered = categories.filter((cat) =>
        cat.categoryName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
      setSearchText(categoryName)
    }
    return () =>{
      setShowDropdown(false);
    }
  }, [searchText, categories, categoryName,onClose]);

  return (
    <div className="relative w-full">
      {/* Input Box */}
      <input
        type="text"
        placeholder="Search or Select Category"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => searchText !== categoryName && setShowDropdown(true)}
        onKeyDown={(e) => e.key === "Enter" && setShowDropdown(false)}
        readOnly={disabled}
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Dropdown List */}
      {showDropdown && !disabled && filteredCategories.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
          {filteredCategories.map((category) => (
            <li
              key={category._id}
              onClick={() => {
                setShowDropdown(false);
                setSearchText(category.categoryName);
                onSelect(category);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-200"
            >
              {category.categoryName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FinanceCategorySelect;
