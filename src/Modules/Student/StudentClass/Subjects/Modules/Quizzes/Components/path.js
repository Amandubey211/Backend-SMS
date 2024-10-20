
 export  const getItemName = (item) => item?.name;

 export const getItemDetails = (item) =>
    `Total Points: ${item?.totalPoints} | Type: ${item?.quizType}`;

 export const navLinkPath = (cid, sid, item) =>
    `/student_class/${cid}/${sid}/quizzes/${item?._id}/view`;
 