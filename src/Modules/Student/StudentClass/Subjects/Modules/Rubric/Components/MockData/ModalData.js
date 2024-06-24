const mockData = [
    {
      criteria: "Design Component",
      range: true,
      ratings: [
        {
          markType: "Full Mark",
          points: "10 Points",
          description: "Great job Exceeds expectations",
        },
        {
          markType: "Partial Mark",
          points: "05 Points",
          description: "Lorem ipsum dolor sit amet, sart op.",
        },
        {
          markType: "Need Improvement",
          points: "03 Points",
          description: "Lorem ipsum dolor sit amet, sart op.",
        },
      ],
      fullMark: 10,
    },
    {
      criteria: "Implementation",
      range: false,
      ratings: [
        {
          markType: "Full Mark",
          points: "10 Points",
          description: "Excellent implementation with no issues.",
        },
        {
          markType: "Partial Mark",
          points: "05 Points",
          description: "Some minor issues in implementation.",
        },
      ],
      fullMark: 10,
    },
    {
      criteria: "Implementation",
      range: false,
      ratings: [
        {
          markType: "Full Mark",
          points: "10 Points",
          description: "Excellent implementation with no issues.",
        },
        {
          markType: "Partial Mark",
          points: "05 Points",
          description: "Some minor issues in implementation.",
        },
      ],
      fullMark: 10,
    },
    // Add more mock data as needed
  ];
  export const TABLE_HEADERS = [
    { id: 'criteria', title: 'Criteria', width: 'w-2/8' },
    { id: 'ratings', title: 'Ratings', width: 'w-5/8' },
    { id: 'points', title: 'Points', width: 'w-1/8' },
  ];
  
  
  export default mockData;
