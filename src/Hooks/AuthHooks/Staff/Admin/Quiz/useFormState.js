import { useState } from "react";

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

const useFormState = () => {
  const [formState, setFormState] = useState(initialFormState);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return { formState, handleFormChange, setFormState };
};

export default useFormState;
