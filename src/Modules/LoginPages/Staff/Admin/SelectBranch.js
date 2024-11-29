import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranch,
  updateBranch,
} from "../../../../Store/Slices/Admin/branchs/branch.action";
import Layout from "../../../../Components/Common/Layout";
import Logo from "../../../../Components/Common/Logo";
import { CiSearch } from "react-icons/ci";
import { LuLoader } from "react-icons/lu";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setLocalCookies } from "../../../../Utils/academivYear";

const SelectBranch = () => {
  const dispatch = useDispatch();
  const { branchs, loading } = useSelector((store) => store.common.branchs);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBranch());
  }, [dispatch]);

  // Hash function to generate a unique number from the branchId
  const hashCode = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };
  const HandleBranch = () => {
    console.log(selectedBranch);
    const data = { schoolId: selectedBranch._id };
    dispatch(updateBranch({ navigate, data })).then(() => {
      setLocalCookies("SelectedschoolId", selectedBranch._id);
    });
  };
  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  // Fallback image URL (until images are added)
  const getBranchImage = (branch) => {
    return (
      branch.image ||
      "https://i.ibb.co/WGN5285/Screenshot-2024-11-29-121940.png"
    );
  };

  // Filter branches based on the search query
  const filteredBranches = branchs.filter((branch) => {
    const branchName = branch.nameOfSchool.toLowerCase();
    const branchCity = branch.city.toLowerCase();
    const query = searchQuery.toLowerCase();

    return branchName.includes(query) || branchCity.includes(query);
  });

  return (
    <Layout title="Select Branch | Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        {/* Left Section */}
        <div className="md:col-span-7 flex flex-col p-4 bg-transparent relative">
          {/* Header section - Logo, Title, and Search */}
          <div className="sticky top-0 z-10 bg-white p-6 flex justify-end items-center ">
            <Logo />
          </div>

          {/* Search Input */}
          <div className="flex justify-between items-center w-full my-6">
            <h2 className="text-xl  ps-3">Choose Branch</h2>
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <input
                type="text"
                placeholder="Search by Branch Name or City"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
              />
              <button className="absolute right-3">
                <CiSearch className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Scrollable Branch Cards */}
          <div className="overflow-y-scroll  p-2 max-h-[calc(100vh-220px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
              {loading ? (
                <div className="w-full h-24 bg-gray-200 animate-pulse"></div>
              ) : filteredBranches && filteredBranches.length > 0 ? (
                [...filteredBranches]?.map((branch) => {
                  const colorIndex = hashCode(branch._id) % 6;
                  const color = [
                    "bg-yellow-300",
                    "bg-blue-300",
                    "bg-green-300",
                    "bg-red-300",
                    "bg-purple-300",
                    "bg-pink-300",
                  ][colorIndex];

                  const isActive =
                    selectedBranch && selectedBranch._id === branch._id;

                  return (
                    <motion.div
                      key={branch._id}
                      className={` ${color} ${
                        isActive ? "active-branch" : ""
                      } p-3 rounded-lg shadow-lg text-white h-40 relative cursor-pointer transform transition duration-300 hover:scale-105`}
                      onClick={() => handleBranchSelect(branch)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold">
                          {branch.nameOfSchool}
                        </h3>
                        <p className="text-sm">{branch.city}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 mb-1 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-white text-gray-800">
                          <img
                            src={getBranchImage(branch)}
                            alt={branch.nameOfSchool}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p>No branches available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Selected Branch Details and Next Button */}
        <div className="md:col-span-5 flex flex-col justify-center items-center p-10 bg-pink-50 relative">
          {selectedBranch ? (
            <motion.div
              className="w-full h-full flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedBranch.nameOfSchool}
                </h3>
                <p className="text-lg text-gray-700">{selectedBranch.city}</p>

                {/* Branch Details */}
                <div className="mt-4">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={getBranchImage(selectedBranch)}
                      alt={selectedBranch.nameOfSchool}
                      className="w-32 h-32 object-contain rounded-full border-4 border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <motion.div
                className="mt-6 flex justify-center w-full "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600 ${
                    loading || !selectedBranch
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={loading || !selectedBranch}
                  onClick={HandleBranch}
                >
                  {loading ? (
                    <div className="flex justify-center">
                      <LuLoader className="animate-spin text-2xl" />
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="max-h-screen overflow-hidden">
                <img
                  src="https://app.studentdiwan.com/static/media/HomeBackground.93f9df2787512f2e9252.png" // Placeholder for banner image
                  alt="Branch Banner"
                  className="w-full h-screen object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectBranch;
