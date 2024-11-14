import { getAY } from "../academivYear";
import { classId, userId } from "../localStorage/stdLocalStorage";

const say=getAY();


// GET request

// std Library
export const stdLibraryBooks=`/admin/all/book?say=${say}`;
export const stdBookIssued= `/student/issue/books?say=${say}`;

// std Finance
export const stdFinance=`/student/my_fees?say=${say}`;

// std Noticeboard
export const stdEvents=`/admin/all/events?say=${say}`;
export const stdNotices=`/admin/all/notices?say=${say}`;

// std Dashboard 
export const stdCardDashbord=`/api/studentDashboard/dashboard/student?say=${say}`;
export const stdSubjectDashboard=`/api/studentDashboard/subjects/${userId}?say=${say}`;
export const stdTaskDashboard=`/admin/task/student/${userId}?say=${say}`;
export const stdGradeDashboard=`/admin/grades/student/${userId}/class/${classId}?say=${say}`;