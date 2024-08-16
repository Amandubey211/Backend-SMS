import { baseUrl } from "../../../../../config/Common";
import toast from "react-hot-toast";

export const useToggleLikeMessage = (comments, setComments) => {
  const toggleLike = async (id) => {
    try {
      const token = localStorage.getItem("student:token");
      const url = `${baseUrl}/admin/likeDiscussions/${id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authentication: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle like, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        const updatedItem = data.data;

        const updateLikesRecursively = (comments) => {
          return comments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                likes: updatedItem.likes.length,
              };
            } else if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateLikesRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments(updateLikesRecursively(comments));
        return updatedItem;
      } else {
        throw new Error("Failed to toggle like: " + data.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like.");
      throw error;
    }
  };

  return { toggleLike };
};
