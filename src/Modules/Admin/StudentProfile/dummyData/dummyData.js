export const dummyStudentsList = [
    {
      id: "2458",
      name: "Leslie Alexander",
      class: "10",
      section: "2",
      imageUrl: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      attendance: {
        details: [
          { date: "2024-03-01", type: "Attend" },
          { date: "2024-03-02", type: "Absent" },
          { date: "2024-03-03", type: "Leave" },
          { date: "2024-03-04", type: "Attend" },
          { date: "2024-03-05", type: "Attend" },
        ],
        totalPresent: 250,
        totalAbsent: 116,
        totalLeave: 16,
      },
      grades: [
        {
          subject: "Mathematics",
          evaluations: [
            {
              name: "Algebra Quiz",
              type: "Quiz",
              dueDate: "2024-04-10",
              submitDate: "2024-04-09",
              status: "Completed",
              score: "90%",
            },
            {
              name: "Geometry Assignment",
              type: "Assignment",
              dueDate: "2024-05-01",
              submitDate: "2024-04-30",
              status: "Completed",
              score: "85%",
            },
          ],
        },
        {
          subject: "Science",
          evaluations: [
            {
              name: "Biology Test",
              type: "Quiz",
              dueDate: "2024-04-15",
              submitDate: "2024-04-14",
              status: "Completed",
              score: "88%",
            },
          ],
        },
        {
          subject: "History",
          evaluations: [
            {
              name: "WWII Essay",
              type: "Assignment",
              dueDate: "2024-05-20",
              submitDate: "2024-05-19",
              status: "Completed",
              score: "92%",
            },
          ],
        },
      ],
      finance: {
        totalUnpaidFees: 2500,
        parentsAccountTotalPaid: 3500,
        totalPaidFees: 5500,
        feesDetails: [
          {
            feeType: "Final Exam Fees",
            paidBy: "Parents",
            dueDate: "2024-10-21",
            amount: 200,
            status: "Unpaid",
          },
          {
            feeType: "Final Exam Fees",
            paidBy: "Student",
            dueDate: "2024-08-15",
            amount: 800,
            status: "Unpaid",
          },
          {
            feeType: "Final Exam Fees",
            paidBy: "Parents",
            dueDate: "2024-08-15",
            amount: 100,
            status: "Paid",
          },
        ],
      },
      bookIssues: [
        {
          bookTitle: "Sport Btec",
          author: "Jane Cooper",
          category: "Thriller",
          issueDate: "2024-10-02",
          returnDate: "2024-10-06",
          status: "Pending",
        },
        {
          bookTitle: "English 1st paper",
          author: "Eleanor Pena",
          category: "Fantasy",
          issueDate: "2024-10-02",
          returnDate: "2024-10-06",
          status: "Return",
        },
      ],
      information: {
        address: "Noakhali Chattogram Bangladesh",
        email: "leslie.alexander@example.com",
        phone: "(704) 555-0127",
        gender: "Male",
        religion: "Islam",
        parents: {
          fatherName: "Leslie Alexander",
          motherName: "Brooklyn Simmons",
          phone: "(704) 555-0127",
          email: "georgia.young@example.com",
          address: "Noakhali Chaprashirhat Road No. 13/x, House no. 1320/C, Flat No. 5D",
        },
        educationHistory: [
          {
            year: "2008 - 2009",
            description: "Secondary Schooling at xyz school of secondary education, Mumbai.",
          },
          {
            year: "2011 - 2012",
            description: "Higher Secondary Schooling at xyz school of higher secondary education, Mumbai.",
          },
          {
            year: "2012 - 2015",
            description: "Bachelor of Science at Abc College of Art and Science, Chennai.",
          },
          {
            year: "2015 - 2017",
            description: "Master of Science at Cdm College of Engineering and Technology, Pune.",
          },
        ],
      },
    },
    {
      id: "2459",
      name: "John Doe",
      class: "9",
      section: "1",
      imageUrl: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      attendance: {
        details: [
          { date: "2024-03-01", type: "Attend" },
          { date: "2024-03-02", type: "Attend" },
          { date: "2024-03-03", type: "Absent" },
          { date: "2024-03-04", type: "Leave" },
          { date: "2024-03-05", type: "Attend" },
        ],
        totalPresent: 200,
        totalAbsent: 100,
        totalLeave: 20,
      },
      grades: [
        {
          subject: "Mathematics",
          evaluations: [
            {
              name: "Algebra Test",
              type: "Quiz",
              dueDate: "2024-04-10",
              submitDate: "2024-04-09",
              status: "Completed",
              score: "80%",
            },
          ],
        },
        {
          subject: "Science",
          evaluations: [
            {
              name: "Chemistry Assignment",
              type: "Assignment",
              dueDate: "2024-05-01",
              submitDate: "2024-04-30",
              status: "Completed",
              score: "75%",
            },
          ],
        },
      ],
      finance: {
        totalUnpaidFees: 2000,
        parentsAccountTotalPaid: 3000,
        totalPaidFees: 5000,
        feesDetails: [
          {
            feeType: "Midterm Fees",
            paidBy: "Parents",
            dueDate: "2024-09-21",
            amount: 300,
            status: "Unpaid",
          },
          {
            feeType: "Library Fees",
            paidBy: "Student",
            dueDate: "2024-08-15",
            amount: 200,
            status: "Paid",
          },
        ],
      },
      bookIssues: [
        {
          bookTitle: "Mathematics for Class 9",
          author: "James Smith",
          category: "Educational",
          issueDate: "2024-09-02",
          returnDate: "2024-09-06",
          status: "Pending",
        },
        {
          bookTitle: "Physics for Class 9",
          author: "Narendra Modi",
          category: "Educational",
          issueDate: "2024-09-02",
          returnDate: "2024-09-06",
          status: "Return",
        },
      ],
      information: {
        address: "Dhaka, Bangladesh",
        email: "john.doe@example.com",
        phone: "(704) 555-0128",
        gender: "Male",
        religion: "Christianity",
        parents: {
          fatherName: "David Doe",
          motherName: "Emily Doe",
          phone: "(704) 555-0128",
          email: "david.doe@example.com",
          address: "Dhaka, Road No. 5, House No. 10",
        },
        educationHistory: [
          {
            year: "2010 - 2011",
            description: "Secondary Schooling at ABC school of secondary education, Dhaka.",
          },
          {
            year: "2013 - 2014",
            description: "Higher Secondary Schooling at XYZ school of higher secondary education, Dhaka.",
          },
        ],
      },
    },
    {
      id: "2460",
      name: "Jane Smith",
      class: "8",
      section: "3",
      imageUrl: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      attendance: {
        details: [
          { date: "2024-03-01", type: "Attend" },
          { date: "2024-03-02", type: "Leave" },
          { date: "2024-03-03", type: "Attend" },
          { date: "2024-03-04", type: "Absent" },
          { date: "2024-03-05", type: "Attend" },
        ],
        totalPresent: 220,
        totalAbsent: 90,
        totalLeave: 30,
      },
      grades: [
        {
          subject: "English",
          evaluations: [
            {
              name: "Literature Quiz",
              type: "Quiz",
              dueDate: "2024-04-10",
              submitDate: "2024-04-09",
              status: "Completed",
              score: "85%",
            },
          ],
        },
        {
          subject: "Science",
          evaluations: [
            {
              name: "Physics Test",
              type: "Quiz",
              dueDate: "2024-05-01",
              submitDate: "2024-04-30",
              status: "Completed",
              score: "80%",
            },
          ],
        },
      ],
      finance: {
        totalUnpaidFees: 1500,
        parentsAccountTotalPaid: 2000,
        totalPaidFees: 3500,
        feesDetails: [
          {
            feeType: "Tuition Fees",
            paidBy: "Parents",
            dueDate: "2024-10-21",
            amount: 400,
            status: "Unpaid",
          },
          {
            feeType: "Lab Fees",
            paidBy: "Student",
            dueDate: "2024-08-15",
            amount: 300,
            status: "Paid",
          },
        ],
      },
      bookIssues: [
        {
          bookTitle: "Science Experiments",
          author: "William Johnson",
          category: "Educational",
          issueDate: "2024-08-02",
          returnDate: "2024-08-06",
          status: "Return",
        },
      ],
      information: {
        address: "Sylhet, Bangladesh",
        email: "jane.smith@example.com",
        phone: "(704) 555-0129",
        gender: "Female",
        religion: "Hinduism",
        parents: {
          fatherName: "Michael Smith",
          motherName: "Sophia Smith",
          phone: "(704) 555-0129",
          email: "michael.smith@example.com",
          address: "Sylhet, Road No. 7, House No. 15",
        },
        educationHistory: [
          {
            year: "2011 - 2012",
            description: "Primary Schooling at ABC school of primary education, Sylhet.",
          },
          {
            year: "2014 - 2015",
            description: "Middle Schooling at XYZ school of middle education, Sylhet.",
          },
        ],
      },
    },
    {
      id: "2461",
      name: "David Lee",
      class: "11",
      section: "A",
      imageUrl: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      attendance: {
        details: [
          { date: "2024-03-01", type: "Attend" },
          { date: "2024-03-02", type: "Absent" },
          { date: "2024-03-03", type: "Attend" },
          { date: "2024-03-04", type: "Leave" },
          { date: "2024-03-05", type: "Attend" },
        ],
        totalPresent: 240,
        totalAbsent: 80,
        totalLeave: 20,
      },
      grades: [
        {
          subject: "Mathematics",
          evaluations: [
            {
              name: "Trigonometry Quiz",
              type: "Quiz",
              dueDate: "2024-04-12",
              submitDate: "2024-04-11",
              status: "Completed",
              score: "88%",
            },
          ],
        },
        {
          subject: "Physics",
          evaluations: [
            {
              name: "Mechanics Assignment",
              type: "Assignment",
              dueDate: "2024-05-05",
              submitDate: "2024-05-04",
              status: "Completed",
              score: "92%",
            },
          ],
        },
      ],
      finance: {
        totalUnpaidFees: 2200,
        parentsAccountTotalPaid: 2800,
        totalPaidFees: 5000,
        feesDetails: [
          {
            feeType: "Term Fees",
            paidBy: "Parents",
            dueDate: "2024-09-10",
            amount: 500,
            status: "Unpaid",
          },
          {
            feeType: "Exam Fees",
            paidBy: "Student",
            dueDate: "2024-07-20",
            amount: 300,
            status: "Paid",
          },
        ],
      },
      bookIssues: [
        {
          bookTitle: "Advanced Physics",
          author: "Isaac Newton",
          category: "Educational",
          issueDate: "2024-07-01",
          returnDate: "2024-07-15",
          status: "Pending",
        },
      ],
      information: {
        address: "Chattogram, Bangladesh",
        email: "david.lee@example.com",
        phone: "(704) 555-0130",
        gender: "Male",
        religion: "Buddhism",
        parents: {
          fatherName: "Peter Lee",
          motherName: "Anna Lee",
          phone: "(704) 555-0130",
          email: "peter.lee@example.com",
          address: "Chattogram, Road No. 3, House No. 20",
        },
        educationHistory: [
          {
            year: "2009 - 2010",
            description: "Secondary Schooling at XYZ school of secondary education, Chattogram.",
          },
          {
            year: "2012 - 2013",
            description: "Higher Secondary Schooling at ABC school of higher secondary education, Chattogram.",
          },
          {
            year: "2013 - 2016",
            description: "Bachelor of Arts at DEF College of Arts, Chattogram.",
          },
        ],
      },
    },
  ];
  