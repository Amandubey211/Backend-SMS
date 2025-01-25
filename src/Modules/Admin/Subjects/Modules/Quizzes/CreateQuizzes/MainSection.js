import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreateQuizHeader from "./Components/CreateQuizHeader";
import Tabs from "../Components/Tabs";
import QuizInstructions from "./Components/QuizInstructions";
import Sidebar from "../../../../../../Components/Common/Sidebar";
import CreateQuizForm from "./Components/CreateQuizForm";
import QuestionForm from "./Components/QuestionForm";
import QuestionListView from "./Components/QuestionListView";
import {
  fetchQuizByIdThunk,
  createQuizThunk,
  updateQuizThunk,
  addQuestionThunk,
  updateQuestionThunk,
  deleteQuestionThunk,
} from "../../../../../../Store/Slices/Admin/Class/Quiz/quizThunks";
import ProtectedAction from "../../../../../../Routes/ProtectedRoutes/ProtectedAction";
import ProtectedSection from "../../../../../../Routes/ProtectedRoutes/ProtectedSection";

const initialFormState = {
  points: "",
  quizType: "Practice",
  submissionFormat: "",
  allowedAttempts: true,
  allowNumberOfAttempts: 1,
  assignTo: "Everyone",
  showOneQuestionOnly: false,
  questionType: "",
  sectionId: null,
  allowShuffleAnswers: false,
  dueDate: "",
  availableFrom: "",
  lockQuestionAfterAnswering: false,
  until: "",
  timeLimit: "",
  moduleId: null,
  chapterId: null,
  groupId: null,
  studentSeeAnswer: false,
  showAnswerDate: "",
};

const initialAnswersState = [
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
  { text: "", isCorrect: false },
];

