// MainSection.jsx
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
import { PERMISSIONS } from "../../../../../../config/permission";
import toast from "react-hot-toast";

/**
 * Validation function for the quiz form.
 */
function validateQuizForm(quizData, isPublishing) {
  const errors = {};
  if (!quizData.name || !quizData.name.trim()) {
    errors.name = "Quiz name is required.";
  }
  if (!quizData.content || !quizData.content.trim()) {
    errors.content = "Quiz instructions are required.";
  }
  if (isPublishing) {
    if (!quizData.quizType) {
      errors.quizType = "Quiz Type is required when publishing.";
    }
    if (
      quizData.allowedAttempts === null ||
      quizData.allowedAttempts === undefined
    ) {
      errors.allowedAttempts = "Allowed Attempts is required when publishing.";
    } else if (
      quizData.allowedAttempts === true &&
      !quizData.allowNumberOfAttempts
    ) {
      errors.allowNumberOfAttempts =
        "Number of Attempts is required when attempts are limited.";
    }
    if (!quizData.assignTo) {
      errors.assignTo = "You must specify who to assign the quiz to.";
    } else {
      if (
        quizData.assignTo === "Section" &&
        (!quizData.sectionId || !quizData.sectionId.length)
      ) {
        errors.sectionId = "Please select at least one Section.";
      }
      if (
        quizData.assignTo === "Group" &&
        (!quizData.groupId || !quizData.groupId.length)
      ) {
        errors.groupId = "Please select at least one Group.";
      }
    }
    if (!quizData.availableFrom) {
      errors.availableFrom = "Available From date is required when publishing.";
    }
    if (!quizData.dueDate) {
      errors.dueDate = "Due Date is required when publishing.";
    }
    // Optionally add validation for results fields if needed:
    // For example, if not publishing immediately, ensure a valid date.
  }
  return errors;
}

function scrollToFirstError(errors) {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return;
  const el = document.getElementById(firstErrorKey);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.focus({ preventScroll: true }), 400);
  }
}

// Use singular key names for multi-select arrays; also add new results fields
const initialFormState = {
  points: "",
  quizType: "Practice",
  submissionFormat: "",
  allowedAttempts: true,
  allowNumberOfAttempts: 1,
  assignTo: "Everyone",
  showOneQuestionOnly: false,
  questionType: "",
  sectionId: [],
  allowShuffleAnswers: false,
  dueDate: "",
  availableFrom: "",
  lockQuestionAfterAnswering: false,
  until: "",
  timeLimit: "",
  moduleId: null,
  chapterId: null,
  groupId: [],
  studentSeeAnswer: false,
  showAnswerDate: "",
  // New fields:
  resultsPublished: false,
  resultsPublishDate: "",
};

