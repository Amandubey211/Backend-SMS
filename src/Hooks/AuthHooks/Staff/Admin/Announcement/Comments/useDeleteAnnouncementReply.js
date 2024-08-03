import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useDeleteAnnouncementComment = () => {
  const { role } = useSelector((store) => store.Auth);

  const deleteComment = useCallback(
    async (commentId) => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${baseUrl}/admin/deleteCommentannouncement/${commentId}`,
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Comment deleted successfully");
        } else {
          toast.error("Failed to delete comment");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error deleting comment";
        toast.error(errorMessage);
      }
    },
    [role]
  );

  return { deleteComment };
};

export default useDeleteAnnouncementComment;
