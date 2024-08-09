import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useEditAnnouncementComment = () => {
  const { role } = useSelector((store) => store.Auth);

  const editComment = useCallback(
    async (commentId, newContent) => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.put(
          `${baseUrl}/admin/editCommentAnnouncement/${commentId}`,
          { content: newContent },
          {
            headers: { Authentication: token },
          }
        );

        if (response.data.status) {
          toast.success("Comment edited successfully");
          return response.data.data; // Return updated comment
        } else {
          toast.error("Failed to edit comment");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error editing comment";
        toast.error(errorMessage);
      }
    },
    [role]
  );

  return { editComment };
};

export default useEditAnnouncementComment;