const MainSection = ({ setIsEditing, isEditing }) => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const { quizzDetail: quiz } = useSelector((state) => state.admin.quizzes);
  const [activeTab, setActiveTab] = useState("instructions");
  const [assignmentName, setAssignmentName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(""); // <-- Add this line to fix the error
  const [answers, setAnswers] = useState(initialAnswersState);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");
  const [questionPoint, setQuestionPoint] = useState(1);
  const [questionType, setQuestionType] = useState("multiple choice");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  // const [isEditing, setLocalIsEditing] = useState(false);
  const navigate = useNavigate();
  const quizIdFromRedux = useSelector(
    (state) => state.admin.quizzes.quizzDetail?._id || ""
  );
  // Fetch quiz by ID if it exists
  useEffect(() => {
    const quizIdFromState = location.state?.quizId;

    if (quizIdFromState) {
      setQuizId(quizIdFromState || quizIdFromRedux);
      setIsEditing(true);

      dispatch(fetchQuizByIdThunk(quizIdFromState));
    } else {
      // Reset form when not editing
      setIsEditing(false);
      setQuizId(""); // Clear quiz ID
      setFormState(initialFormState); // Reset form to initial state
      setAssignmentName(""); // Reset name
      setInstruction(""); // Reset instructions
      setQuestions([]); // Reset questions
      setAnswers(initialAnswersState); // Reset answers
      setRightAnswerComment(""); // Reset right answer comment
      setWrongAnswerComment(""); // Reset wrong answer comment
    }
  }, [location.state, dispatch, setIsEditing]);

  // Set form values when quiz data is available
  useEffect(() => {
    if (isEditing && quiz) {
      setAssignmentName(quiz.name || "");
      setInstruction(quiz.content || "");
      setQuizId(quiz?._id || "");

      setFormState((prevState) => ({
        ...prevState,
        points: quiz.points || prevState.points,
        quizType: quiz.quizType || prevState.quizType,
        submissionFormat: quiz.submissionFormat || prevState.submissionFormat,
        allowedAttempts: quiz.allowedAttempts,
        allowNumberOfAttempts: quiz.allowNumberOfAttempts,
        assignTo: quiz.assignTo || prevState.assignTo,
        showOneQuestionOnly:
          quiz.showOneQuestionOnly || prevState.showOneQuestionOnly,
        questionType: quiz.questionType || prevState.questionType,
        sectionId: quiz.sectionId || prevState.sectionId,
        allowShuffleAnswers:
          quiz.allowShuffleAnswers || prevState.allowShuffleAnswers,
        studentSeeAnswer: quiz.studentSeeAnswer || prevState.studentSeeAnswer,
        showAnswerDate: quiz.showAnswerDate || prevState.showAnswerDate,
        dueDate: quiz.dueDate || prevState.dueDate,
        availableFrom: quiz.availableFrom || prevState.availableFrom,
        lockQuestionAfterAnswering:
          quiz.lockQuestionAfterAnswering ||
          prevState.lockQuestionAfterAnswering,
        until: quiz.until || prevState.until,
        timeLimit: quiz.timeLimit || prevState.timeLimit,
        moduleId: quiz.moduleId || prevState.moduleId,
        chapterId: quiz.chapterId || prevState.chapterId,
        groupId: quiz.groupId || prevState.groupId,
      }));
      setQuestions(quiz.questions || []); // Preload questions
      setAnswers(quiz.answers || initialAnswersState); // Preload answers
      setRightAnswerComment(quiz.rightAnswerComment || "");
      setWrongAnswerComment(quiz.wrongAnswerComment || "");
    }
  }, [isEditing, quiz]);
  useEffect(() => {
    if (quizIdFromRedux) {
      setQuizId(quizIdFromRedux);
      setIsEditing(true);
    }
  }, [quizIdFromRedux]);

  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === "checkbox" ? checked : value;

    // If 'allowedAttempts' is unchecked (false), set 'allowNumberOfAttempts' to null
    if (name === "allowedAttempts" && !checked) {
      setFormState((prevState) => ({
        ...prevState,
        allowedAttempts: updatedValue,
        allowNumberOfAttempts: null, // Reset when attempts are disallowed
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: updatedValue,
      }));
    }
  }, []);

  const handleQuestionChange = useCallback(
    (content) => setQuestion(content),
    []
  );

  const handleAnswerChange = useCallback(
    (index, e) => {
      const { name, value } = e.target;
      const newAnswers = [...answers];
      newAnswers[index][name] = value;
      setAnswers(newAnswers);
    },
    [answers]
  );

  const handleAddNewQuestion = () => {
    setQuestion(""); // Reset the question
    setAnswers(initialAnswersState);
    setRightAnswerComment("");
    setWrongAnswerComment("");
    setQuestionPoint(1);
    setQuestionType("multiple choice");
    setSidebarOpen(true); // Open sidebar for adding a new question
    setEditingQuestionId(null); // Ensure it's a new question
  };

  const addNewQuestion = useCallback(async () => {
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

    try {
      const result = await dispatch(
        addQuestionThunk({ quizId, question: newQuestion })
      );

      if (addQuestionThunk.fulfilled.match(result)) {
        setSidebarOpen(false); // Close the sidebar on success
      } else {
        // Optionally handle the error case
        console.error("Failed to add question:", result.payload);
      }
    } catch (error) {
      console.error("An error occurred while adding the question:", error);
    }
  }, [
    dispatch,
    quizId,
    question,
    questionPoint,
    questionType,
    answers,
    rightAnswerComment,
    wrongAnswerComment,
  ]);

  const updateQuestion = useCallback(async () => {
    const correctOption = answers.find((answer) => answer.isCorrect);
    const updatedQuestion = {
      questionText: question,
      questionPoint: Number(questionPoint),
      type: questionType,
      options: answers,
      correctAnswer: correctOption ? correctOption.text : "",
      correctAnswerComment: rightAnswerComment,
      inCorrectAnswerComment: wrongAnswerComment,
    };

    try {
      const result = await dispatch(
        updateQuestionThunk({
          quizId,
          questionId: editingQuestionId,
          question: updatedQuestion,
        })
      );

      if (updateQuestionThunk.fulfilled.match(result)) {
        setSidebarOpen(false); // Close the sidebar on success
      } else {
        // Optionally handle the error case
        console.error("Failed to update question:", result.payload);
      }
    } catch (error) {
      console.error("An error occurred while updating the question:", error);
    }
  }, [
    dispatch,
    quizId,
    editingQuestionId,
    question,
    questionPoint,
    questionType,
    answers,
    rightAnswerComment,
    wrongAnswerComment,
  ]);

  const deleteQuestionHandler = useCallback(
    async (questionId) => {
      const result = await dispatch(
        deleteQuestionThunk({ quizId, questionId })
      );
    },
    [dispatch, quizId]
  );

  const editQuestionHandler = useCallback(
    (questionId) => {
      const questionToEdit = questions.find((q) => q._id === questionId);
      setQuestion(questionToEdit.questionText); // Populate question data
      setAnswers(questionToEdit.options);
      setRightAnswerComment(questionToEdit.correctAnswerComment);
      setWrongAnswerComment(questionToEdit.inCorrectAnswerComment);
      setQuestionPoint(questionToEdit.questionPoint);
      setQuestionType(questionToEdit.type);
      setEditingQuestionId(questionToEdit._id);
      setSidebarOpen(true); // Open sidebar for editing the question
    },
    [questions]
  );

  const handleSaveQuiz = useCallback(
    async (publish) => {
      const quizData = {
        ...formState,
        name: assignmentName,
        content: instruction,
        correctAnswerComment: rightAnswerComment,
        inCorrectAnswerComment: wrongAnswerComment,
        classId: cid,
        subjectId: sid,
        publish,
      };

      // If `assignTo` is Section or Group, set the respective ID
      if (formState.assignTo === "Section") {
        quizData.sectionId = formState.sectionId || null;
      } else if (formState.assignTo === "Group") {
        quizData.groupId = formState.groupId || null;
      }

      // Ensure allowedAttempts is properly set as a boolean
      const allowedAttempts = formState.allowedAttempts === true;

      let allowNumberOfAttempts = null;
      // Set allowNumberOfAttempts only if allowedAttempts is false (meaning attempts are limited)
      if (allowedAttempts && formState.allowNumberOfAttempts) {
        allowNumberOfAttempts = Number(formState.allowNumberOfAttempts);
      }

      // Include the allowedAttempts and allowNumberOfAttempts in the quizData
      quizData.allowedAttempts = allowedAttempts;
      quizData.allowNumberOfAttempts = allowNumberOfAttempts;
      // console.log("Saving quiz with ID:", quizId);
      if (quizId) {
        // console.log("Updating existing quiz...");
        dispatch(updateQuizThunk({ quizId, quizData, navigate }));
      } else {
        // console.log("Creating new quiz...");
        dispatch(createQuizThunk(quizData));
        setActiveTab("questions");
      }
    },
    [dispatch, formState, assignmentName, instruction, cid, sid, quizId]
  );

  const handleInstructionChange = useCallback((content) => {
    setInstruction(content);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <CreateQuizHeader
        activeTab={activeTab}
        onSave={handleSaveQuiz}
        isEditing={!!quizId}
        quizId={quizId}
      />

      <div className="w-full flex">
        <div
          className={`${
            activeTab === "instructions" ? "w-[70%]" : "w-full"
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
                  <ProtectedSection
                    title="Add/Edit Quiz Instructuin"
                    requiredPermission="edit quiz instructuion"
                    aman={true}
                  >
                    <QuizInstructions
                      assignmentName={assignmentName}
                      instruction={instruction}
                      handleNameChange={setAssignmentName}
                      handleInstructionChange={handleInstructionChange}
                    />
                  </ProtectedSection>
                ) : (
                  <ProtectedSection
                    requiredPermission="edit question"
                    aman={true}
                  >
                    <QuestionListView
                      quizId={quizId}
                      allowShuffleAnswers={formState.allowShuffleAnswers}
                      questionState={questions}
                      handleSidebarOpen={handleAddNewQuestion}
                      deleteQuestion={deleteQuestionHandler}
                      editQuestion={editQuestionHandler}
                    />
                  </ProtectedSection>
                )}
              </div>
            )}
          </Tabs>
        </div>

        {activeTab === "instructions" && (
          <div className="w-[30%] h-full ">
            <ProtectedSection requiredPermission="edit quiz" aman={true}>
              <CreateQuizForm {...formState} handleChange={handleFormChange} />
            </ProtectedSection>
          </div>
        )}
      </div>

      {/* Sidebar for Add/Edit Question */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingQuestionId ? "Edit Question" : "Add new Question"}
        width="95%"
      >
        <QuestionForm
          question={question} // Pass question state here
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
