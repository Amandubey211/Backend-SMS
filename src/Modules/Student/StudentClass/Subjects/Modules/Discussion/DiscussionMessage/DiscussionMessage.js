//this is coorect 👇

//----------

//   import React,{ useEffect, useState } from "react";
// import CommentSection from "./CommentSection";
// import CommentsHeader from "./Components/CommentsHeader";
// import InputComment from "./Components/InputComment";
// import { useParams } from "react-router-dom";
// import { baseUrl } from "../../../../../../../config/Common";
// import toast from "react-hot-toast";
// import { ImSpinner3 } from "react-icons/im";
// import { FaExclamationTriangle } from "react-icons/fa";

// import useFetchCommentsByDiscussion from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useFetchCommentsByDiscussion";
// import useAddComment from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useAddComment";
// import useAddReply from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useAddReply";
// import useDeleteComment from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useDeleteComment";
// import useDeleteReply from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useDeleteReply";
// import useEditReply from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useEditReply";
// import useToggleLikeMessage from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useToggleLikeMessage";
// import useEditComment from "../../../../../../../Hooks/AuthHooks/Student/Discussion/Message/useEditComment";

// const DiscussionMessage = () => {
//   const { comments, loading, error,fetchComments } = useFetchCommentsByDiscussion();
//   const { addComment } = useAddComment();
//   const { addReply } = useAddReply();
//   const { deleteComment } = useDeleteComment();
//   const { deleteReply } = useDeleteReply();
//   const { editReply } = useEditReply();
//   const { editComment} = useEditComment();
//   const {  toggleLikeMessage:toggleLike } = useToggleLikeMessage();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeReplyId, setActiveReplyId] = useState(null);
//   const [activeReplyParentId, setActiveReplyParentId] = useState(null);
//   const handleAddComment = async (text) => {
//     if (text.trim()) {
//       try {
//         const newComment = await addComment(text);
//         fetchComments();  // Assuming refetch will re-fetch all comments including the new one
//         toast.success('Comment added!');
//       } catch (error) {
//         toast.error('Failed to add comment.');
//       }
//     }
//   };
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const filterCommentsRecursively = (comments, query) => {
//     return comments.filter((comment) => {
//       const author = comment.author ? comment.author.toLowerCase() : "";
//       const isAuthorMatch = author.includes(query.toLowerCase());
//       const isReplyMatch = comment.replies?.some((reply) =>
//         filterCommentsRecursively([reply], query).length > 0
//       );
//       return isAuthorMatch || isReplyMatch;
//     });
//   };

//   const filteredComments = filterCommentsRecursively(comments, searchQuery);

//   return (
//     <div className="h-screen flex flex-col">
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//           <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
//           <p className="text-lg font-semibold">Loading comments...</p>
//         </div>
//       ) : error ? (
//         <div className="flex flex-col items-center justify-center py-10 text-gray-500">
//           <FaExclamationTriangle className="w-12 h-12 mb-3" />
//           <p className="text-lg font-semibold">{error}</p>
//         </div>
//       ) : (
//         <>
//           <div className="flex-none h-[10%]">
//             <CommentsHeader handleSearch={handleSearch} />
//           </div>
//           <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
//             <CommentSection
//               comments={filteredComments}
//               deleteComment={deleteComment}
//               deleteReply={deleteReply}
//               addNestedReply={addReply}
//               activeReplyId={activeReplyId}
//               setActiveReplyId={setActiveReplyId}
//               activeReplyParentId={activeReplyParentId}
//               setActiveReplyParentId={setActiveReplyParentId}
//               toggleLike={toggleLike}
//               editReply={editReply}
//               editComment={editComment}
//             />
//           </div>
//           <div className="flex-none h-[15%]">
//             <InputComment addComment={handleAddComment} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DiscussionMessage;

//this is also coorect 👆

import React, { useEffect, useState } from "react";
import CommentSection from "./CommentSection";
import CommentsHeader from "./Components/CommentsHeader";
import InputComment from "./Components/InputComment";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../../../../config/Common";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";
import { FaExclamationTriangle } from "react-icons/fa";

const DiscussionMessage = ({ discussion }) => {
  const { _id } = useParams();
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${baseUrl}/admin/getDiscussionComment/${discussion._id}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch comments, status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("discussion comments", data);

        if (data.status) {
          const formattedComments = data.data.map((comment) => ({
            id: comment._id,
            author: comment.createdBy, // Ensure this is consistently used
            role: comment.role,
            time: new Date(comment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: comment.content,
            likes: comment.likes.length,
            avatarUrl: comment.profile,
            replies: formatReplies(comment.replies),
            isUserCreated: false,
          }));
          console.log("Formatted Comments:", formattedComments);

          setComments(formattedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [discussion._id]);
  const addComment = async (text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentDiscussion/${discussion._id}/replies`,
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
      if (data.status) {
        const newComment = {
          id: data.data._id,
          author: data.data.createdBy,
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

  const addNestedReply = async (id, text) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/createCommentDiscussion/${discussion._id}/replies`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text, parentId: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add reply, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        const newReply = {
          id: data.data._id,
          author: data.data.createdBy,
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

        const addReplyRecursively = (comments) => {
          return comments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                replies: [newReply, ...comment.replies],
              };
            } else if (comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments(addReplyRecursively(comments));
        setActiveReplyId(null);
        setActiveReplyParentId(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/deleteCommentDiscussion/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authentication: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete comment, status: ${response.status}`);
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success("Comment Deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  //           Authentication: token,

  const deleteReply = async (commentId, replyId) => {
    try {
      console.log(
        `Attempting to delete reply with ID: ${replyId} from comment with ID: ${commentId}`
      );

      const token = localStorage.getItem("student:token");
      const deleteUrl = `${baseUrl}/admin/deleteCommentDiscussion/${replyId}`;
      console.log(`Delete URL: ${deleteUrl}`); // Log the request URL to verify it's correct

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authentication: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reply, status: ${response.status}`);
      }

      // Update the comments state to remove the deleted reply
      setComments((currentComments) =>
        currentComments.map((comment) => {
          if (comment.id === commentId) {
            // Only update the replies of the comment that contains the deleted reply
            const updatedReplies = comment.replies.filter(
              (reply) => reply.id !== replyId
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );

      toast.success("Reply Deleted Successfully");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error(`Failed to delete reply: ${error.message}`);
    }
  };

  const formatReplies = (replies) => {
    return replies.map((reply) => ({
      id: reply._id,
      author: reply.createdBy, // Ensure this is consistently used
      role: reply.role,
      time: new Date(reply.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: reply.content,
      likes: reply.likes.length,
      avatarUrl: reply.profile,
      replies: reply.replies ? formatReplies(reply.replies) : [],
      isRead: reply.isRead,
    }));
  };

  const toggleLike = async (id) => {
    try {
      const token = localStorage.getItem("student:token");
      const url = `${baseUrl}/admin/likeDiscussions/${id}`; // Adjust URL if needed

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

        setComments((prevComments) => {
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

          return updateLikesRecursively(prevComments);
        });
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

  const editComment = async (commentId, newText) => {
    try {
      const token = localStorage.getItem("student:token");
      const response = await fetch(
        `${baseUrl}/admin/editCommentDiscussion/${commentId}`,
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
        throw new Error(`Failed to edit comment, status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, text: newText } : comment
          )
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment.");
    }
  };

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filterCommentsRecursively = (comments, query) => {
    return comments.filter((comment) => {
      const author = comment.author ? comment.author.toLowerCase() : "";
      const isAuthorMatch = author.includes(query.toLowerCase());
      const isReplyMatch = comment.replies?.some(
        (reply) => filterCommentsRecursively([reply], query).length > 0
      );
      return isAuthorMatch || isReplyMatch;
    });
  };

  const filteredComments = filterCommentsRecursively(comments, searchQuery);
  console.log("Filtered Comments:", filteredComments);

  return (
    <div className="h-screen flex flex-col">
      {loading ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <ImSpinner3 className="w-12 h-12 animate-spin mb-3" />
            <p className="text-lg font-semibold">Loading comments...</p>
          </div>
        </>
      ) : error ? (
        <>
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <FaExclamationTriangle className="w-12 h-12 mb-3" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex-none h-[10%]">
            <CommentsHeader handleSearch={handleSearch} />
          </div>
          <div className="h-[70%] overflow-y-scroll no-scrollbar px-6">
            <CommentSection
              comments={filteredComments}
              deleteComment={deleteComment}
              deleteReply={deleteReply}
              addNestedReply={addNestedReply}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              activeReplyParentId={activeReplyParentId}
              setActiveReplyParentId={setActiveReplyParentId}
              toggleLike={toggleLike}
              editComment={editComment} // Pass editComment
              editReply={editReply}
            />
          </div>
          <div className="flex-none h-[15%]">
            <InputComment addComment={addComment} />
          </div>
        </>
      )}
    </div>
  );
};

export default DiscussionMessage;
