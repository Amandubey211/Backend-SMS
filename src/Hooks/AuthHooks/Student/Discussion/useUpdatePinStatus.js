import { useState } from "react";
import { baseUrl } from "../../../../config/Common";

const useUpdatePinStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePinStatus = async (discussionId, isPinned) => {
    setLoading(true);
    try {
      // not in use
      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${baseUrl}//discussion/pinstatus/${discussionId}`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPinned }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update pin status, status: ${response.status}`
        );
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { updatePinStatus, loading, error };
};

export default useUpdatePinStatus;
