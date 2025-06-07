import Layout from "../../../../../../Components/Common/Layout";
import StudentDashLayout from "../../../../../../Components/Student/StudentDashLayout";
import { useSelector } from "react-redux";
import MainSection from "./MainSection";
import useNavHeading from "../../../../../../Hooks/CommonHooks/useNavHeading ";

const Quizzes = () => {
  const { subjectName } = useSelector(
    (store) => store?.student?.studentSubject?.subject
  );
  const { classData } = useSelector((store) => store?.student?.studentClass);
  const className = classData?.className;

  useNavHeading(className, subjectName);
  return (
    <Layout title="Quiz | Student Diwan">
      <StudentDashLayout>
        <MainSection />
      </StudentDashLayout>
    </Layout>
  );
};

export default Quizzes;
