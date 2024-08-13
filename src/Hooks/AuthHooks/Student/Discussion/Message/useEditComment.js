import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";
import { useParams } from "react-router-dom";

const useEditComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { role } = useSelector((store) => store.Auth);
    const { dis: discussionId } = useParams();
  
    const editComment = useCallback(
      async (commentId, content) => {
        setLoading(true);
        setError(null);
  
        try {
          const token = localStorage.getItem(`${role}:token`);
          const response = await axios.put(
            `${baseUrl}/admin/editCommentDiscussion/${commentId}`,
            { content },
            {
              headers: { Authentication: token },
            }
          );
  
          if (response.data.status) {
            toast.success("Comment edited successfully");
            return response.data.data; // Return the updated comment data
          } else {
            toast.error("Failed to edit comment");
            setError("Failed to edit comment");
          }
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || "Error editing comment";
          toast.error(errorMessage);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      },
      [discussionId, role]
    );
  
    return { loading, error, editComment };
  };
  
  export default useEditComment;