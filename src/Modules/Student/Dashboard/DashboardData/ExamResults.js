import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExamResults } from "../../../../Store/Slices/Student/Dashboard/studentDashboard.action";
import { IoNewspaperOutline } from "react-icons/io5";

const ExamResults = () => {
    const dispatch = useDispatch();
    const { results, loading, error } = useSelector((state) => state.student.studentDashboard);

    useEffect(() => {
        dispatch(fetchExamResults());
    }, [dispatch]);

    if (loading) return <p className="text-center">Loading Exam Results...</p>;
    if (error)
        return (
            <p className="text-center text-red-500">
                {error || "Error loading exam results"}
            </p>
        );

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {results.length > 0 ? (
                results.map((result) => (
                    <div
                        key={result.quizName}
                        className="bg-white p-4 shadow-md rounded-md hover:shadow-lg transition duration-300"
                    >
                        <h5 className="text-lg font-semibold">{result.quizName}</h5>
                        <p className="text-gray-500">
                            Type: {result.quizType} | Attempts: {result.attempts}
                        </p>
                        <p>
                            Score: {result.score}/{result.totalPoints}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Submitted At: {new Date(result.submittedAt).toLocaleDateString()}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-center mt-10 text-gray-500">
                    <IoNewspaperOutline size={70} />
                    <p className="mt-4 text-lg font-semibold">No Exam Results for Now</p>
                </div>
            )}
        </div>

    );
};

export default ExamResults;
