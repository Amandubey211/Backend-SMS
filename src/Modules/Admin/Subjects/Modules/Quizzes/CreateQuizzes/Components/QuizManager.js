import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreateQuiz from '../../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/createQuiz';
import useUpdateQuiz from '../../../../../../../Hooks/AuthHooks/Staff/Admin/Quiz/useUpdateQuiz';

const QuizManager = ({ formState, setFormState, setActiveTab, setQuizId, quizId }) => {
  const navigate = useNavigate();
  const { createQuiz, loading: createLoading } = useCreateQuiz();
  const { updateQuiz, loading: updateLoading } = useUpdateQuiz();

  const [assignmentName, setAssignmentName] = useState(formState.name || '');
  const [instruction, setInstruction] = useState(formState.instruction || '');

  const handleSave = async () => {
    const quizData = {
      ...formState,
      name: assignmentName,
      instruction,
    };

    if (quizId) {
      const result = await updateQuiz(quizId, quizData);
      if (result.success) {
        setActiveTab('questions');
        toast.success('Quiz updated successfully');
      } else {
        toast.error('Failed to update quiz');
      }
    } else {
      const result = await createQuiz(quizData);
      if (result.success) {
        setQuizId(result.quiz._id);
        setActiveTab('questions');
        toast.success('Quiz created successfully');
      } else {
        toast.error('Failed to create quiz');
      }
    }
  };

  return {
    assignmentName,
    setAssignmentName,
    instruction,
    setInstruction,
    handleSave,
    isEditing: !!quizId,
  };
};

export default QuizManager;
