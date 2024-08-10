import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../config/Common";

const useMoveModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams(); // Assuming subjectId is in the URL params

  const moveModule = useCallback(
    async (moduleId, newIndex) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authentication: token,
          },
        };

        const response = await axios.put(
          `${baseUrl}/admin/subjects/${sid}/modules/reorder`,
          { moduleId, newIndex },
          config
        );

        const { data } = response;
        if (data.success) {
          setSuccess(data.msg);
          toast.success(data.msg);
        } else {
          throw new Error(data.msg || "Failed to move module.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || err.message || "Error moving module";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, sid]
  );

  return { loading, error, success, moveModule };
};

export default useMoveModule;
