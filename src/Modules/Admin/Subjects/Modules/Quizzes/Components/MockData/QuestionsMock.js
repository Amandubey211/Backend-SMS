const mockData = [
  {
    question: "What Kind Of Service You Age Quiz?",
    points: 2,
    options: [
      {
        id: 1,
        label: "Well organized and Easy",
        value: "well_organized",
        isCorrect: false,
      },
      {
        id: 2,
        label: "Transitions are Shown",
        value: "transitions_shown",
        isCorrect: true,
      },
      {
        id: 3,
        label: "Transitions are Shown",
        value: "transitions_shown_2",
        isCorrect: false,
      },
      {
        id: 4,
        label: "Transition Between Two",
        value: "transition_between_two",
        isCorrect: false,
      },
    ],
  },
  {
    question: "Which of the following is a JavaScript framework?",
    points: 2,
    options: [
      { id: 1, label: "React", value: "react", isCorrect: true },
      { id: 2, label: "Laravel", value: "laravel", isCorrect: false },
      { id: 3, label: "Django", value: "django", isCorrect: false },
      { id: 4, label: "Spring", value: "spring", isCorrect: false },
    ],
  },
  {
    question: "What is the capital of France?",
    points: 1,
    options: [
      { id: 1, label: "Berlin", value: "berlin", isCorrect: false },
      { id: 2, label: "Madrid", value: "madrid", isCorrect: false },
      { id: 3, label: "Paris", value: "paris", isCorrect: true },
      { id: 4, label: "Lisbon", value: "lisbon", isCorrect: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    points: 1,
    options: [
      { id: 1, label: "Earth", value: "earth", isCorrect: false },
      { id: 2, label: "Mars", value: "mars", isCorrect: true },
      { id: 3, label: "Jupiter", value: "jupiter", isCorrect: false },
      { id: 4, label: "Saturn", value: "saturn", isCorrect: false },
    ],
  },
];

export default mockData;
