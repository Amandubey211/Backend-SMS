

import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const useEditComment = (comments, setComments) => {
  const editComment = async (commentId, newText) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/editCommentDiscussion/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newText }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit comment, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, text: newText } : comment
          )
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment.");
    }
  };

  return { editComment };
};
