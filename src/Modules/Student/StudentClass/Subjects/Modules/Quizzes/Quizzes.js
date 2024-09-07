import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";
import MainSection from "./MainSection";
import useFetchQuizById from "../../../../../../Hooks/AuthHooks/Student/Quiz/useFetchQuizById";
import Spinner from "../../../../../../Components/Common/Spinner";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const Quizzes = () => {
  const { qid } = useParams();
  const subjectName = useSelector((store) => store.Common.selectedSubjectName);
  const className = useSelector((store) => store.Common.selectedClassName);

  useNavHeading(className, subjectName);

  const { quiz, loading, error, refetch } = useFetchQuizById(qid);

  if (loading) {
    return (
      <Layout title="Loading Quiz | Student Diwan">
        <StudentDashLayout>
          <Spinner />
        </StudentDashLayout>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error Loading Quiz | Student Diwan">
        <StudentDashLayout>
          <div className="text-center p-4 text-red-600">
            {error || "Error loading the quiz. Please try again later."}
          </div>
          <button
            onClick={refetch}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Retry
          </button>
        </StudentDashLayout>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout title="Quiz Not Found | Student Diwan">
        <StudentDashLayout>
          <div className="text-center p-4 text-red-600">
            No quiz data available. Please try again.
          </div>
        </StudentDashLayout>
      </Layout>
    );
  }

  return (
    <Layout title="Quizzes | Student Diwan">
      <StudentDashLayout>
        <MainSection quiz={quiz} />
      </StudentDashLayout>
    </Layout>
  );
};

export default Quizzes;
