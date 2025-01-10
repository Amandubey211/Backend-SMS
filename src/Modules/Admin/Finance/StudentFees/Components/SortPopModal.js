import React from "react";
import PropTypes from "prop-types";

const SortPopModal = ({ visible, onClose, onApply, selectedOption, setSelectedOption }) => {
    if (!visible) return null;

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-lg shadow-md">
                {/* Red strip at the top */}
                <div className="bg-gradient-to-r bg-[#C83B62] h-12 rounded-t-lg flex items-center px-4">
                    <h2 className="text-white font-medium text-lg">Sort</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Radio buttons for sorting options */}
                    <div className="space-y-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="sortOrder"
                                value="newest"
                                checked={selectedOption === "newest"}
                                onChange={() => setSelectedOption("newest")}
                                className="form-radio text-purple-500 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-gray-700">Newest to oldest</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="sortOrder"
                                value="oldest"
                                checked={selectedOption === "oldest"}
                                onChange={() => setSelectedOption("oldest")}
                                className="form-radio text-purple-500 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-gray-700">Oldest to newest</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="sortOrder"
                                value="alphabetical"
                                checked={selectedOption === "alphabetical"}
                                onChange={() => setSelectedOption("alphabetical")}
                                className="form-radio text-purple-500 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-gray-700">Alphabetical order</span>
                        </label>
                    </div>

                    {/* Single Apply button at the bottom */}
                    <div className="text-center">
                        <button
                            onClick={onApply}
                            className="px-6 py-2 w-full bg-gradient-to-r from-[#C83B62] to-[#7F35CD] text-white font-medium rounded-md hover:from-purple-600 hover:to-pink-600"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

SortPopModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    selectedOption: PropTypes.string.isRequired,
    setSelectedOption: PropTypes.func.isRequired,
};

export default SortPopModal;
