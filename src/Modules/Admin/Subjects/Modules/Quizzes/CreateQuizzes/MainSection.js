import React, { useState, useEffect, Suspense } from "react";
import { useParams, useLocation } from "react-router-dom";
import CreateQuizHeader from "./Components/CreateQuizHeader";
import Tabs from "../Components/Tabs";
import QuizInstructions from "./Components/QuizInstructions";
import QuestionListView from "./Components/QuestionListView";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import toast from "react-hot-toast";

import QuizManager from "./Components/QuizManager";
import QuestionFormContainer from "./Components/QuestionFormContainer";
import useAddQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useAddQuestion";
import useEditQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useEditQuestion";
import useDeleteQuestion from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useDeleteQuestion";
import CreateQuizForm from "./Components/CreateQuizForm";
import useSidebar from "../../../../../../Hooks/CommonHooks/useSidebar";
import useFormState from "../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useFormState";

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
  const [question, setQuestion] = useState("");
  const [questionState, setQuestionState] = useState([]);
  const [answers, setAnswers] = useState(initialAnswersState);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");
  const [questionPoint, setQuestionPoint] = useState(1);
  const [questionType, setQuestionType] = useState("multiple choice");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [quizId, setQuizId] = useState("");

  const { isSidebarOpen, handleSidebarOpen, handleSidebarClose } = useSidebar();
  const { formState, handleFormChange, setFormState } = useFormState();
  const { addQuestion, loading: questionLoading } = useAddQuestion();
  const { editQuestion, loading: editLoading } = useEditQuestion();
  const { deleteQuestion, error, loading } = useDeleteQuestion();
  const {
    assignmentName,
    setAssignmentName,
    instruction,
    setInstruction,
    handleSave,
    isEditing,
  } = QuizManager({
    formState,
    setFormState,
    setActiveTab,
    setQuizId,
    quizId,
  });

  useEffect(() => {
    if (location.state && location.state.quiz) {
      const quiz = location.state.quiz;
      setQuestionState(quiz.questions || []);
      setAnswers(quiz.answers || initialAnswersState);
      setRightAnswerComment(quiz.rightAnswerComment || "");
      setWrongAnswerComment(quiz.wrongAnswerComment || "");
    }
  }, [location.state]);

  const handleQuestionChange = (content) => setQuestion(content);

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
      correctAnswer: correctOption ? correctOption.text : "",
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

  const deleteQuestionHandler = async (index) => {
    const questionToDelete = questionState[index];
    const result = await deleteQuestion(quizId, questionToDelete._id);
    if (result.success) {
      const newQuestionState = questionState.filter((_, i) => i !== index);
      setQuestionState(newQuestionState);
      toast.success("Question Deleted");
    } else {
      toast.error("Failed to delete question");
    }
  };

  const editQuestionHandler = (index) => {
    const questionToEdit = questionState[index];
    setQuestion(questionToEdit.questionText);
    setAnswers(questionToEdit.options);
    setRightAnswerComment(questionToEdit.correctAnswerComment);
    setWrongAnswerComment(questionToEdit.inCorrectAnswerComment);
    setQuestionPoint(questionToEdit.questionPoint);
    setQuestionType(questionToEdit.type);
    setEditingQuestionId(questionToEdit._id);
    handleSidebarOpen();
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

    const result = await editQuestion(quizId, editingQuestionId, updatedQuestion);
    if (result.success) {
      const updatedQuestions = questionState.map((q) =>
        q._id === editingQuestionId ? { ...q, ...updatedQuestion } : q
      );
      setQuestionState(updatedQuestions);
      resetQuestionForm();
      handleSidebarClose();
      toast.success("Question Updated");
    } else {
      toast.error("Failed to update question");
    }
  };

  const handleSaveQuestion = async () => {
    console.log(editingQuestionId,"sdfgvbhn")
    if (editingQuestionId) {
      await updateQuestion();
    } else {
      await addNewQuestion();
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
      <CreateQuizHeader onSave={handleSave} onTabChange={setActiveTab} isEditing={isEditing} />

      <div className="w-full flex">
        <div className={`${activeTab === "instructions" ? "w-[70%]" : "w-full"} border-x`}>
          <Tabs
            createPage={true}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={setActiveTab}
            handleSidebarOpen={() => {
              resetQuestionForm(); // Reset the form before opening the sidebar
              handleSidebarOpen();
            }}
          >
            {(activeTab) => (
              <div className="h-full">
                {activeTab === "instructions" ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    <QuizInstructions
                      assignmentName={assignmentName}
                      instruction={instruction}
                      handleNameChange={setAssignmentName}
                      handleInstructionChange={setInstruction}
                    />
                  </Suspense>
                ) : (
                  <QuestionListView
                    quizId={quizId}
                    questionState={questionState}
                    handleSidebarOpen={handleSidebarOpen}
                    deleteQuestion={deleteQuestionHandler}
                    editQuestion={editQuestionHandler}
                  />
                )}
              </div>
            )}
          </Tabs>
        </div>

        {activeTab === "instructions" && (
          <div className="w-[30%] h-full">
            <CreateQuizForm
              {...formState}
              setDisplayGrade={(grade) => setFormState((prev) => ({ ...prev, displayGrade: grade }))}
              setSubmissionFormat={(format) => setFormState((prev) => ({ ...prev, submissionFormat: format }))}
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
        <QuestionFormContainer
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
          addNewQuestion={handleSaveQuestion}
        />
      </Sidebar>
    </div>
  );
};

export default MainSection;
