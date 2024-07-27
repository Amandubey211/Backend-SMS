import { useState } from "react";
import { baseUrl } from "../../../../config/Common";

const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAsRead = async (discussionId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${baseUrl}/student/markAsRead/${discussionId}`,
        {
          method: "POST",
          headers: {
            Authentication: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark as read, status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { markAsRead, loading, error };
};

export default useMarkAsRead;
