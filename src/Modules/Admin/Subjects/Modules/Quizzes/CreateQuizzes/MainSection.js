import React, { useState, Suspense, useCallback } from "react";
import CreateQuizHeader from "./Components/CreateQuizHeader";
import Tabs from "../Components/Tabs";
import QuizInstructions from "./Components/QuizInstructions";
import QuestionListView from "./Components/QuestionListView";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import useCreateQuiz from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/createQuiz";
import useAddQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useAddQuestion"; // Import the hook
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CreateQuizForm from "./Components/CreateQuizForm";
import QuestionForm from "./Components/QuestionForm";

const MainSection = () => {
  const [activeTab, setActiveTab] = useState("instructions");
  const [assignmentName, setAssignmentName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const { cid, sid } = useParams();
  const [formState, setFormState] = useState(initialFormState);
  const [quizId, setQuizId] = useState("");
  const [questionState, setQuestionState] = useState([]);
  const [answers, setAnswers] = useState(initialAnswersState);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");
  const [questionPoint, setQuestionPoint] = useState('');
  const [questionType, setQuestionType] = useState('multiple choice');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);
  const { createQuiz, loading } = useCreateQuiz();
  const { addQuestion, loading: questionLoading } = useAddQuestion(); // Destructure from hook

  const handleNameChange = (name) => setAssignmentName(name);
  const handleInstructionChange = (content) => setInstruction(content);
  const handleQuestionChange = (content) => setQuestion(content);
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAnswerChange = (index, e) => {
    const { name, value } = e.target;
    const newAnswers = [...answers];
    newAnswers[index][name] = value;
    setAnswers(newAnswers);
  };

  const addNewQuestion = async () => {
    const correctOption = answers.find((answer) => answer.isCorrect);
    const newQuestion = {
      questionText: question,
      questionPoint: questionPoint,
      type: questionType,
      options: answers,
      correctAnswer: correctOption ? correctOption.text : "", // Ensure correctAnswer is a string
      correctAnswerComment: rightAnswerComment,
      inCorrectAnswerComment: wrongAnswerComment,
    };

    const result = await addQuestion(quizId, newQuestion);
    if (result.success) {
      setQuestionState((prev) => [...prev, newQuestion]);
      resetQuestionForm();
      toast.success("Question Added");
    } else {
      toast.error("Failed to add question");
    }
  };

  const deleteQuestion = (index) => {
    const newQuestionState = questionState.filter((_, i) => i !== index);
    setQuestionState(newQuestionState);
    toast.success("Question Deleted");
  };

  const handleSave = async () => {
    const quizData = {
      ...formState,
      name: assignmentName,
      content: instruction,
      correctAnswerComment: rightAnswerComment,
      inCorrectAnswerComment: wrongAnswerComment,
      classId: cid,
      subjectId: sid,
    };
    const result = await createQuiz(quizData);
    if (result.success) {
      setActiveTab("questions");
      setQuizId(result.quiz._id);
      toast.success("Quiz created successfully");
    } else {
      toast.error("Failed to create quiz");
    }
  };

  const resetQuestionForm = () => {
    setQuestion("");
    setAnswers(initialAnswersState);
    setRightAnswerComment("");
    setWrongAnswerComment("");
    setQuestionPoint('');
    setQuestionType('multiple choice');
  };

  return (
    <div className="flex flex-col w-full">
      <CreateQuizHeader
        onSave={handleSave}
        onTabChange={setActiveTab}
        quizId={quizId}
      />

      <div className="w-full flex">
        <div
          className={` ${
            activeTab === "instructions" ? "w-[70%]" : "w-full"
          } border-x`}
        >
          <Tabs
            createPage={true}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={setActiveTab}
            handleSidebarOpen={handleSidebarOpen}
          >
            {(activeTab) => (
              <div className="h-full">
                {activeTab === "instructions" ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    <QuizInstructions
                      assignmentName={assignmentName}
                      instruction={instruction}
                      handleNameChange={handleNameChange}
                      handleInstructionChange={handleInstructionChange}
                    />
                  </Suspense>
                ) : (
                  <QuestionListView
                    quizId={quizId}
                    questionState={questionState}
                    handleSidebarOpen={handleSidebarOpen}
                    deleteQuestion={deleteQuestion}
                  />
                )}
              </div>
            )}
          </Tabs>
        </div>

        {activeTab === "instructions" && (
          <div className="w-[30%] h-full ">
            <CreateQuizForm
              {...formState}
              setDisplayGrade={(grade) =>
                setFormState((prev) => ({ ...prev, displayGrade: grade }))
              }
              setSubmissionFormat={(format) =>
                setFormState((prev) => ({ ...prev, submissionFormat: format }))
              }
              handleChange={handleFormChange}
            />
          </div>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        title="Add new Question"
        width="95%"
      >
        <QuestionForm
          question={question}
          answers={answers}
          questionPoint={questionPoint}
          questionType={questionType}
          rightAnswerComment={rightAnswerComment}
          wrongAnswerComment={wrongAnswerComment}
          handleQuestionChange={handleQuestionChange}
          handleAnswerChange={handleAnswerChange}
          setAnswers={setAnswers}
          setRightAnswerComment={setRightAnswerComment}
          setWrongAnswerComment={setWrongAnswerComment}
          setQuestionPoint={setQuestionPoint}
          setQuestionType={setQuestionType}
          addNewQuestion={addNewQuestion}
        />
      </Sidebar>
    </div>
  );
};

const initialFormState = {
  points: "",
  quizType: "",
  submissionFormat: "",
  allowedAttempts: 1,
  allowMultiple: false,
  numberOfAttempts: "",
  assignTo: "",
  showOneQuestionAtATime: "",
  questionType: "",
  section: "",
  allowShuffleAnswers: false,
  dueDate: "",
  availableFrom: "",
  lockQuestionsAfterAnswering: "",
  until: "",
  timeLimit: "",
  moduleId: "",
  chapterId: "",
};

const initialAnswersState = [
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

export default MainSection;
