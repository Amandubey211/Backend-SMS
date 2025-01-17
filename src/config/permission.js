// config/permissions.js

//
// 1) Define roles
//
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  ACCOUNTANT: "accountant",
  LIBRARIAN: "librarian",
  STAFF: "staff",
  STUDENT: "student",
  PARENT: "parent",
  // Add more roles here if needed...
};

//
// 2) Define permissions
//
export const PERMISSIONS = {
  // ──────────────────────────────────────────────────────────────
  //  FINANCE DEPARTMENT
  // ──────────────────────────────────────────────────────────────

  // Dashboard
  FINANCE_GET_DASHBOARD_DATA: "get dashboard data",
  FINANCE_VIEW_NOTICE: "view notice",
  FINANCE_VIEW_EVENTS: "view events",

  // Managing Notices
  FINANCE_ADD_NEW_NOTICE: "Add New Notice",
  FINANCE_UPDATE_NOTICE: "Update Notice",
  FINANCE_SHOW_NOTICES: "Show Notices",
  FINANCE_REMOVE_NOTICE: "Remove Notice",

  // Managing Events
  FINANCE_ADD_NEW_EVENT: "Add New Event",
  FINANCE_UPDATE_EVENT: "Update Event",
  FINANCE_SHOW_EVENTS: "Show Events",
  FINANCE_REMOVE_EVENT: "Remove Event",

  // TimeTable
  FINANCE_TIMETABLE_VIEW: "Timetable View",

  // userStudentView (Get List of Students)
  FINANCE_GET_ALL_CLASSES: "Get All Classes",
  FINANCE_SHOW_ALL_STUDENTS: "Show All Students",

  // userStudentView (Shows Profile of Student)
  FINANCE_SHOWS_STUDENT_INFO: "Shows Student Info",

  // UserParentView (Get List of Parents)
  FINANCE_VIEW_PARENT: "View Parent",
  FINANCE_VIEW_STUDENT: "View Student",

  // UserParentView (Student Profile View in Parent list)
  FINANCE_SHOWS_PARENT_STUDENT_INFO: "Shows Student Info",

  // UserTeacherView
  FINANCE_VIEW_TEACHER: "view Teacher",

  // UserStaffView
  FINANCE_VIEW_STAFF: "view Staff",

  // Earnings
  FINANCE_VIEW_ALL_INCOMES: "View All Incomes",
  FINANCE_VIEW_REVENUE_GRAPH: "View Revenue Graph",
  FINANCE_SHOWS_REVENUE_CARD_DATA_IN_DASHBOARD:
    "Shows revenue card data in dashboard",
  FINANCE_ADD_NEW_COMMUNITY_EXTERNAL_AFFAIRS_REVENUE:
    "Add new Community External Affairs Revenue",
  FINANCE_ADD_NEW_FACALITY_BASED_REVENUE: "Add new Facality Based Revenue",
  FINANCE_ADD_NEW_FINANCIAL_INVESTMENT_REVENUE:
    "Add new financial Investment Revenue",
  FINANCE_ADD_NEW_SERVICE_BASED_REVENUE: "Add new Service Based Revenue",

  // Earnings List
  FINANCE_MODIFY_COMMUNITY_EXTERNAL_AFFAIRS_REVENUE:
    "Modify community External Affairs Revenue",
  FINANCE_MODIFY_FACALITY_BASED_REVENUE: "Modify Facality Based Revenue",
  FINANCE_DELETE_FACILITY_BASED_REVENUE: "Delete Facility Based Revenue",
  FINANCE_MODIFY_FINANCIAL_INVESTMENT_REVENUE:
    "Modify financial Investment Revenue",
  FINANCE_MODIFY_SERVICE_BASED_REVENUE: "Modify Service Based Revenue",
  FINANCE_LIST_ALL_REVENUE: "List all Revenue",
  FINANCE_CREATE_NEW_INVOICE: "Create new Invoice",

  // Student Fees
  FINANCE_SHOWS_INFO_FOR_STUDENT_FEES: "Shows Info for student Fees ",
  FINANCE_SHOWS_GRAPH_FOR_STUDENT_FEES: "Shows Graph for student Fees ",
  FINANCE_SUMMARY_OF_STUDENT_FEES: "Summary of student Fees",
  FINANCE_ADD_NEW_FEES: "Add new Fees",

  // Student Fees List
  FINANCE_SUMMARY_OF_STUDENT_FEES2: "Summary of student Fees",
  FINANCE_ADD_NEW_FEES2: "Add new Fees",
  FINANCE_EDIT_STUDENT_FEE: "Edit Student Fee",
  FINANCE_DELETE_STUDENT_FEE: "Delete Student Fee",

  // Expense
  FINANCE_VIEW_EXPENSE_GRAPH: "View Expense graph",
  FINANCE_VIEW_EXPENSE_CARD_DATA: "View Expense Card Data",
  FINANCE_VIEW_SUMMARY_OF_EXPENSES: "View Summary of Expenses",
  FINANCE_ADD_NEW_EVENT_ACTIVITY_EXPENSE: "Add new event,activity expense",
  FINANCE_ADD_NEW_EXAM_AFFILIATION_EXPENSE: "Add new exam,affiliation expense",
  FINANCE_ADD_NEW_LIBRARY_ACADEMIC_EXPENSE: "Add new library,Academic expense",
  FINANCE_ADD_NEW_MARKETING_AD_EXPENSE: "Add new marketing, Ad. expense",
  FINANCE_ADD_NEW_MISCELLANEOUS_EXPENSE: "Add new miscellaneous expense",
  FINANCE_ADD_NEW_SALARY_WAGES_EXPENSE: "Add new salary,Wages expense",
  FINANCE_ADD_NEW_SOFTWARE_EXPENSE: "Add new software expense",
  FINANCE_ADD_NEW_SUPPLIES_EXPENSE: "Add new supplies expense",
  FINANCE_ADD_NEW_UTILITY_MAINTENANCE_EXPENSE:
    "Add new utility,Maintenance expense",

  // Expense List
  FINANCE_VIEW_ALL_EXPENSES: "View All Expenses",
  FINANCE_EDIT_EVENT_ACTIVITY_EXPENSE: "Edit event,activity expense",
  FINANCE_REMOVE_EVENT_ACTIVITY_EXPENSE: "Remove event,activity expense",
  FINANCE_ADD_NEW_EXAM_AFFILIATION_EXPENSE2: "Add new exam,affiliation expense", // as shown in the JSON
  FINANCE_REMOVE_EXAM_AFFILIATION_EXPENSE: "Remove exam,affiliation expense",
  FINANCE_EDIT_LIBRARY_ACADEMIC_EXPENSE: "Edit library,Academic expense",
  FINANCE_REMOVE_LIBRARY_ACADEMIC_EXPENSE: "Remove library,Academic expense",
  FINANCE_EDIT_MARKETING_AD_EXPENSE: "Edit marketing, Ad. expense",
  FINANCE_REMOVE_MARKETING_AD_EXPENSE: "Remove marketing, Ad. expense",
  FINANCE_EDIT_MISCELLANEOUS_EXPENSE: "Edit miscellaneous expense",
  FINANCE_REMOVE_MISCELLANEOUS_EXPENSE: "Remove miscellaneous expense",
  FINANCE_EDIT_SALARY_WAGES_EXPENSE: "Edit salary,Wages expense",
  FINANCE_REMOVE_SALARY_WAGES_EXPENSE: "Remove salary,Wages expense",
  FINANCE_EDIT_SOFTWARE_EXPENSE: "Edit software expense",
  FINANCE_REMOVE_SOFTWARE_EXPENSE: "Remove software expense",
  FINANCE_EDIT_SUPPLIES_EXPENSE: "Edit supplies expense",
  FINANCE_REMOVE_SUPPLIES_EXPENSE: "Remove supplies expense",
  FINANCE_EDIT_UTILITY_MAINTENANCE_EXPENSE: "Edit utility,Maintenance expense",
  FINANCE_REMOVE_UTILITY_MAINTENANCE_EXPENSE:
    "Remove utility,Maintenance expense",

  // Invoice
  FINANCE_SHOWS_RECENT_AND_RETURN_INVOICE: "Shows recent and return invoice",
  FINANCE_SHOWS_CARD_DATA_OF_INVOICE: "Shows card data of invoice",
  FINANCE_CREATE_NEW_INVOICE2: "Create new Invoice",
  FINANCE_ADD_NEW_ADJUSTMENT: "Add new adjustment",
  FINANCE_CANCEL_ADJUSTMENT: "Cancel adjustment",
  FINANCE_GET_ALL_PENALTY_AND_ADJUSTMENT: "Get all penalty and adjustment",

  // Invoice List
  FINANCE_SHOWS_RECENT_AND_RETURN_INVOICE2: "Shows recent and return invoice",
  FINANCE_CREATE_NEW_INVOICE3: "Create new Invoice",
  FINANCE_CANCEL_INVOICE: "Cancel Invoice",
  FINANCE_RETURN_INVOICE: "Return Invoice",

  // Receipt
  FINANCE_SHOWS_RECEIPT_CARD_DATA: "Shows receipt card data",
  FINANCE_VIEW_RECENT_RECEIPTS: "View recent receipts",
  FINANCE_CREATE_NEW_RECEIPT: "Create new receipt",

  // Receipt List
  FINANCE_SHOWS_ALL_RECEIPTS: "Shows all receipts",
  FINANCE_CREATE_NEW_RECEIPT2: "Create new receipt",
  FINANCE_CANCEL_RECEIPT: "Cancel receipt",

  // Quotation
  FINANCE_SHOWS_CARD_DATA_OF_QUOTATION: "Shows card data of quotation",
  FINANCE_SHOWS_SUMMARY_OF_QUOTATION: "Shows summary of quotation",
  FINANCE_CREATE_NEW_QUOTATION: "Create new quotation",

  // Quotation List
  FINANCE_CREATE_NEW_QUOTATION2: "Create new quotation",
  FINANCE_LIST_ALL_QUOTATION: "list all quotation",
  FINANCE_ACCEPT_QUOTATION: "Accept quotation",
  FINANCE_CANCEL_QUOTATION: "Cancel quotation",

  // Penalty and Adjustment
  FINANCE_SHOWS_CARD_DATA_OF_PENALTY_AND_ADJUSTMENT:
    "Shows card data of penalty and adjustment",
  FINANCE_SHOWS_SUMMARY_OF_RETURN_INVOICE: "Shows summary of return invoice",
  FINANCE_CREATE_NEW_ADJUSTMENT: "Create new adjustment",

  // Penalty and Adjustment List
  FINANCE_SHOWS_ALL_ADJUSTMENTS: "Shows all adjustments",
  FINANCE_CREATE_NEW_ADJUSTMENT2: "Create new adjustment",
  FINANCE_CANCEL_PENALTY: "Cancel penalty",

  // ──────────────────────────────────────────────────────────────
  //  LIBRARIAN DEPARTMENT
  // ──────────────────────────────────────────────────────────────

  // Dashboard
  LIBRARIAN_DASHBOARD_NOTICES: "view notice",
  LIBRARIAN_DASHBOARD_EVENTS: "view events",
  LIBRARIAN_DASHBOARD_BOOKS: "view books",
  LIBRARIAN_DASHBOARD_CLASSES: "get all classes",
  LIBRARIAN_DASHBOARD_DATA: "get dashboard data",

  // bookManagement
  LIBRARIAN_ADD_NEW_BOOK: "Add New Book",
  LIBRARIAN_GET_ALL_BOOKS: "Get All Books",
  LIBRARIAN_REMOVE_BOOK: "Remove Book",
  LIBRARIAN_EDIT_BOOK_INFORMATION: "Edit Book Information",
  LIBRARIAN_SHOW_BOOK_NAMES: "Show Book Names",

  // bookIssuance
  LIBRARIAN_ISSUE_BOOK: "Issue Book",
  LIBRARIAN_MAKE_CHANGES_ISSUE_BOOK: "Make changes in Issue Book",
  LIBRARIAN_GET_ALL_ISSUED_BOOKS: "Get All Issued Books",
  LIBRARIAN_VIEW_STUDENTS_BY_CLASS_AND_SECTION:
    "View Students By Class And Section",
  LIBRARIAN_VIEW_SECTIONS: "View Sections",
  LIBRARIAN_SHOW_ALL_STUDENTS: "Show All Students",

  // userStudentView (two groups but same idea)
  LIBRARIAN_GET_ALL_CLASSES: "Get All Classes",
  LIBRARIAN_SHOW_ALL_STUDENTS2: "Show All Students",
  LIBRARIAN_SHOWS_STUDENT_INFO: "Shows Student Info",
  LIBRARIAN_SHOWS_BOOK_ISSUE_OF_STUDENTS: "Shows Book Issue of Students",

  // userParentView
  LIBRARIAN_VIEW_PARENT: "View Parent",
  LIBRARIAN_VIEW_STUDENT: "View Student",
  LIBRARIAN_PARENT_STUDENT_INFO: "Shows Student Info",
  LIBRARIAN_PARENT_STUDENT_ISSUED_BOOK: "Shows Student Issued Book",

  // userTeacherView
  LIBRARIAN_VIEW_TEACHER: "view Teacher",

  // userLibrarianView
  LIBRARIAN_VIEW_LIBRARIAN: "view Librarian",

  // userStaffView
  LIBRARIAN_VIEW_STAFF: "view Staff",

  // Announcements
  LIBRARIAN_ADD_NEW_NOTICE: "Add New Notice",
  LIBRARIAN_UPDATE_NOTICE: "Update Notice",
  LIBRARIAN_SHOW_NOTICES: "Show Notices",
  LIBRARIAN_REMOVE_NOTICE: "Remove Notice",

  // EventManagement
  LIBRARIAN_ADD_NEW_EVENT: "Add New Event",
  LIBRARIAN_UPDATE_EVENT: "Update Event",
  LIBRARIAN_SHOW_EVENTS: "Show Events",
  LIBRARIAN_REMOVE_EVENT: "Remove Event",

  // ──────────────────────────────────────────────────────────────
  //  OTHER STAFF DEPARTMENT
  // ──────────────────────────────────────────────────────────────

  // dashboard
  OTHERSTAFF_GET_DASHBOARD_DATA: "get dashboard data",
  OTHERSTAFF_VIEW_EVENTS: "view events",
  OTHERSTAFF_VIEW_NOTICE: "view notice",

  // Managing Notices
  OTHERSTAFF_SHOW_NOTICES: "Show Notices",
  OTHERSTAFF_ADD_NEW_NOTICE: "Add New Notice",
  OTHERSTAFF_UPDATE_NOTICE: "Update Notice",
  OTHERSTAFF_REMOVE_NOTICE: "Remove Notice",

  // Managing Events
  OTHERSTAFF_SHOW_EVENTS: "Show Events",
  OTHERSTAFF_ADD_NEW_EVENT: "Add New Event",
  OTHERSTAFF_UPDATE_EVENT: "Update Event",
  OTHERSTAFF_REMOVE_EVENT: "Remove Event",

  // userStudentView
  OTHERSTAFF_GET_ALL_CLASSES: "Get All Classes",
  OTHERSTAFF_SHOW_ALL_STUDENTS: "Show All Students",

  // Student Information
  OTHERSTAFF_GET_STUDENT_DOCUMENTS: "Get Student Documents",

  // userParentView (two groups)
  OTHERSTAFF_SHOW_ALL_PARENTS: "Show All Parents",
  OTHERSTAFF_SHOW_ALL_STUDENTS2: "Show All Students",
  OTHERSTAFF_SHOWS_STUDENT_INFO: "Shows Student Info",

  // userStaffView
  OTHERSTAFF_VIEW_STAFFS: "view Staffs",
  OTHERSTAFF_VIEW_TEACHERS: "view Teachers",

  // ──────────────────────────────────────────────────────────────
  //  TEACHER DEPARTMENT
  // ──────────────────────────────────────────────────────────────

  // Announcements Management
  TEACHER_ADD_NEW_NOTICE: "Add New Notice",
  TEACHER_EDIT_ANNOUNCEMENT: "Edit Announcement",
  TEACHER_DELETE_ANNOUNCEMENT: "Delete Announcement",
  TEACHER_GET_ALL_ANNOUNCEMENTS: "Get All Announcements",
  TEACHER_GET_ANNOUNCEMENT_BY_ID: "Get Announcement by ID",
  TEACHER_MARK_ANNOUNCEMENT_AS_READ: "Mark Announcement as Read",

  // Announcement Comments Management
  TEACHER_CREATE_COMMENT_ON_ANNOUNCEMENT: "Create Comment on Announcement",
  TEACHER_EDIT_COMMENT_ON_ANNOUNCEMENT: "Edit Comment on Announcement",
  TEACHER_DELETE_COMMENT_ON_ANNOUNCEMENT: "Delete Comment on Announcement",
  TEACHER_GET_COMMENTS_BY_ANNOUNCEMENT: "Get Comments by Announcement",
  TEACHER_LIKE_COMMENT_ON_ANNOUNCEMENT: "Like Comment on Announcement",
  TEACHER_MARK_COMMENT_AS_READ: "Mark Comment as Read",

  // Assignments Management
  TEACHER_CREATE_ASSIGNMENT: "Create Assignment",
  TEACHER_UPDATE_ASSIGNMENT: "Update Assignment",
  TEACHER_DELETE_ASSIGNMENT: "Delete Assignment",
  TEACHER_GET_ASSIGNMENT_BY_ID: "Get Assignment by ID",
  TEACHER_GET_FILTERED_ASSIGNMENTS: "Get Filtered Assignments",

  // Speed Grade Management
  TEACHER_GET_SUBMITTED_ASSIGNMENT_OF_STUDENT:
    "Get Submitted Assignment of a Student",
  TEACHER_ASSIGN_GRADE_FOR_ALL_STUDENTS: "Assign Grade for All Students",
  TEACHER_GET_ASSIGNMENT_OF_A_STUDENT: "Get Assignment of a Student",
  TEACHER_ASSIGN_GRADE_TO_A_STUDENT: "Assign Grade to a Student",
  TEACHER_GET_ASSIGNED_STUDENTS_FOR_AN_ASSIGNMENT:
    "Get Assigned Students for an Assignment",

  // Discussions Management
  TEACHER_CREATE_DISCUSSION: "Create Discussion",
  TEACHER_UPDATE_DISCUSSION: "Update Discussion",
  TEACHER_DELETE_DISCUSSION: "Delete Discussion",
  TEACHER_GET_ALL_DISCUSSIONS: "Get All Discussions",
  TEACHER_GET_DISCUSSION_BY_ID: "Get Discussion by ID",
  TEACHER_UPDATE_PIN_STATUS_OF_DISCUSSION: "Update Pin Status of Discussion",
  TEACHER_MARK_DISCUSSION_AS_READ: "Mark Discussion as Read",

  // Discussion Comments Management
  TEACHER_CREATE_COMMENT_ON_DISCUSSION: "Create Comment on Discussion",
  TEACHER_EDIT_COMMENT_ON_DISCUSSION: "Edit Comment on Discussion",
  TEACHER_DELETE_COMMENT_ON_DISCUSSION: "Delete Comment on Discussion",
  TEACHER_LIKE_A_DISCUSSION_COMMENT: "Like a Discussion Comment",
  TEACHER_MARK_DISCUSSION_COMMENT_AS_READ: "Mark Discussion Comment as Read",
  TEACHER_GET_COMMENTS_BY_DISCUSSION: "Get Comments by Discussion",

  // Grades Management
  TEACHER_GET_GRADES_OF_ONE_CLASS: "Get Grades of One Class",
  TEACHER_GET_MODULES_FOR_A_STUDENT: "Get Modules for a Student",
  TEACHER_GET_FILTERED_ASSIGNMENTS2: "Get Filtered Assignments",
  TEACHER_GET_FILTERED_QUIZZES: "Get Filtered Quizzes",
  TEACHER_GET_GRADES_OF_ONE_STUDENT: "Get Grades of One Student",

  // Modules Management
  TEACHER_GET_MODULES_FOR_STUDENT: "Get Modules for a Student",
  TEACHER_ADD_MODULE: "Add Module",
  TEACHER_REORDER_MODULES: "Reorder Modules",
  TEACHER_EDIT_MODULE: "Edit Module",
  TEACHER_DELETE_MODULE: "Delete Module",

  // Chapters Management
  TEACHER_ADD_CHAPTER: "Add Chapter",
  TEACHER_REORDER_CHAPTERS: "Reorder Chapters",
  TEACHER_EDIT_CHAPTER: "Edit Chapter",
  TEACHER_DELETE_CHAPTER: "Delete Chapter",
  TEACHER_UPLOAD_CHAPTER_FILES: "Upload Chapter Files",
  TEACHER_REMOVE_CHAPTER_FILES: "Remove Chapter Files",

  // Pages Management
  TEACHER_CREATE_PAGE: "Create Page",
  TEACHER_GET_ALL_PAGES_FOR_A_CLASS: "Get All Pages for a Class",
  TEACHER_UPDATE_PAGE: "Update Page",
  TEACHER_GET_PAGE_DETAILS: "Get Page Details",
  TEACHER_DELETE_PAGE: "Delete Page",

  // Quiz Management
  TEACHER_CREATE_QUIZ: "Create Quiz",
  TEACHER_UPDATE_QUIZ: "Update Quiz",
  TEACHER_ADD_QUESTION_TO_QUIZ: "Add Question to Quiz",
  TEACHER_DELETE_QUIZ: "Delete Quiz",
  TEACHER_GET_QUIZ_BY_ID: "Get Quiz by ID",
  TEACHER_GET_FILTERED_QUIZZES_BY_SUBJECT: "Get Filtered Quizzes by Subject",
  TEACHER_UPDATE_QUESTION_IN_QUIZ: "Update Question in Quiz",
  TEACHER_DELETE_QUESTION_FROM_QUIZ: "Delete Question from Quiz",

  // speedGrade (Quiz Grade)
  TEACHER_ASSIGN_QUIZ_GRADE: "Assign Quiz Grade",
  TEACHER_GET_QUIZ_ASSIGNED_STUDENTS: "Get Quiz Assigned Students",
  TEACHER_GET_QUIZ_OF_A_STUDENT: "Get Quiz of a Student",

  // Rubric Management
  TEACHER_GET_RUBRIC_BY_SUBJECT_ID: "Get Rubric by Subject ID",
  TEACHER_GET_ASSIGNMENTS_FOR_RUBRIC: "Get Assignments for Rubric",
  TEACHER_GET_QUIZZES_FOR_RUBRIC: "Get Quizzes for Rubric",
  TEACHER_CREATE_RUBRIC: "Create Rubric",
  TEACHER_CREATE_QUIZ_RUBRIC: "Create Quiz Rubric",
  TEACHER_GET_RUBRIC_DETAILS: "Get Rubric Details",
  TEACHER_DELETE_RUBRIC: "Delete Rubric",
  TEACHER_UPDATE_RUBRIC: "Update Rubric",

  // Syllabus Management
  TEACHER_CREATE_SYLLABUS: "Create Syllabus",
  TEACHER_EDIT_SYLLABUS: "Edit Syllabus",
  TEACHER_GET_SYLLABUS: "Get Syllabus",
  TEACHER_DELETE_SYLLABUS: "Delete Syllabus",

  // Attendance Management
  TEACHER_GET_ATTENDANCE_STATS: "Get Attendance Stats",
  TEACHER_GET_SECTION_BY_CLASS: "Get Section by Class",
  TEACHER_GET_GROUP_BY_CLASS: "Get Group by Class",
  TEACHER_GET_STUDENT_MONTHLY_ATTENDANCE_LIST:
    "Get Student Monthly Attendance List",
  TEACHER_GET_STUDENT_LIST_FOR_ATTENDANCE: "Get Student List for Attendance",
  TEACHER_MARK_ATTENDANCE: "Mark Attendance",
  TEACHER_GET_YEARLY_ATTENDANCE_FOR_STUDENT:
    "Get Yearly Attendance for Student",

  // Class Management
  TEACHER_GET_ALL_CLASSES: "Get All Classes",
  TEACHER_GET_SPECIFIC_CLASS: "Get Specific Class",

  // Dashboard Management
  TEACHER_GET_ALL_STUDENT_ATTENDANCE: "Get All Student Attendance",
  TEACHER_GET_TOP_STUDENTS: "Get Top Students",
  TEACHER_VIEW_BOOKS: "view books",
  TEACHER_DASHBOARD_VIEW_NOTICE: "view notice",
  TEACHER_DASHBOARD_VIEW_EVENTS: "view events",
  TEACHER_GET_DASHBOARD_DATA: "get dashboard data",
  TEACHER_GET_ALL_CLASS: "get all classes", // (slight overlap with TEACHER_GET_ALL_CLASSES above)

  // Instructor Management
  TEACHER_GET_ALL_TEACHERS: "Get All Teachers",
  TEACHER_GET_SUBJECTS_BY_CLASS: "Get Subjects by Class",
  TEACHER_GET_TEACHERS_BY_CLASS: "Get Teachers by Class",
  TEACHER_GET_SECTION_BY_INSTRUCTOR: "Get Section by Instructor",

  // Library Management
  TEACHER_GET_ALL_BOOKS2: "Get All Books",
  TEACHER_GET_ALL_ISSUED_BOOKS: "Get All Issued Books",

  // Notices
  TEACHER_SHOW_NOTICES: "Show Notices",
  TEACHER_CREATE_NOTICE: "Add New Notice",
  TEACHER_UPDATE_NOTICE2: "Update Notice",
  TEACHER_REMOVE_NOTICE: "Remove Notice",

  // Events
  TEACHER_ADD_NEW_EVENT: "Add New Event",
  TEACHER_UPDATE_EVENT2: "Update Event",
  TEACHER_SHOW_EVENTS2: "Show Events",
  TEACHER_REMOVE_EVENT2: "Remove Event",

  // Section Management
  TEACHER_GET_STUDENTS_BY_CLASS_AND_SECTION:
    "Get Students by Class and Section",
  TEACHER_GET_UNASSIGNED_STUDENTS: "Get Unassigned Students",
  TEACHER_GET_SECTION_BY_CLASS2: "Get Section by Class",
  TEACHER_GET_GROUP_BY_CLASS2: "Get Group by Class",
  TEACHER_ASSIGN_STUDENT_TO_SECTION: "Assign Student to Section",
  TEACHER_GET_GROUP_BY_SECTION: "Get Group by Section",

  // Section Grade Management
  TEACHER_SECTIONGRADE_GET_GRADES_OF_ONE_STUDENT: "Get Grades of One Student",
  TEACHER_SECTIONGRADE_GET_STUDENT_SUBJECTS: "Get Student Subjects",

  // Student Management
  TEACHER_USERS_STUDENT_GET_ALL_CLASSES: "Get All Classes",
  TEACHER_USERS_STUDENT_GET_ALL_STUDENTS: "Get All Students",
  TEACHER_USERS_STUDENT_OVERVIEW_STUDENT: "Get Student Overview",
  TEACHER_USERS_STUDENT_YEARLY_ATTENDANCE: "Get Yearly Attendance",
  TEACHER_USERS_STUDENT_TASKS: "Get Student Tasks",
  TEACHER_USERS_STUDENT_COURSE_PROGRESS_SUBJECT:
    "Get Course Progress by Subject",
  TEACHER_USERS_STUDENT_COURSE_PROGRESS: "Get Course Progress",
  TEACHER_USERS_STUDENT_INFORMATION: "Get Student Information",
  TEACHER_USERS_STUDENT_GRADES: "Get Student Grades",
  TEACHER_USERS_STUDENT_SUBJECTS: "Get Student Subjects",
  TEACHER_USERS_STUDENT_ATTENDANCE: "Get Student Attendance",
  TEACHER_USERS_STUDENT_ALL_BOOKISSUE: "Get Book Issue Records",

  // Grade Management
  TEACHER_USERS_STUDENT_GRADES2: "Get Grades of One Student",
  TEACHER_USERS_STUDENT_COURSE_SUBJECTS: "Get Student Subjects",

  // Timetable Management
  TEACHER_TIMETABLE_VIEW: "Get Teacher Timetable",

  // Parent Management
  TEACHER_PARENT_GET_ALL_PARENTS: "Get All Parents",
  TEACHER_PARENT_GET_ALL_STUDENTS: "Get All Students",

  // Profile Overview
  TEACHER_PARENT_OVERVIEW_STUDENT_SUBJECTS: "Get Student Subjects Overview",
  TEACHER_PARENT_OVERVIEW_YEARLY_ATTENDANCE: "Get Yearly Attendance",
  TEACHER_PARENT_OVERVIEW_TASKS: "Get Student Tasks Overview",

  // Course Progress
  TEACHER_PARENT_COURSE_PROGRESS_BY_SUBJECT:
    "Get Student Course Progress by Subject",
  TEACHER_PARENT_COURSE_PROGRESS_ALL_SUBJECTS: "Get All Student Subjects",

  // Student Information
  TEACHER_PARENT_GET_STUDENT_DOCUMENTS: "Get Student Documents",

  // Grades
  TEACHER_PARENT_GET_STUDENT_GRADES_BY_CLASS: "Get Student Grades by Class",
  TEACHER_PARENT_GET_STUDENT_SUBJECTS: "Get Student Subjects",

  // Attendance
  TEACHER_PARENT_GET_MY_ATTENDANCE: "Get My Attendance",

  // Book Issue
  TEACHER_PARENT_GET_ALL_BOOKISSUE: "Get All Book Issues",

  // Staff Management
  TEACHER_PARENT_GET_ALL_STAFF: "Get All Staff",
};
