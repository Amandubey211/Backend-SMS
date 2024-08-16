
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const useDeleteReply = (comments, setComments) => {
  const deleteReply = async (commentId, replyId) => {
    try {
      const token = localStorage.getItem("student:token");
      const deleteUrl = `${baseUrl}/admin/deleteCommentDiscussion/${replyId}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authentication: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reply, status: ${response.status}`);
      }

      setComments((currentComments) =>
        currentComments.map((comment) => {
          if (comment.id === commentId) {
            const updatedReplies = comment.replies.filter(
              (reply) => reply.id !== replyId
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );

      toast.success("Reply Deleted Successfully");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error(`Failed to delete reply: ${error.message}`);
    }
  };

  return { deleteReply };
};
