import { useState } from "react";
import { Button } from "antd";

const RubricModal = ({ rubric, isOpen, onClose }) => {
    if (!rubric) return null;
    console.log('rubric inside modal--', rubric);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        View Rubric
                        <span className="text-blue-500 text-lg cursor-pointer">ℹ</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ✖
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Rubric Name</label>
                        <input
                            type="text"
                            value={rubric?.name}
                            className="block w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            {rubric.assignmentId ? "Assignment" : "Quiz"}
                        </label>
                        <input
                            type="text"
                            value={rubric.assignmentId?.name || rubric.quizId?.name || "-"}
                            className="block w-full p-2 border rounded-md bg-gray-100 focus:outline-none"
                            disabled
                        />
                    </div>
                </div>

                <div className="mt-6 border rounded-md overflow-hidden shadow-sm">
                    <div className="grid grid-cols-3 bg-pink-100 text-pink-700 font-semibold py-2 px-4 text-center">
                        <div>Criteria</div>
                        <div>Ratings</div>
                        <div>Point</div>
                    </div>
                    {rubric.criteria.map((criterion) => (
                        <div key={criterion._id} className="border-b p-4 grid grid-cols-3 items-center text-center">
                            <div className="font-medium text-left pl-4">{criterion.title}</div>
                            <div className="space-y-1">
                                {criterion.ratings.map((rating) => (
                                    <div key={rating._id} className="p-2 bg-gray-100 rounded-md shadow-sm text-left">
                                        <p className="font-medium">{rating.ratingTitle}</p>
                                        <p className="text-sm text-gray-700">{rating.ratingDescription}</p>
                                        <span className="font-bold">{rating.ratingScore}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right pr-4">
                                <div className="bg-gray-100 rounded-md p-2 inline-block w-16 text-center shadow-sm">
                                    {criterion.ratings.reduce((sum, r) => sum + r.ratingScore, 0)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-right text-pink-600 font-bold text-lg">
                    Total Assignment Points: {rubric.totalScore}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RubricModal;
