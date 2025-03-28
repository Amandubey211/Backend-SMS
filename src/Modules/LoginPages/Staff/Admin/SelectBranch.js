import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranch,
  updateBranch,
} from "../../../../Store/Slices/Admin/branchs/branch.action";
import Layout from "../../../../Components/Common/Layout";
import Logo from "../../../../Components/Common/Logo";
import { CiSearch } from "react-icons/ci";
import { FaSearchLocation } from "react-icons/fa";
import { AiOutlineBank, AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setLocalCookies } from "../../../../Utils/academivYear";
import { Tooltip, Spin, Skeleton } from "antd";
import DefaultBranchLogo from "../../../../Assets/HomeAssets/TeacherBtnLogo.png";
import toast from "react-hot-toast";

// Reusable Skeleton component to mimic branch card UI
const BranchCardSkeleton = () => {
  return (
    <div className="bg-gray-100 p-3 rounded-lg text-white h-40 relative">
      <div className="mb-7">
        {/* Simulate branch name and city */}
        <Skeleton.Input style={{ width: "50%" }} active size="small" />
      </div>
      <div className="flex items-center justify-center">
        {/* Simulate branch logo */}
        <Skeleton.Avatar active size={60} shape="circle" />
      </div>
    </div>
  );
};

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
    if (!str) return hash;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash &= hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const HandleBranch = () => {
    if (!selectedBranch) return;
    const data = {
      schoolId: selectedBranch?._id,
      logo: selectedBranch?.logo || "",
    };
    dispatch(updateBranch({ navigate, data })).then(() => {
      setLocalCookies("SelectedschoolId", selectedBranch?._id);
    });
  };

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
          <div className="sticky top-0 z-10 bg-white p-6 flex justify-end items-center">
            <Logo />
          </div>
          <div className="flex justify-between items-center w-full my-6">
            <h2 className="text-xl ps-3 flex items-center gap-2">
              <div className="bg-pink-100 p-2 rounded-full">
                <AiOutlineBank className="text-pink-500 text-2xl" />
              </div>
              <span className="text-gray-800">Choose Branch</span>
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
          <div className="overflow-y-scroll p-2 max-h-[calc(100vh-220px)]">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
                {[...Array(6)].map((_, idx) => (
                  <BranchCardSkeleton key={idx} />
                ))}
              </div>
            ) : filteredBranches?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center mb-10">
                {filteredBranches.map((branch) => {
                  const isActive = selectedBranch?._id === branch._id;
                  const branchColor = getBranchColor(branch._id);
                  return (
                    <motion.div
                      key={branch._id}
                      className={`${branchColor} p-3 rounded-lg text-white h-40 relative cursor-pointer transform transition-all duration-300 ${
                        isActive ? "border-2 border-pink-500" : "shadow-lg"
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
                          <img
                            src={branch.logo || DefaultBranchLogo}
                            alt={`Logo of ${
                              branch?.nameOfSchool || "Default branch"
                            }`}
                            className="w-full h-full object-cover"
                          />
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
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedBranch?.nameOfSchool}
                </h3>
                <p className="text-lg text-gray-700">{selectedBranch?.city}</p>
                <div className="flex items-center justify-center mt-6">
                  <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-pink-500">
                    <img
                      src={selectedBranch.logo || DefaultBranchLogo}
                      alt={`Logo of ${
                        selectedBranch?.nameOfSchool || "Default branch"
                      }`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full mt-6">
                <motion.button
                  type="button"
                  className={`w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-5 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200 ${
                    loading || !selectedBranch
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:brightness-110 hover:shadow-lg"
                  }`}
                  disabled={loading || !selectedBranch}
                  onClick={HandleBranch}
                  aria-label="Proceed to next step"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <Spin size="large" className="text-white" />
                      <span className="ml-2 text-white text-lg">
                        Processing...
                      </span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3 text-lg font-medium">
                      Next
                      <AiOutlineArrowRight className="text-white text-2xl" />
                    </span>
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
