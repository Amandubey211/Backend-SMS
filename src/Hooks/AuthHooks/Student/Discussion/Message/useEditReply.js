

import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const useEditReply = (comments, setComments) => {
  const editReply = async (replyId, newText) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/editCommentDiscussion/${replyId}`,
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
        throw new Error(`Failed to edit reply, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        const updateReplyRecursively = (comments) =>
          comments.map((comment) =>
            comment.replies
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === replyId ? { ...reply, text: newText } : reply
                  ),
                }
              : comment
          );

        setComments((prevComments) => updateReplyRecursively(prevComments));
      }
    } catch (error) {
      console.error("Error editing reply:", error);
      toast.error("Failed to edit reply.");
    }
  };

  return { editReply };
};
