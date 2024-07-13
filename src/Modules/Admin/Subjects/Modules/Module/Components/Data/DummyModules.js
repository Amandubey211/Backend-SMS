
const dummyModules = [
  {
    moduleNumber: 1,
    title: "Business Entrepreneurship",
    imageUrl: "https://via.placeholder.com/600x400",
    isCompleted: true,
    chapters: [
      {
        chapterNumber: 1,
        title: "Introduction to Entrepreneurship",
        imageUrl: "https://via.placeholder.com/50",
        items: [
          {
            type: "assignments",
            title: "What is Entrepreneurship?",
            id: "id1",
            isPublished: false,
          },
          {
            type: "quizzes",
            title: "Entrepreneurship Basics",
            id: "id2",
            isPublished: true,
          },
          {
            type: "page",
            title: "Key Concepts in Entrepreneurship",
            id: "id3",
            isPublished: false,
          },
        ],
      },
      {
        chapterNumber: 2,
        title: "Business Planning",
        imageUrl: "https://via.placeholder.com/50",
        items: [
          {
            type: "assignments",
            title: "How to Create a Business Plan",
            id: "id4",
            isPublished: true,
          },
          {
            type: "quizzes",
            title: "Business Plan Components",
            id: "id5",
            isPublished: false,
          },
        ],
      },
    ],
  },
  {
    moduleNumber: 2,
    title: "Business Planning System",
    imageUrl: "https://via.placeholder.com/600x400",
    isCompleted: false,
    chapters: [
      {
        chapterNumber: 1,
        title: "Business Strategies",
        imageUrl: "https://via.placeholder.com/50",
        items: [
          {
            type: "assignments",
            title: "Strategic Planning",
            id: "id6",
            isPublished: true,
          },
          {
            type: "quizzes",
            title: "Strategic Planning Basics",
            id: "id7",
            isPublished: false,
          },
        ],
      },
      {
        chapterNumber: 2,
        title: "Growth Strategies",
        imageUrl: "https://via.placeholder.com/50",
        items: [
          {
            type: "assignments",
            title: "Planning for Growth",
            id: "id8",
            isPublished: true,
          },
          {
            type: "quizzes",
            title: "Growth Strategies",
            id: "id9",
            isPublished: true,
          },
        ],
      },
    ],
  },
  {
    moduleNumber: 3,
    title: "Business Planning to Grow",
    imageUrl: "https://via.placeholder.com/600x400",
    isCompleted: true,
    chapters: [
      {
        chapterNumber: 1,
        title: "Scaling Your Business",
        imageUrl: "https://via.placeholder.com/50",
        items: [
          {
            type: "assignments",
            title: "Scalable Business Models",
            id: "id10",
            isPublished: true,
          },
          {
            type: "quizzes",
            title: "Scaling Strategies",
            id: "id11",
            isPublished: false,
          },
        ],
      },
    ],
  },
];

export default dummyModules;
