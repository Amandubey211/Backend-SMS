import React, { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { stdGetSingleQuiz } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizes.action";
import { setActiveTab } from "../../../../../../../Store/Slices/Student/MyClass/Class/Subjects/Quizes/quizesSlice";

const Tabs = ({
  children,
  // onTabChange,
  createPage,
  quizSubmitted,
  hasAttempted,
  hasRemainingAttempts,
  attemptHistory,
}) => {
  // console.log("attempt history is===>",attemptHistory.length)
  const { qid } = useParams();
  const { loading, activeTab } = useSelector(
    (store) => store?.student?.studentQuiz
  );
  const { itemDetails: quiz } = useSelector(
    (store) => store?.student?.studentQuiz
  );
  const dispatch = useDispatch();
  const handleTabClick = (tab) => {
    // if (tab === "questions" && !hasRemainingAttempts) {
    //   alert("No more attempts allowed.");
    //   return;
    // }

    dispatch(setActiveTab(tab));

    // Call onTabChange only if it exists
    // if (onTabChange && typeof onTabChange === "function") {
    //   onTabChange(tab);
    // }
  };

  const { name, quizType, availableFrom } = quiz;

  useEffect(() => {
    dispatch(stdGetSingleQuiz({ quizId: qid }));
  }, [dispatch, stdGetSingleQuiz, qid]);

  return (
    <>
      <div className="flex justify-between items-center p-2 px-3 border-b">
        {!createPage && (
          <div>
            <h2 className="text-xl font-semibold mb-1">{name}</h2>
            <div className="flex items-center text-gray-500">
              <span className="text-green-600 font-medium mr-2">
                {quizType}
              </span>
              <span className="mx-2">|</span>
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Available From: {availableFrom?.slice(0, 10)}
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2 bg-white">
          <button
            onClick={() => handleTabClick("instructions")}
            className={`flex-grow ${
              activeTab === "instructions"
                ? "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200"
                : "border border-gray-300 text-gray-800"
            } rounded-md py-2 px-4 text-center transition`}
          >
            <span
              className={`${
                activeTab === "instructions" ? "text-gradient" : "text-black"
              }`}
            >
              Quiz Instructions
            </span>
          </button>

          <button
            onClick={() => handleTabClick("questions")}
            className={`flex-grow ${
              activeTab === "questions"
                ? "bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200"
                : "border border-gray-300 text-gray-800"
            } rounded-md py-2 px-4 text-center transition`}
          >
            <span
              className={`${
                activeTab === "questions" ? "text-gradient" : "text-black"
              }`}
            >
              {`Quiz Questions`}
            </span>
          </button>
        </div>
      </div>
      <div className="p-4">{!loading && children(activeTab)}</div>
    </>
  );
};

export default Tabs;
