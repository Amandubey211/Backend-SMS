import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranch,
  updateBranch,
} from "../../../../Store/Slices/Admin/branchs/branch.action";
import Layout from "../../../../Components/Common/Layout";
import Logo from "../../../../Components/Common/Logo";
import { CiSearch } from "react-icons/ci";
import { LuSchool } from "react-icons/lu";
import { FaSearchLocation } from "react-icons/fa"; // For "No branches found" placeholder
import { AiOutlineBank } from "react-icons/ai"; // Modern icon for "Choose Branch"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setLocalCookies } from "../../../../Utils/academivYear";
import { Tooltip, Spin } from "antd";

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
    if (str?.length === 0) return hash;
    for (let i = 0; i < str?.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const HandleBranch = () => {
    const data = {
      schoolId: selectedBranch?._id,
      logo: selectedBranch.logo || "",
    };
    dispatch(updateBranch({ navigate, data })).then(() => {
      setLocalCookies("SelectedschoolId", selectedBranch?._id);
    });
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  // Filter branches based on the search query
  const filteredBranches = branchs?.filter((branch) => {
    const branchName = branch.nameOfSchool?.toLowerCase();
    const branchCity = branch.city?.toLowerCase();
    const query = searchQuery?.toLowerCase();
    return branchName?.includes(query) || branchCity?.includes(query);
  });

  // Generate a background color from branchId
  const getBranchColor = (id) => {
    const colorIndex = hashCode(id) % 6;
    const colors = [
      "bg-yellow-300",
      "bg-blue-300",
      "bg-green-300",
      "bg-red-300",
      "bg-purple-300",
      "bg-pink-300",
    ];
    return colors[colorIndex];
  };

  return (
    <Layout title="Select Branch | Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen">
        {/* Left Section */}
        <div className="md:col-span-7 flex flex-col p-4 bg-transparent relative">
          {/* Header section - Logo, Title, and Search */}
          <div className="sticky top-0 z-10 bg-white p-6 flex justify-end items-center">
            <Logo />
          </div>

          {/* Search Input */}
          <div className="flex justify-between items-center w-full my-6">
            <h2 className="text-xl ps-3 flex items-center gap-2">
              <AiOutlineBank className="text-2xl" />
              Choose Branch
            </h2>
            <div className="relative flex items-center max-w-xs w-full mr-4">
              <label htmlFor="branchSearch" className="sr-only">
                Search Branch
              </label>
              <input
                type="text"
                id="branchSearch"
                aria-label="Search branches by name or city"
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
          <div className="overflow-y-scroll p-2 max-h-[calc(100vh-220px)]">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-24 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : filteredBranches?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
                {filteredBranches?.map((branch) => {
                  const isActive = selectedBranch?._id === branch?._id;
                  const branchColor = getBranchColor(branch?._id);

                  return (
                    <motion.div
                      key={branch?._id}
                      className={`${branchColor} p-3 rounded-lg text-white h-40 relative cursor-pointer transform transition-all duration-300 ${
                        isActive
                          ? "border border-pink-500 shadow-[0_0_15px_3px_rgba(236,72,153,0.5)]"
                          : "shadow-lg"
                      }`}
                      onClick={() => handleBranchSelect(branch)}
                      initial={{ opacity: 0 }}
                      animate={
                        isActive
                          ? {
                              opacity: 1,
                              scale: [1, 1.05, 1],
                              transition: { duration: 0.5 },
                            }
                          : { opacity: 1, scale: 1 }
                      }
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-4">
                        <Tooltip
                          title={
                            branch?.nameOfSchool || "Branch Name Unavailable"
                          }
                        >
                          <h3 className="text-sm font-semibold truncate">
                            {branch?.nameOfSchool}
                          </h3>
                        </Tooltip>
                        <p className="text-sm">{branch?.city}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 mb-1 rounded-full overflow-hidden border-2 border-white flex justify-center items-center bg-white text-gray-800">
                          {!branch.logo ? (
                            <LuSchool
                              size={30}
                              aria-label="Default branch logo placeholder"
                            />
                          ) : (
                            <img
                              src={branch.logo}
                              alt={`Logo of ${branch?.nameOfSchool}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[calc(100vh-220px)]">
                <div className="flex flex-col items-center text-center space-y-2">
                  <FaSearchLocation className="text-gray-400 text-6xl" />
                  <p className="text-gray-600 text-lg">
                    No matching branches found.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please adjust your search or contact support.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Selected Branch Details and Next Button */}
        <div className="md:col-span-5 flex flex-col p-10 bg-pink-50 relative h-full">
          {selectedBranch ? (
            <motion.div
              className="flex flex-col justify-between h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Top-Left Info */}
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedBranch?.nameOfSchool}
                </h3>
                <p className="text-lg text-gray-700">{selectedBranch?.city}</p>
                {/* Centered Logo */}
                <div className="flex items-center justify-center mt-6">
                  {!selectedBranch?.logo ? (
                    <LuSchool
                      size={80}
                      aria-label="Selected branch default logo placeholder"
                    />
                  ) : (
                    <img
                      src={selectedBranch?.logo}
                      alt={`Logo of ${selectedBranch?.nameOfSchool}`}
                      className="w-60 h-60 object-contain rounded-full border-4 border-pink-500"
                    />
                  )}
                </div>
              </div>
              {/* Next Button pinned at bottom */}
              <div className="flex justify-center w-full mt-6">
                <motion.button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md transition-all duration-300 hover:brightness-110 hover:shadow-md ${
                    loading || !selectedBranch
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={loading || !selectedBranch}
                  onClick={HandleBranch}
                >
                  {loading ? (
                    <div className="flex justify-center">
                      <Spin size="small" />
                    </div>
                  ) : (
                    "Next"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="max-h-screen overflow-hidden">
                <img
                  src="https://app.studentdiwan.com/static/media/HomeBackground.93f9df2787512f2e9252.png"
                  alt="Background banner for branch selection"
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
