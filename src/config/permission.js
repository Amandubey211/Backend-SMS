// config/permissions.js

//
// 1) Define roles
//
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  FINANCE: "finance",
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
  //-------------------------------------------------------------------------//
  // Dashboard 1
  //common
  GET_DASHBOARD_CARD: "get dashboard data",
  DASH_VIEW_BOOKS: "view books",
  DASH_VIEW_NOTICE: "view notice",
  DASH_VIEW_EVENTS: "view events",

  // teacher
  GET_GRAPH_STUDENT_ATTENDENCE: "Get All Student Attendance",
  GET_TOP_STUDENTS: "Get Top Students", // not working
  // finace
  GET_EARNING_EXPENSE_GRAPH: "View Expense and Earning Graph",

  // LIBARY 2
  //  commom
  GET_ALL_ISSUE_BOOKS: "Get All Issued Books",
  GET_ALL_BOOKS: "Get All Books",

  // Librarian
  //Books
  ADD_BOOK: "Add New Book",
  REMOVE_BOOK: "Remove Book",
  EDIT_BOOK: "Edit Book Information",
  SHOW_BOOK_NAME: "Show Book Names", //NW

  // Books issue
  ADD_ISSUE_BOOK: "New Issue Book",
  EDIT_ISSUE_BOOK: "Make changes in Issue Book",
  VIEW_STUDENT_BY_SECTION_AND_CLASS: "View Students By Class And Section", //NW
  //  VIEW_SECTIONS:"View Sections",
  VIEW_STUDENT: "View Students",
  VIEW_PARENT: "View Parents",

  // Finance 3

  //earning
  // earning-dashboard

  VIEW_REVENUE_GRAPH: "View Revenue Graph",
  SHOWS_REVENUE_CARD_DATA_IN_DASHBOARD: "Shows revenue card data in dashboard",
  // earning-view
  VIEW_ALL_INCOMES: "View All Incomes",

  // add - earning
  ADD_NEW_Community_REVENUE: "Add new Community External Affairs Revenue",
  ADD_NEW_Facility_REVENUE: "Add new Facality Based Revenue",
  ADD_NEW_Financial_REVENUE: "Add new financial Investment Revenue",
  ADD_NEW_Service_REVENUE: "Add new Service Based Revenue",
  ADD_NEW_Other_REVENUE: "Add new Other Revenue", // not in backend

  // edit-earning
  Community_MODIFY: "Modify Community External Affairs Revenue",
  Facility_MODIFY: "Modify Facility Based Revenue",
  Financial_MODIFY: "Modify Financial Investment Revenue",
  Service_MODIFY: "Modify Service Based Revenue",
  Other_MODIFY: "Modify Other Revenue",
  LIST_ALL_REVENUE: "List all Revenue",

  CREATE_NEW_INVOICE: "Create new Invoice",

  // delete-earning
  Facility_DELETE: "Delete Facility Based Revenue",

  // Student Fees
  SHOWS_INFO_FOR_STUDENT_FEES: "Shows Info for student Fees",
  SHOWS_GRAPH_FOR_STUDENT_FEES: "Shows Graph for student Fees ",
  SUMMARY_OF_STUDENT_FEES: "Summary of student Fees",
  ADD_NEW_FEES: "Add new Fees",
  EDIT_FEES: "Edit Student Fee",
  DELETE_FEES: "Delete Student Fee",

  // Expense

  // Expense

  VIEW_EXPENSE_GRAPH: "View Expense graph",
  VIEW_EXPENSE_CARD_DATA: "View Expense Card Data",
  VIEW_SUMMARY_OF_EXPENSES: "View Summary of Expenses",

  ADD_NEW_Event_EXPENSE: "Add new event, activity expense",
  ADD_NEW_exam_EXPENSE: "Add new exam, affiliation expense",
  ADD_NEW_Library_EXPENSE: "Add new library, Academic expense",
  ADD_NEW_Marketing_EXPENSE: "Add new marketing, Ad. expense",
  ADD_NEW_Miscellaneous_EXPENSE: "Add new miscellaneous expense",
  ADD_NEW_Salaries_EXPENSE: "Add new salary, Wages expense",
  ADD_NEW_IT_EXPENSE: "Add new software expense",
  ADD_NEW_Supplies_EXPENSE: "Add new supplies expense",
  ADD_NEW_Supplies_EXPENSE: "Add new utility, Maintenance expense",

  // Expense List
  VIEW_ALL_EXPENSES: "View All Expenses",

  //edit-expense
  EDIT_Event_EXPENSE: "Edit event, activity expense",
  EDIT_Library_EXPENSE: "Edit library, Academic expense",
  EDIT_Marketing_EXPENSE: "Edit marketing, Ad. expense",
  EDIT_Miscellaneous_EXPENSE: "Edit miscellaneous expense",
  EDIT_Salaries_EXPENSE: "Edit salary, Wages expense",
  EDIT_IT_EXPENSE: "Edit software expense",
  EDIT_Supplies_EXPENSE: "Edit supplies expense",
  EDIT_Utilities_EXPENSE: "Edit utility, Maintenance expense",
  EDIT_Examination_EXPENSE: "Edit Examination and Affiliation", // not in backend

  // delete-expense
  REMOVE_Utilities_EXPENSE: "Remove utility, Maintenance expense",
  REMOVE_Supplies_EXPENSE: "Remove supplies expense",
  REMOVE_IT_EXPENSE: "Remove software expense",
  REMOVE_Salaries_EXPENSE: "Remove salary, Wages expense",
  REMOVE_Miscellaneous_EXPENSE: "Remove miscellaneous expense",
  REMOVE_Marketing_EXPENSE: "Remove marketing, Ad. expense",
  REMOVE_Library_EXPENSE: "Remove library, Academic expense",
  REMOVE_Event_EXPENSE: "Remove event, activity expense",
  REMOVE_Examination_EXPENSE: "Remove exam,affiliation expense",

  // add - earning
  ADD_NEW_Community_REVENUE: "Add new Community External Affairs Revenue",
  ADD_NEW_Facility_REVENUE: "Add new Facility Based Revenue",
  ADD_NEW_Financial_REVENUE: "Add new Financial Investment Revenue",
  ADD_NEW_SERVICE_BASED_REVENUE: "Add new Service Based Revenue",
  ADD_NEW_Other_REVENUE: "Add new Other Revenue", // not in backend

  // edit-earning
  Community_MODIFY: "Modify Community External Affairs Revenue",
  Facility_MODIFY: "Modify Facility Based Revenue",
  Financial_MODIFY: "Modify Financial Investment Revenue",
  Service_MODIFY: "Modify Service Based Revenue",
  Other_MODIFY: "Modify Other Revenue",
  LIST_ALL_REVENUE: "List all Revenue",

  // delete-earning
  Facility_DELETE: "Delete Facility Based Revenue",

  //Invoices
  SHOWS_RECENT_AND_RETURN_INVOICE: "Shows recent and return invoice",
  SHOWS_CARD_DATA_OF_INVOICE: "Shows card data of invoice",
  CANCEL_INVOICE: "Cancel Invoice",
  CREATE_NEW_INVOICE: "Create new Invoice",
  RETURN_INVOICE: "Return Invoice",
  COMPLETE_INVOICE: "Complete Invoice", // not in backend

  // receipt
  SHOWS_RECEIPT_CARD_DATA: "Shows receipt card data",
  CREATE_NEW_RECEIPT: "Create new receipt",
  SHOWS_ALL_RECEIPTS: "Shows all receipts",
  VIEW_RECENT_RECEIPTS: "View recent receipts",
  VIEW_EXPENSE_CARD_DATA: "Shows receipt card data",
  CANCEL_RECEIPTS: "Cancel receipt",

  //quotation
  CREATE_NEW_QUOTATION: "Create new quotation",
  LIST_ALL_QUOTATION: "List all quotation",
  SHOWS_CARD_DATA_OF_QUOTATION: "Shows card data of quotation",
  SHOWS_SUMMARY_OF_QUOTATION: "Shows summary of quotation",
  CANCEL_QUOTATION: "Cancel quotation",
  ACCEPT_QUOTATION: "Accept quotation",
  REJECT_QUOTATION: "Accept quotation", // not in backend

  SHOWS_ALL_ADJUSTMENTS: "Shows all adjustments",
  CREATE_NEW_ADJUSTMENT: "Create new adjustment",
  SHOWS_CARD_DATA_OF_PENALTY_AND_ADJUSTMENT:
    "Shows card data of penalty and adjustment",
  CANCEL_PENALTY: "Cancel penalty",

  // add - earning
  ADD_NEW_Community_REVENUE: "Add new Community External Affairs Revenue",
  ADD_NEW_Facility_REVENUE: "Add new Facility Based Revenue",
  ADD_NEW_Financial_REVENUE: "Add new Financial Investment Revenue",
  ADD_NEW_SERVICE_BASED_REVENUE: "Add new Service Based Revenue",
  ADD_NEW_OTHER_REVENUE: "Add new Other Revenue", // not in backend

  // edit-earning
  Community_MODIFY: "Modify Community External Affairs Revenue",
  Facility_MODIFY: "Modify Facility Based Revenue",
  Financial_MODIFY: "Modify Financial Investment Revenue",
  Service_MODIFY: "Modify Service Based Revenue",
  Other_MODIFY: "Modify Other Revenue",
  LIST_ALL_REVENUE: "List all Revenue",
  CREATE_NEW_INVOICE: "Create new Invoice",

  // delete-earning
  Facility_DELETE: "Delete Facility Based Revenue",

  // TimeTable 4
  // Common
  TIMETABLE_VIEW: "Get Teacher Timetable",

  // Other Staff
  TIMETABLE_CREATE: "Create Timetable", // not working
  TIMETABLE_UPDATE: "Update Timetable", // not working
  TIMETABLE_DELETE: "Delete Timetable", // not working

  // Notices 5
  // Common
  ADD_NEW_NOTICE: "Add New Notice",
  UPDATE_NOTICE: "Update Notice",
  SHOW_NOTICES: "Show Notices",
  REMOVE_NOTICE: "Remove Notice",

  // Events 6
  // Common
  ADD_NEW_EVENT: "Add New Event",
  UPDATE_EVENT: "Update Event",
  SHOW_EVENTS: "Show Events",
  REMOVE_EVENT: "Remove Event",

  // USERS STAFFS 7
  // teacher
  VIEW_TEACHER: "view Teacher",
  ADD_TEACHER: "Add Teacher",
  EDIT_TEACHER: "edit Teacher",
  ACTIVE_TEACHER: "activate Teacher",
  DEACTIVE_TEACHER: "deactivate Teacher",

  // other staff
  VIEW_STAFF: "view Staff",
  ADD_STAFF: "Add Staff",
  EDIT_STAFF: "edit Staff",
  ACTIVE_STAFF: "activate Staff",
  DEACTIVE_STAFF: "deactivate Staff",

  //librarian
  VIEW_LIBRARIAN: "view Librarian",
  ADD_LIBRARIAN: "Add Librarian",
  EDIT_LIBRARIAN: "edit Librarian",
  ACTIVE_LIBRARIAN: "activate Librarian",
  DEACTIVE_LIBRARIAN: "deactivate Librarian",
  //finance
  VIEW_FINANCE_USER: "view Finance",
  ADD_FINANCE: "Add Finance",
  EDIT_FINANCE: "Edit Finance",
  ACTIVE_FINANCE: "activate Finance",
  DEACTIVE_FINANCE: "deactivate Finance",
  
  // ---------------------------------------------------------------
  // ROLE MANAGEMENT PERMISSIONS (NEW) 8
  // ---------------------------------------------------------------

  // Common Role Management
  CREATE_ROLE: "Create Role",
  EDIT_ROLE: "Edit Role",
  GET_ALL_ROLE: "Get All Role",
  ASSIGN_ROLE: "Assign Role",
  REMOVE_ROLE: "Remove Role",

  // Classes 9
  //------------------------start of Class Variables ---------------------------------------------------------------------------------

  // =========================
  // Announcements Management
  // =========================
  ADD_NEW_ANNOUNCEMENT: "Add New Announcement",
  EDIT_ANNOUNCEMENT: "Edit Announcement",
  DELETE_ANNOUNCEMENT: "Delete Announcement",
  ALL_ANNOUNCEMENTS: "Get All Announcements",
  ANNOUNCEMENT_BY_ID: "Get Announcement by ID",
  MARK_ANNOUNCEMENT_AS_READ: "Mark Announcement as Read",

  // ==================================
  // Announcement Comments Management
  // ==================================
  CREATE_COMMENT_ON_ANNOUNCEMENT: "Create Comment on Announcement",
  EDIT_COMMENT_ON_ANNOUNCEMENT: "Edit Comment on Announcement",
  DELETE_COMMENT_ON_ANNOUNCEMENT: "Delete Comment on Announcement",
  COMMENTS_BY_ANNOUNCEMENT: "Get Comments by Announcement",
  LIKE_COMMENT_ON_ANNOUNCEMENT: "Like Comment on Announcement",
  MARK_COMMENT_AS_READ: "Mark Comment as Read",

  // ========================
  // Assignments Management
  // ========================
  CREATE_ASSIGNMENT: "Create Assignment",
  UPDATE_ASSIGNMENT: "Update Assignment",
  DELETE_ASSIGNMENT: "Delete Assignment",
  ASSIGNMENT_BY_ID: "Get Assignment by ID",
  FILTERED_ASSIGNMENTS: "Get Filtered Assignments",

  // ========================
  // Speed Grade Management
  // ========================
  SUBMITTED_ASSIGNMENT_OF_A_STUDENT: "Get Submitted Assignment of a Student",
  ASSIGN_GRADE_FOR_ALL_STUDENTS: "Assign Grade for All Students",
  ASSIGNMENT_OF_A_STUDENT: "Get Assignment of a Student",
  ASSIGN_GRADE_TO_A_STUDENT: "Assign Grade to a Student",
  ASSIGNED_STUDENTS_FOR_AN_ASSIGNMENT:
    "Get Assigned Students for an Assignment",

  // =======================
  // Discussions Management
  // =======================
  CREATE_DISCUSSION: "Create Discussion",
  UPDATE_DISCUSSION: "Update Discussion",
  DELETE_DISCUSSION: "Delete Discussion",
  ALL_DISCUSSIONS: "Get All Discussions",
  DISCUSSION_BY_ID: "Get Discussion by ID",
  UPDATE_PIN_STATUS_OF_DISCUSSION: "Update Pin Status of Discussion",
  MARK_DISCUSSION_AS_READ: "Mark Discussion as Read",

  // =================================
  // Discussion Comments Management
  // =================================
  CREATE_COMMENT_ON_DISCUSSION: "Create Comment on Discussion",
  EDIT_COMMENT_ON_DISCUSSION: "Edit Comment on Discussion",
  DELETE_COMMENT_ON_DISCUSSION: "Delete Comment on Discussion",
  LIKE_A_DISCUSSION_COMMENT: "Like a Discussion Comment",
  MARK_DISCUSSION_COMMENT_AS_READ: "Mark Discussion Comment as Read",
  COMMENTS_BY_DISCUSSION: "Get Comments by Discussion",

  // ====================
  // Grades Management
  // ====================
  GRADES_OF_ONE_CLASS: "Get Grades of One Class",
  MODULES_FOR_A_STUDENT: "Get Modules for a Student",
  FILTERED_ASSIGNMENTS_GRADES: "Get Filtered Assignments",
  FILTERED_QUIZZES: "Get Filtered Quizzes",
  GRADES_OF_ONE_STUDENT: "Get Grades of One Student",

  // =====================
  // Modules Management
  // =====================
  MODULES_FOR_A_STUDENT_MODULES: "Get Modules for a Student",
  ADD_MODULE: "Add Module",
  REORDER_MODULES: "Reorder Modules",
  EDIT_MODULE: "Edit Module",
  DELETE_MODULE: "Delete Module",

  // ======================
  // Chapters Management
  // ======================
  ADD_CHAPTER: "Add Chapter",
  REORDER_CHAPTERS: "Reorder Chapters",
  EDIT_CHAPTER: "Edit Chapter",
  DELETE_CHAPTER: "Delete Chapter",
  UPLOAD_CHAPTER_FILES: "Upload Chapter Files",
  REMOVE_CHAPTER_FILES: "Remove Chapter Files",

  // ===================
  // Pages Management
  // ===================
  CREATE_PAGE: "Create Page",
  ALL_PAGES_FOR_A_CLASS: "Get All Pages for a Class",
  UPDATE_PAGE: "Update Page",
  PAGE_DETAILS: "Get Page Details",
  DELETE_PAGE: "Delete Page",

  // ===================
  // Quiz Management
  // ===================
  CREATE_QUIZ: "Create Quiz",
  UPDATE_QUIZ: "Update Quiz",
  ADD_QUESTION_TO_QUIZ: "Add Question to Quiz",
  DELETE_QUIZ: "Delete Quiz",
  QUIZ_BY_ID: "Get Quiz by ID",
  FILTERED_QUIZZES_BY_SUBJECT: "Get Filtered Quizzes by Subject",
  UPDATE_QUESTION_IN_QUIZ: "Update Question in Quiz",
  DELETE_QUESTION_FROM_QUIZ: "Delete Question from Quiz",

  // ===============
  // speedGrade
  // ===============
  ASSIGN_QUIZ_GRADE: "Assign Quiz Grade",
  QUIZ_ASSIGNED_STUDENTS: "Get Quiz Assigned Students",
  QUIZ_OF_A_STUDENT: "Get Quiz of a Student",

  // ===================
  // Rubric Management
  // ===================
  RUBRIC_BY_SUBJECT_ID: "Get Rubric by Subject ID",
  ASSIGNMENTS_FOR_RUBRIC: "Get Assignments for Rubric",
  QUIZZES_FOR_RUBRIC: "Get Quizzes for Rubric",
  CREATE_RUBRIC: "Create Rubric",
  CREATE_QUIZ_RUBRIC: "Create Quiz Rubric",
  RUBRIC_DETAILS: "Get Rubric Details",
  DELETE_RUBRIC: "Delete Rubric",
  UPDATE_RUBRIC: "Update Rubric",

  // =====================
  // Syllabus Management
  // =====================
  CREATE_SYLLABUS: "Create Syllabus",
  EDIT_SYLLABUS: "Edit Syllabus",
  VIEW_SYLLABUS: "Get Syllabus",
  DELETE_SYLLABUS: "Delete Syllabus",

  // =======================
  // Attendance Management
  // =======================
  ATTENDANCE_STATS: "Get Attendance Stats",
  SECTION_BY_CLASS_ATTENDANCE: "Get Section by Class",
  GROUP_BY_CLASS: "Get Group by Class",
  STUDENT_MONTHLY_ATTENDANCE_LIST: "Get Student Monthly Attendance List",
  STUDENT_LIST_FOR_ATTENDANCE: "Get Student List for Attendance",
  MARK_ATTENDANCE: "Mark Attendance",
  YEARLY_ATTENDANCE_FOR_STUDENT: "Get Yearly Attendance for Student",

  // ===================
  // Class Management
  // ===================
  ALL_CLASSES: "Get All Classes",
  ADD_CLASSES: "Add Classes", // not in backend
  SPECIFIC_CLASS: "Get Specific Class",

  // =======================
  // Dashboard Management
  // =======================
  ALL_STUDENT_ATTENDANCE: "Get All Student Attendance",
  TOP_STUDENTS: "Get Top Students",
  VIEW_BOOKS: "view books",
  VIEW_NOTICE: "view notice",
  VIEW_EVENTS: "view events",
  DASHBOARD_DATA: "get dashboard data",

  // ======================
  // Instructor Management
  // ======================
  ALL_TEACHERS: "Get All Teachers",
  SUBJECTS_BY_CLASS: "Get Subjects by Class",
  TEACHERS_BY_CLASS: "Get Teachers by Class",
  SECTION_BY_INSTRUCTOR: "Get Section by Instructor",

  // ======================
  // Library Management
  // ======================
  ALL_BOOKS: "Get All Books",
  ALL_ISSUED_BOOKS: "Get All Issued Books",

  // =========
  // Notices
  // =========
  SHOW_NOTICES: "Show Notices",
  ADD_NEW_NOTICE: "Add New Notice",
  UPDATE_NOTICE: "Update Notice",
  REMOVE_NOTICE: "Remove Notice",

  // =======
  // Events
  // =======
  ADD_NEW_EVENT: "Add New Event",
  UPDATE_EVENT: "Update Event",
  SHOW_EVENTS: "Show Events",
  REMOVE_EVENT: "Remove Event",

  // =====================
  // Section Management
  // =====================
  STUDENTS_BY_CLASS_AND_SECTION: "Get Students by Class and Section",
  UNASSIGNED_STUDENTS: "Get Unassigned Students",
  SECTION_BY_CLASS: "Get Section by Class",
  GROUP_BY_CLASS_SECTION: "Get Group by Class",
  ASSIGN_STUDENT_TO_SECTION: "Assign Student to Section",
  GROUP_BY_SECTION: "Get Group by Section",

  // ==========================
  // Section Grade Management
  // ==========================
  // GRADES_OF_ONE_STUDENT_SECTION: "Get Grades of One Student",
  STUDENT_SUBJECTS: "Get Student Subjects",

  // ======================
  // Student Management
  // ======================
  SECTION_BY_CLASS_STUDENT: "Get Section by Class",
  STUDENTS_BY_CLASS_AND_SECTION_STUDENT: "Get Students by Class and Section",
 //student management

 STUDENT_BOOKISSUE_RECORD: "Get Book Issue Records",
 GET_STUDENT_ATTENDENCE: "Get Student Attendance",
 GET_STUDENT_SUBJECTS: "Get Student Subjects",
 GET_STUDENT_GRADES: "Get Student Grades",
 GET_STUDENT_INFO: "Get Student Information",
 GET_COURSE_PROGRESS: "Get Course Progress",
 GET_PROGRESS_OF_SUBJECT: "Get Course Progress by Subject",
 GET_STUDENT_TASK: "Get Student Tasks",
 GET_YEARLY_ATTENDEC: "Get Yearly Attendance",
  // ====================
  // Grade Management
  // ====================
  // GRADES_OF_ONE_STUDENT_GRADE: "Get Grades of One Student",
  STUDENT_SUBJECTS_GRADE: "Get Student Subjects",
  //------------------------------------------------End of Class Variables ---------------------------------------------------------

  //-------------------------------------------------------------------------//

  // Receipt Permissions

  // Quotation Permissions

  // Dashboard
  GET_DASHBOARD_DATA: "Get dashboard data",
  VIEW_NOTICE: "View notice",
  VIEW_EVENTS: "View events",

  // Teacher dashboard
  //GET_TOP_STUDENTS: "Get top students",
  GET_ALL_STUDENTS: "Get All Students",

  // Student View
  GET_ALL_CLASSES: "Get All Classes",
  SHOW_ALL_STUDENTS: "View Students",

 

  // Student Info
  SHOWS_STUDENT_INFO: "Shows Student Info",

  // Parent View
  
  //VIEW_STUDENT: "View Student",
  SHOWS_PARENT_STUDENT_INFO: "Shows Student Info",

  // Teacher View

  // Staff View

  // Student Fees

  // Invoice

  // Receipt

  CANCEL_RECEIPT: "Cancel receipt",

  // Penalty and Adjustment

  // Book Management
  ADD_NEW_BOOK: "Add New Book",
  GET_ALL_BOOKS: "Get All Books",
  // REMOVE_BOOK: "Remove Book",
  EDIT_BOOK_INFORMATION: "Edit Book Information",
  SHOW_BOOK_NAMES: "Show Book Names",

  // Book Issuance
  ISSUE_BOOK: "Issue Book",
  MAKE_CHANGES_ISSUE_BOOK: "Make changes in Issue Book",
  GET_ALL_ISSUED_BOOKS: "Get All Issued Books",
  VIEW_STUDENTS_BY_CLASS_AND_SECTION: "View Students By Class And Section",
  VIEW_SECTIONS: "View Sections",

  // Quiz Management
  CREATE_QUIZ: "Create Quiz",
  UPDATE_QUIZ: "Update Quiz",
  ADD_QUESTION_TO_QUIZ: "Add Question to Quiz",
  DELETE_QUIZ: "Delete Quiz",
  GET_QUIZ_BY_ID: "Get Quiz by ID",
  ASSIGN_QUIZ_GRADE: "Assign Quiz Grade",

  // Graduates Permissions
  VIEW_ALL_GRADUATES: "View All Graduates", // not in backend
  DEMOTE_GRADUATE: "Demote Graduate", // not in backend
  VIEW_GRADUATE_DETAILS: "View Graduate Details", // not in backend

  // Verify Students
  VIEW_UNVERIFIED_STUDENT: "View Unverified Student", // not in backend
  VIEW_REJECTED_STUDENTS: "View Rejected Students", // not in backend

  // Admission to Student
  CREATE_ADMISSION: "Create Admission", // not in backend
};
