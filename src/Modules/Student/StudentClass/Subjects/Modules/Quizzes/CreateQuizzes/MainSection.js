import React, { useState, Suspense } from "react";
import CreateQuizHeader from "./Components/CreateQuizHeader";
import Tabs from "../Components/Tabs";
import Editor from "../../../Component/Editor";
import CreateQuizForm from "./Components/CreateQuizForm";
import toast from "react-hot-toast";
import CreateQuestionForm from "./Components/CreateQuestionForm";
import AnswerSection from "./Components/AnswerSection";
import QuestionList from "./Components/QuestionList";
import AddQuestionButton from "./Components/AddQuestionButton";
import Spinner from "../../../../../../../Components/Common/Spinner";

const MainSection = () => {
  const [activeTab, setActiveTab] = useState("instructions");
  const [assignmentName, setAssignmentName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const [formState, setFormState] = useState({
    points: "",
    displayGrade: "",
    submissionType: "",
    submissionFormat: "",
    allowedAttempts: 1,
    allowMultiple: false,
    numberOfAttempts: "",
    assignTo: "",
    accessCode: "",
    ipAddresses: "",
    showOneQuestionAtATime: "",
    questionType: "",
    section: "",
    dueDate: "",
    availableFrom: "",
    lockQuestionsAfterAnswering: "",
    until: "",
    timeLimit: "",
  });
  const [questionState, setQuestionState] = useState([]);
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [rightAnswerComment, setRightAnswerComment] = useState("");
  const [wrongAnswerComment, setWrongAnswerComment] = useState("");

  const handleNameChange = (name) => {
    setAssignmentName(name);
  };

  const handleInstructionChange = (content) => {
    setInstruction(content);
  };

  const handleQuestionChange = (content) => {
    setQuestion(content);
  };

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

  const addNewQuestion = () => {
    const newQuestion = {
      question: question,
      options: answers,
      rightAnswerComment,
      wrongAnswerComment,
    };
    setQuestionState((prev) => [...prev, newQuestion]);
    setQuestion("");
    setAnswers([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setRightAnswerComment("");
    setWrongAnswerComment("");
    toast.success("Question Added");
  };

  const deleteQuestion = (index) => {
    const newQuestionState = questionState.filter((_, i) => i !== index);
    setQuestionState(newQuestionState);
    toast.success("Question Deleted");
  };

  const handleSave = () => {
    console.log(formState, assignmentName, instruction, questionState);
    toast.success("Form Submitted");
  };

  return (
    <div className="flex flex-col w-full">
      <CreateQuizHeader onSave={handleSave} onTabChange={setActiveTab} />

      <div className="w-full flex">
        <div className="w-[70%] border-x">
          <Tabs
            createPage={true}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onTabChange={setActiveTab}
          >
            {(activeTab) => (
              <div className="h-full">
                {activeTab === "instructions" ? (
                  <Suspense fallback={<div><Spinner/> </div>}>
                    <Editor
                      assignmentLabel="Quiz Instructions"
                      assignmentName={assignmentName}
                      editorContent={instruction}
                      onNameChange={handleNameChange}
                      onEditorChange={handleInstructionChange}
                    />
                  </Suspense>
                ) : (
                  <Suspense fallback={<div><Spinner/> </div>}>
                    <div>
                      <h2 className="text-gradient text-2xl font-semibold mb-4">
                        Questions:
                      </h2>
                      <Editor 
                        hideInput={true}
                        editorContent={question}
                        onEditorChange={handleQuestionChange}
                      />
                      <AnswerSection 
                        answers={answers}
                        setAnswers={setAnswers}
                        handleAnswerChange={handleAnswerChange}
                        rightAnswerComment={rightAnswerComment}
                        setRightAnswerComment={setRightAnswerComment}
                        wrongAnswerComment={wrongAnswerComment}
                        setWrongAnswerComment={setWrongAnswerComment}
                      />
                      <AddQuestionButton addNewQuestion={addNewQuestion} />
                      <QuestionList questions={questionState} deleteQuestion={deleteQuestion} />
                    </div>
                  </Suspense>
                )}
              </div>
            )}
          </Tabs>
        </div>

        <div className="w-[30%] h-full ">
          {activeTab === "instructions" ? (
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
          ) : (
            <CreateQuestionForm
              points={formState.points}
              questionType={formState.questionType}
              handleChange={handleFormChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
