
import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const useDeleteComment = (comments, setComments) => {
  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/deleteCommentDiscussion/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authentication: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment, status: ${response.status}`);
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success("Comment Deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return { deleteComment };
};



