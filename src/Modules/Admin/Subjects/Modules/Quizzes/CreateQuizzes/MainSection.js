import React, { useState, useEffect, Suspense } from "react";
import { useParams, useLocation } from "react-router-dom";
import CreateQuizHeader from "./Components/CreateQuizHeader";
import Tabs from "../Components/Tabs";
import QuizInstructions from "./Components/QuizInstructions";
import QuestionListView from "./Components/QuestionListView";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import useUpdateQuiz from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useUpdateQuiz";
import useAddQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useAddQuestion";
import useEditQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useEditQuestion";
import useDeleteQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuestion";
import useCreateQuiz from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/createQuiz";
import useSidebar from "../../../../../../Hooks/CommonHooks/useSidebar";
import useFetchQuizById from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useFetchQuizById";
import toast from "react-hot-toast";
import CreateQuizForm from "./Components/CreateQuizForm";
import QuestionForm from "./Components/QuestionForm";

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
  section: null,
  allowShuffleAnswers: false,
  dueDate: "",
  availableFrom: "",
  lockQuestionsAfterAnswering: "",
  until: "",
  timeLimit: "",
  moduleId: null,
  chapterId: null,
  group: null,
};

const initialAnswersState = [
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

const MainSection = () => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("instructions");
  const [assignmentName, setAssignmentName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [quizId, setQuizId] = useState("");
  const [questionState, setQuestionState] = useState([]);
  const [answers, setAnswers] = useState(initialAnswersState);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");
  const [questionPoint, setQuestionPoint] = useState(1);
  const [questionType, setQuestionType] = useState("multiple choice");
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const { createQuiz, loading: createLoading } = useCreateQuiz();
  const { updateQuiz, loading: updateLoading } = useUpdateQuiz();
  const { addQuestion, loading: questionLoading } = useAddQuestion();
  const { editQuestion, loading: editLoading } = useEditQuestion();
  const { deleteQuestion, error, loading } = useDeleteQuestion();
  const { handleSidebarClose, handleSidebarOpen, isSidebarOpen } = useSidebar();
  const { fetchQuizById, quiz } = useFetchQuizById();

  useEffect(() => {
    const quizIdFromState = location.state?.quizId;
    if (quizIdFromState) {
      setQuizId(quizIdFromState);
      fetchQuizById(quizIdFromState);
    }
  }, [location.state, fetchQuizById]);

  useEffect(() => {
    if (quiz) {
      setAssignmentName(quiz.name);
      setInstruction(quiz.content);
      setQuizId(quiz._id);
      setIsEditing(true);
      setFormState({
        points: quiz.points || "",
        quizType: quiz.quizType || "",
        submissionFormat: quiz.submissionFormat || "",
        allowedAttempts: quiz.allowedAttempts || 1,
        allowMultiple: quiz.allowMultiple || false,
        numberOfAttempts: quiz.numberOfAttempts || "",
        assignTo: quiz.assignTo || "",
        showOneQuestionAtATime: quiz.showOneQuestionAtATime || "",
        questionType: quiz.questionType || "",
        section: quiz?.sectionId || null,
        allowShuffleAnswers: quiz.allowShuffleAnswers || false,
        dueDate: quiz.dueDate || "",
        availableFrom: quiz.availableFrom || "",
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || "",
        until: quiz.until || "",
        timeLimit: quiz.timeLimit || "",
        moduleId: quiz.moduleId || null,
        chapterId: quiz.chapterId || null,
        group: quiz?.groupId || null,
      });
      setQuestionState(quiz.questions || []);
      setAnswers(quiz.answers || initialAnswersState);
      setRightAnswerComment(quiz.rightAnswerComment || "");
      setWrongAnswerComment(quiz.wrongAnswerComment || "");
    }
  }, [quiz]);

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
      questionPoint: Number(questionPoint),
      type: questionType,
      options: answers,
      correctAnswer: correctOption ? correctOption.text : "",
      correctAnswerComment: rightAnswerComment,
      inCorrectAnswerComment: wrongAnswerComment,
    };
    console.log(newQuestion, "new questio", typeof newQuestion.questionPoint);
    const result = await addQuestion(quizId, newQuestion);
    if (result.success) {
      setQuestionState((prev) => [...prev, newQuestion]);
      resetQuestionForm();
      fetchQuizById(quizId); // Refetch quiz
    }
  };

  const deleteQuestionHandler = async (questionId) => {
    const result = await deleteQuestion(quizId, questionId);
    if (result.success) {
      setQuestionState((prev) => prev.filter((q) => q._id !== questionId));
      fetchQuizById(quizId); // Refetch quiz
    }
  };

  const editQuestionHandler = (questionId) => {
    const questionToEdit = questionState.find((q) => q._id === questionId);
    setQuestion(questionToEdit.questionText);
    setAnswers(questionToEdit.options);
    setRightAnswerComment(questionToEdit.correctAnswerComment);
    setWrongAnswerComment(questionToEdit.inCorrectAnswerComment);
    setQuestionPoint(questionToEdit.questionPoint);
    setQuestionType(questionToEdit.type);
    setEditingQuestionId(questionToEdit._id);
    handleSidebarOpen();
  };

  const handleAddNewQuestion = () => {
    resetQuestionForm();
    handleSidebarOpen();
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
    if (formState.assignTo === "Section") {
      quizData.sectionId = formState.section || null;
    } else if (formState.assignTo === "Group") {
      quizData.groupId = formState.group || null;
    }
    if (isEditing) {
      const result = await updateQuiz(quizId, quizData);
      if (result.success) {
        setActiveTab("questions");
      }
    } else {
      const result = await createQuiz(quizData);
      if (result.success) {
        setActiveTab("questions");
        setQuizId(result.quiz._id);
        toast.success("Quiz created successfully");
      } else {
        toast.error("Failed to create quiz");
      }
    }
  };

  const updateQuestion = async () => {
    const correctOption = answers.find((answer) => answer.isCorrect);
    const updatedQuestion = {
      questionText: question,
      questionPoint: questionPoint,
      type: questionType,
      options: answers,
      correctAnswer: correctOption ? correctOption.text : "",
      correctAnswerComment: rightAnswerComment,
      inCorrectAnswerComment: wrongAnswerComment,
    };

    const result = await editQuestion(
      quizId,
      editingQuestionId,
      updatedQuestion
    );
    if (result.success) {
      const updatedQuestions = questionState.map((q) =>
        q._id === editingQuestionId ? updatedQuestion : q
      );
      setQuestionState(updatedQuestions);
      resetQuestionForm();
      handleSidebarClose();
      toast.success("Question Updated");
    } else {
      toast.error("Failed to update question");
    }
  };

  const resetQuestionForm = () => {
    setQuestion("");
    setAnswers(initialAnswersState);
    setRightAnswerComment("");
    setWrongAnswerComment("");
    setQuestionPoint(1);
    setQuestionType("multiple choice");
    setEditingQuestionId(null);
  };

  return (
    <div className="flex flex-col w-full">
      <CreateQuizHeader
        onSave={handleSave}
        onTabChange={setActiveTab}
        isEditing={isEditing}
      />

      <div className="w-full flex">
        <div
          className={` ${activeTab === "instructions" ? "w-[70%]" : "w-full"
            } border-x`}
        >
          <Tabs
            createPage={true}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={setActiveTab}
            handleSidebarOpen={handleAddNewQuestion}
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
                    handleSidebarOpen={handleAddNewQuestion}
                    deleteQuestion={deleteQuestionHandler}
                    editQuestion={editQuestionHandler}
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
        title={editingQuestionId ? "Edit Question" : "Add new Question"}
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
          addNewQuestion={editingQuestionId ? updateQuestion : addNewQuestion}
        />
      </Sidebar>
    </div>
  );
};

export default MainSection;
