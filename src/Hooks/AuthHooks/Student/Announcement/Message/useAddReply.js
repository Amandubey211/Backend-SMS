import { baseUrl } from "../../../../../config/Common";

export const useAddReply = (
  announcementId,
  comments,
  setComments,
  setActiveReplyId,
  setActiveReplyParentId
) => {
  const addNestedReply = async (id, text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, parentId: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add reply, status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data in newReply", data);

      if (data.status) {
        const newReply = {
          id: data.data._id,
          author: data.data.createdBy,
          authorID: data.data.createdById, //added next
          role: data.data.role,
          time: new Date(data.data.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: data.data.content,
          likes: data.data.likes.length,
          avatarUrl: data.data.profile,
          replies: [],
          isUserCreated: true,
        };

        const addReplyRecursively = (comments) => {
          return comments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                replies: [newReply, ...comment.replies],
              };
            } else if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments(addReplyRecursively(comments));
        setActiveReplyId(null);
        setActiveReplyParentId(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return { addNestedReply };
};
