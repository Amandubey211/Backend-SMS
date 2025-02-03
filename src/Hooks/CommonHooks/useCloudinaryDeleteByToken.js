import { useCallback } from "react";

function useCloudinaryDeleteByToken() {
  const deleteMediaByToken = useCallback(async (deleteToken) => {
    try {
      const cloudName = process.env.REACT_APP_CLOUD_NAME;
      if (!cloudName) {
        throw new Error(
          "REACT_APP_CLOUD_NAME environment variable is not set."
        );
      }
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: deleteToken }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete by token error:", error);
      throw error;
    }
  }, []);

  return { deleteMediaByToken };
}

export default useCloudinaryDeleteByToken;
