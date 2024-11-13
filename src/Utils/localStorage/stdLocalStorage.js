const persistUserString = localStorage.getItem("persist:user");
const persistUserObject = JSON.parse(persistUserString);
const userDetails = JSON.parse(persistUserObject.userDetails);
export const userId = userDetails.userId;

export const classId = localStorage.getItem("classId");