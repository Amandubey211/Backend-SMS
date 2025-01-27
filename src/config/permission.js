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
        DASH_VIEW_BOOKS : "view books",
        DASH_VIEW_NOTICE : "view notice",
        DASH_VIEW_EVENTS : "view events",


        // teacher
        GET_GRAPH_STUDENT_ATTENDENCE : "Get All Student Attendance",
        GET_TOP_STUDENTS : "Get Top Students", // not working
            

        //librarian

        // finace
            GET_EARNING_EXPENSE_GRAPH:"View Expense and Earning Graph",
        // other staff
   

     
    // LIBARY
           //  commom
           GET_ALL_ISSUE_BOOKS :"Get All Issued Books",
           GET_ALL_BOOKS :"Get All Books",

           // Librarian
              //Books
              ADD_BOOK:"Add New Book",
              REMOVE_BOOK:"Remove Book",
              EDIT_BOOK:"Edit Book Information",
              SHOW_BOOK_NAME:"Show Book Names",//NW

              // Books issue
               ADD_ISSUE_BOOK:"New Issue Book",
               EDIT_ISSUE_BOOK:"Make changes in Issue Book",
               VIEW_STUDENT_BY_SECTION_AND_CLASS:"View Students By Class And Section",//NW
              //  VIEW_SECTIONS:"View Sections",
               VIEW_STUDENT:"Show All Students",
   
           // Finance
            //earning
               // earning-dashboard
             
             VIEW_REVENUE_GRAPH: "View Revenue Graph",
             SHOWS_REVENUE_CARD_DATA_IN_DASHBOARD: "Shows revenue card data in dashboard",
             // earning-view
             VIEW_ALL_INCOMES: "View All Incomes",

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










  //-------------------------------------------------------------------------//

  // Receipt Permissions
  CREATE_NEW_RECEIPT: "Create new receipt",
  SHOWS_ALL_RECEIPTS: "Shows all receipts",
  VIEW_RECENT_RECEIPTS: "View recent receipts",

  // Quotation Permissions
  CREATE_NEW_QUOTATION: "Create new quotation",
  LIST_ALL_QUOTATION: "List all quotation",
  SHOWS_CARD_DATA_OF_QUOTATION: "Shows card data of quotation",
  SHOWS_SUMMARY_OF_QUOTATION: "Shows summary of quotation",

  // Adjustments Permissions
  CREATE_NEW_ADJUSTMENT: "Create new adjustment",
  LIST_ALL_ADJUSTMENTS: "List all adjustments",
  SHOWS_CARD_DATA_OF_PENALTY_AND_ADJUSTMENT: "Shows card data of penalty and adjustment",
  SHOWS_SUMMARY_OF_RETURN_INVOICE: "Shows summary of return invoice",

  // Dashboard
  GET_DASHBOARD_DATA: "Get dashboard data",
  VIEW_NOTICE: "View notice",
  VIEW_EVENTS: "View events",

  // Teacher dashboard
  //GET_TOP_STUDENTS: "Get top students",
  GET_ALL_STUDENTS: "Get All Students",
  
  // Managing Notices
  ADD_NEW_NOTICE: "Add New Notice",
  UPDATE_NOTICE: "Update Notice",
  SHOW_NOTICES: "Show Notices",
  REMOVE_NOTICE: "Remove Notice",

  // Managing Events
  ADD_NEW_EVENT: "Add New Event",
  UPDATE_EVENT: "Update Event",
  SHOW_EVENTS: "Show Events",
  REMOVE_EVENT: "Remove Event",

  // TimeTable
  TIMETABLE_VIEW: "Timetable View",

  // Student View
  GET_ALL_CLASSES: "Get All Classes",
  SHOW_ALL_STUDENTS: "Show All Students",

  //student management

  STUDENT_BOOKISSUE_RECORD:'Get Book Issue Records',
  GET_STUDENT_ATTENDENCE:'Get Student Attendance',
  GET_STUDENT_SUBJECTS :'Get Student Subjects',
  GET_STUDENT_GRADES:'Get Student Grades',
  GET_STUDENT_INFO:'Get Student Information',
  GET_COURSE_PROGRESS:'Get Course Progress',
  GET_PROGRESS_OF_SUBJECT:'Get Course Progress by Subject',
  GET_STUDENT_TASK:'Get Student Tasks',
  GET_YEARLY_ATTENDEC:'Get Yearly Attendance',
 
  // Student Info
  SHOWS_STUDENT_INFO: "Shows Student Info",

  // Parent View
  VIEW_PARENT: "View Parent",
  VIEW_STUDENT: "View Student",
  SHOWS_PARENT_STUDENT_INFO: "Shows Student Info",

  // Teacher View
  VIEW_TEACHER: "View Teacher",
  VIEW_LIBRARIAN: "Get All Staff",

  // Staff View
  VIEW_STAFF: "Get All Staff",
  VIEW_FINANCE_USER: "Get All Staff",

 

  // Student Fees
  SHOWS_INFO_FOR_STUDENT_FEES: "Shows Info for student Fees",
  SHOWS_GRAPH_FOR_STUDENT_FEES: "Shows Graph for student Fees",
  SUMMARY_OF_STUDENT_FEES: "Summary of student Fees",
  ADD_NEW_FEES: "Add new Fees",
  EDIT_FEES: "Edit Fees",

  // Expense
  VIEW_EXPENSE_GRAPH: "View Expense graph",
  VIEW_EXPENSE_CARD_DATA: "View Expense Card Data",
  VIEW_SUMMARY_OF_EXPENSES: "View Summary of Expenses",
  ADD_NEW_EVENT_ACTIVITY_EXPENSE: "Add new event, activity expense",
  ADD_NEW_EXAM_AFFILIATION_EXPENSE: "Add new exam, affiliation expense",
  ADD_NEW_LIBRARY_ACADEMIC_EXPENSE: "Add new library, Academic expense",
  ADD_NEW_MARKETING_AD_EXPENSE: "Add new marketing, Ad. expense",
  ADD_NEW_MISCELLANEOUS_EXPENSE: "Add new miscellaneous expense",
  ADD_NEW_SALARY_WAGES_EXPENSE: "Add new salary, Wages expense",
  ADD_NEW_SOFTWARE_EXPENSE: "Add new software expense",
  ADD_NEW_SUPPLIES_EXPENSE: "Add new supplies expense",
  ADD_NEW_UTILITY_MAINTENANCE_EXPENSE: "Add new utility, Maintenance expense",

  // Expense List
  VIEW_ALL_EXPENSES: "View All Expenses",
  EDIT_EVENT_ACTIVITY_EXPENSE: "Edit event, activity expense",
  REMOVE_EVENT_ACTIVITY_EXPENSE: "Remove event, activity expense",
  EDIT_LIBRARY_ACADEMIC_EXPENSE: "Edit library, Academic expense",
  REMOVE_LIBRARY_ACADEMIC_EXPENSE: "Remove library, Academic expense",
  EDIT_MARKETING_AD_EXPENSE: "Edit marketing, Ad. expense",
  REMOVE_MARKETING_AD_EXPENSE: "Remove marketing, Ad. expense",
  EDIT_MISCELLANEOUS_EXPENSE: "Edit miscellaneous expense",
  REMOVE_MISCELLANEOUS_EXPENSE: "Remove miscellaneous expense",
  EDIT_SALARY_WAGES_EXPENSE: "Edit salary, Wages expense",
  REMOVE_SALARY_WAGES_EXPENSE: "Remove salary, Wages expense",
  EDIT_SOFTWARE_EXPENSE: "Edit software expense",
  REMOVE_SOFTWARE_EXPENSE: "Remove software expense",
  EDIT_SUPPLIES_EXPENSE: "Edit supplies expense",
  REMOVE_SUPPLIES_EXPENSE: "Remove supplies expense",
  EDIT_UTILITY_MAINTENANCE_EXPENSE: "Edit utility, Maintenance expense",
  REMOVE_UTILITY_MAINTENANCE_EXPENSE: "Remove utility, Maintenance expense",

  // Invoice
  SHOWS_RECENT_AND_RETURN_INVOICE: "Shows recent and return invoice",
  SHOWS_CARD_DATA_OF_INVOICE: "Shows card data of invoice",
  CANCEL_INVOICE: "Cancel Invoice",
  RETURN_INVOICE: "Return Invoice",
  COMPLETE_INVOICE: "Complete Invoice",

  // Receipt
  SHOWS_RECEIPT_CARD_DATA: "Shows receipt card data",
  CANCEL_RECEIPT: "Cancel receipt",

  // Penalty and Adjustment
  SHOWS_ALL_ADJUSTMENTS: "Shows all adjustments",
  CANCEL_PENALTY: "Cancel penalty",

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

  // Attendance Management
  GET_ATTENDANCE_STATS: "Get Attendance Stats",
  GET_SECTION_BY_CLASS: "Get Section by Class",
  MARK_ATTENDANCE: "Mark Attendance",
  GET_YEARLY_ATTENDANCE_FOR_STUDENT: "Get Yearly Attendance for Student",

  // Quiz Management
  CREATE_QUIZ: "Create Quiz",
  UPDATE_QUIZ: "Update Quiz",
  ADD_QUESTION_TO_QUIZ: "Add Question to Quiz",
  DELETE_QUIZ: "Delete Quiz",
  GET_QUIZ_BY_ID: "Get Quiz by ID",
  ASSIGN_QUIZ_GRADE: "Assign Quiz Grade",
};
