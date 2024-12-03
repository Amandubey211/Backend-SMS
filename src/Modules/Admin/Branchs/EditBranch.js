import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Import translation hook
import { updateBranchInfo } from "../../../Store/Slices/Admin/branchs/branch.action";

const EditBranch = ({ show, onClose, data }) => {
  const { t } = useTranslation("admAcademicYear"); 
  const [branchData, setBranchData] = useState({
    branchName: data?.branchName || '',
    address: data?.address || '',
    city: data?.city || '',
    id: data?._id || ''
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const { branchs, loading, error } = useSelector(
    (store) => store.common.branchs
  );

  // Universal handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   await dispatch(updateBranchInfo(branchData));
    onClose()
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Blurred background */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        className="bg-white rounded-lg shadow-xl z-10 w-full max-w-lg mx-4 transition-transform transform duration-300 scale-95"
      >
        <div className="bg-gray-100 px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Edit Branch")}
          </h2>
        </div>
        <div className="bg-white p-5">
          <form onSubmit={handleSubmit}>
            {/* Branch Name */}
            <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700">
                {t("Branch Name")}
              </label>
              <input
                type="text"
                value={branchData.branchName}
                onChange={handleChange}
                name="branchName"
                className={`w-full px-3 py-2 border border-gray-300
                   rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                required
              />
            </div>

            {/* City */}
            <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700">
                {t("City")}
              </label>
              <input
                type="text"
                value={branchData.city}
                onChange={handleChange}
                name="city"
                className={`w-full px-3 py-2 border border-gray-300
                    rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
                required
              />
            </div>

            {/* Address */}
             <div className="mb-3">
             <label className="block text-sm font-semibold text-gray-700">
                {t("Address")}
              </label>
              <input
                type="text"
                value={branchData.address}
                onChange={handleChange}
                name="address"
                className={`w-full px-3 py-2 border border-gray-300
                    rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
              />
            </div> 

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-all flex justify-center items-center ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> {t("Updating...")}
                  </>
                ) : (
                  t("Update Branch")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBranch;