const MainSection = ({ setIsEditing, isEditing }) => {
  const { cid, sid } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quizzDetail: quiz } = useSelector((state) => state.admin.quizzes);
  const quizIdFromRedux = useSelector(
    (state) => state.admin.quizzes.quizzDetail?._id || ""
  );

  const [activeTab, setActiveTab] = useState("instructions");
  const [assignmentName, setAssignmentName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");
  const [questionPoint, setQuestionPoint] = useState(1);
  const [questionType, setQuestionType] = useState("multiple choice");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const quizIdFromState = location.state?.quizId;
    if (quizIdFromState) {
      setQuizId(quizIdFromState || quizIdFromRedux);
      setIsEditing(true);
      dispatch(fetchQuizByIdThunk(quizIdFromState));
    } else {
      setIsEditing(false);
      setQuizId("");
      setFormState(initialFormState);
      setAssignmentName("");
      setInstruction("");
      setQuestions([]);
      setAnswers([]);
      setRightAnswerComment("");
      setWrongAnswerComment("");
    }
  }, [location.state, dispatch, quizIdFromRedux, setIsEditing]);

  useEffect(() => {
    if (isEditing && quiz) {
      setAssignmentName(quiz.name || "");
      setInstruction(quiz.content || "");
      setQuizId(quiz._id || "");
      setFormState((prev) => ({
        ...prev,
        points: quiz.points || prev.points,
        quizType: quiz.quizType || prev.quizType,
        submissionFormat: quiz.submissionFormat || prev.submissionFormat,
        allowedAttempts: quiz.allowedAttempts,
        allowNumberOfAttempts: quiz.allowNumberOfAttempts,
        assignTo: quiz.assignTo || prev.assignTo,
        showOneQuestionOnly:
          quiz.showOneQuestionOnly || prev.showOneQuestionOnly,
        questionType: quiz.questionType || prev.questionType,
        sectionId: Array.isArray(quiz.sectionId) ? quiz.sectionId : [],
        groupId: Array.isArray(quiz.groupId) ? quiz.groupId : [],
        allowShuffleAnswers:
          quiz.allowShuffleAnswers ?? prev.allowShuffleAnswers,
        studentSeeAnswer: quiz.studentSeeAnswer ?? prev.studentSeeAnswer,
        showAnswerDate: quiz.showAnswerDate || prev.showAnswerDate,
        dueDate: quiz.dueDate || prev.dueDate,
        availableFrom: quiz.availableFrom || prev.availableFrom,
        lockQuestionAfterAnswering:
          quiz.lockQuestionAfterAnswering ?? prev.lockQuestionAfterAnswering,
        until: quiz.until || prev.until,
        timeLimit: quiz.timeLimit || prev.timeLimit,
        moduleId: quiz.moduleId || prev.moduleId,
        chapterId: quiz.chapterId || prev.chapterId,
        // New fields
        resultsPublished: quiz.resultsPublished || false,
        resultsPublishDate: quiz.resultsPublishDate || "",
      }));
      setQuestions(quiz.questions || []);
      // Optionally load answers from quiz if applicable
      setRightAnswerComment(quiz.correctAnswerComment || "");
      setWrongAnswerComment(quiz.inCorrectAnswerComment || "");
    }
  }, [isEditing, quiz]);

  useEffect(() => {
    if (quizIdFromRedux) {
      setQuizId(quizIdFromRedux);
      setIsEditing(true);
    }
  }, [quizIdFromRedux, setIsEditing]);

  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    if (name === "allowedAttempts" && !checked) {
      setFormState((prev) => ({
        ...prev,
        allowedAttempts: false,
        allowNumberOfAttempts: null,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: finalValue,
      }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleInstructionChange = useCallback((newContent) => {
    setInstruction(newContent);
    setFormErrors((prev) => ({ ...prev, content: undefined }));
  }, []);

  const handleNameChange = useCallback((newName) => {
    setAssignmentName(newName);
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  }, []);

  // QUESTION handlers (unchanged)...
  const handleQuestionChange = useCallback(
    (content) => setQuestion(content),
    []
  );
  const handleAnswerChange = useCallback(
    (index, e) => {
      const { name, value } = e.target;
      const updated = [...answers];
      updated[index][name] = value;
      setAnswers(updated);
    },
    [answers]
  );
  const handleAddNewQuestion = () => {
    setQuestion("");
    setAnswers([]);
    setRightAnswerComment("");
    setWrongAnswerComment("");
    setQuestionPoint(1);
    setQuestionType("multiple choice");
    setSidebarOpen(true);
    setEditingQuestionId(null);
  };

  const addNewQuestion = useCallback(async () => {
    const correctOption = answers.find((a) => a.isCorrect);
    const newQ = {
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
        addQuestionThunk({ quizId, question: newQ })
      );
      if (addQuestionThunk.fulfilled.match(result)) {
        setSidebarOpen(false);
      } else {
        console.error("Failed to add question:", result.payload);
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  }, [
    answers,
    dispatch,
    quizId,
    question,
    questionPoint,
    questionType,
    rightAnswerComment,
    wrongAnswerComment,
  ]);

  const updateQuestion = useCallback(async () => {
    const correctOption = answers.find((a) => a.isCorrect);
    const updatedQ = {
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
          question: updatedQ,
        })
      );
      if (updateQuestionThunk.fulfilled.match(result)) {
        setSidebarOpen(false);
      } else {
        console.error("Failed to update question:", result.payload);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  }, [
    answers,
    dispatch,
    quizId,
    question,
    questionPoint,
    questionType,
    rightAnswerComment,
    wrongAnswerComment,
    editingQuestionId,
  ]);

  const deleteQuestionHandler = useCallback(
    async (questionId) => {
      await dispatch(deleteQuestionThunk({ quizId, questionId }));
    },
    [dispatch, quizId]
  );

  const editQuestionHandler = useCallback(
    (questionId) => {
      const questionToEdit = questions.find((q) => q._id === questionId);
      if (questionToEdit) {
        setQuestion(questionToEdit.questionText);
        setAnswers(questionToEdit.options);
        setRightAnswerComment(questionToEdit.correctAnswerComment);
        setWrongAnswerComment(questionToEdit.inCorrectAnswerComment);
        setQuestionPoint(questionToEdit.questionPoint);
        setQuestionType(questionToEdit.type);
        setEditingQuestionId(questionToEdit._id);
        setSidebarOpen(true);
      }
    },
    [questions]
  );

  const handleSaveQuiz = useCallback(
    (publish) => {
      const quizData = {
        ...formState,
        name: assignmentName,
        content: instruction,
        correctAnswerComment: rightAnswerComment,
        inCorrectAnswerComment: wrongAnswerComment,
        classId: cid,
        subjectId: sid,
        publish,
        // New results fields included
        resultsPublished: formState.resultsPublished,
        resultsPublishDate: formState.resultsPublishDate,
      };

      // Use singular keys in payload for multi-select assignments
      if (formState.assignTo === "Section") {
        quizData.sectionId = formState.sectionId;
      } else if (formState.assignTo === "Group") {
        quizData.groupId = formState.groupId;
      }

      const allowedAttempts = formState.allowedAttempts === true;
      let allowNumberOfAttempts = null;
      if (allowedAttempts && formState.allowNumberOfAttempts) {
        allowNumberOfAttempts = Number(formState.allowNumberOfAttempts);
      }
      quizData.allowedAttempts = allowedAttempts;
      quizData.allowNumberOfAttempts = allowNumberOfAttempts;

      const errors = validateQuizForm(quizData, publish === true);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error("Please fix the highlighted fields.");
        scrollToFirstError(errors);
        return;
      }

      if (quizId) {
        dispatch(updateQuizThunk({ quizId, quizData, navigate }));
      } else {
        dispatch(createQuizThunk(quizData));
        setActiveTab("questions");
      }
    },
    [
      assignmentName,
      cid,
      sid,
      dispatch,
      formState,
      instruction,
      navigate,
      quizId,
      rightAnswerComment,
      wrongAnswerComment,
    ]
  );

  return (
    <div className="flex flex-col w-full">
      <CreateQuizHeader
        activeTab={activeTab}
        onSave={handleSaveQuiz}
        isEditing={!!quizId}
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
            {(currentTab) => (
              <div className="h-full">
                {currentTab === "instructions" ? (
                  <ProtectedSection
                    title="Add/Edit Quiz Instruction"
                    requiredPermission={PERMISSIONS.UPDATE_QUIZ}
                  >
                    <QuizInstructions
                      assignmentName={assignmentName}
                      instruction={instruction}
                      handleNameChange={handleNameChange}
                      handleInstructionChange={handleInstructionChange}
                      nameError={formErrors.name}
                      contentError={formErrors.content}
                    />
                  </ProtectedSection>
                ) : (
                  <ProtectedSection
                    requiredPermission={PERMISSIONS.ADD_QUESTION_TO_QUIZ}
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
          <div className="w-[30%] h-full">
            <ProtectedSection requiredPermission={PERMISSIONS.UPDATE_QUIZ}>
              <CreateQuizForm
                {...formState}
                handleChange={handleFormChange}
                formErrors={formErrors}
              />
            </ProtectedSection>
          </div>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={editingQuestionId ? "Edit Question" : "Add new Question"}
        width="95%"
      >
        <ProtectedSection
          title="Add/Edit Question"
          requiredPermission={
            PERMISSIONS.UPDATE_QUESTION_IN_QUIZ ||
            PERMISSIONS.ADD_QUESTION_TO_QUIZ
          }
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
        </ProtectedSection>
      </Sidebar>
    </div>
  );
};

export default MainSection;
