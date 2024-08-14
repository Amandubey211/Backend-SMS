import { useState } from "react";
import { baseUrl } from "../../../../../config/Common";

export const useAddComment = (announcementId, comments, setComments) => {
  const addComment = async (text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentAnnouncement/${announcementId}/replies`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, parentId: null }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add comment, status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data in newComment", data);

      if (data.status) {
        const newComment = {
          id: data.data._id,
          author: data.data.createdBy,
          authorID: data.data.createdById, //added next
          role: data.data.role,
          time: new Date(data.data.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: data.data.content,
          likes: data.data.likes.length,
          avatarUrl: data.data.profile,
          replies: [],
          isUserCreated: true,
        };
        setComments([newComment, ...comments]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return { addComment };
};
