import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import CommentsHeader from './Components/CommentsHeader';
import InputComment from './Components/InputComment';
import dummycomments from './dummyData';

const DiscussionMessage = () => {
  const [comments, setComments] = useState(dummycomments);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);

  const addComment = (text) => {
    const newComment = {
      id: comments.length + 1,
      author: 'New User',
      role: null,
      time: 'Just now',
      text: text,
      likes: 0,
      avatarUrl: '',
      replies: [],
      isUserCreated: true,
    };
    setComments([newComment, ...comments]);
  };

  const addNestedReply = (id, text, isReplyToReply = false) => {
    const newReply = {
      id: Date.now(),
      author: 'New User',
      role: null,
      time: 'Just now',
      text: text,
      likes: 0,
      avatarUrl: '',
      replies: [],
      isUserCreated: true,
    };

    const addReplyRecursively = (comments) => {
      return comments.map(comment => {
        if (comment.id === id && !isReplyToReply) {
          return {
            ...comment,
            replies: [newReply, ...comment.replies]
          };
        } else if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyRecursively(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(addReplyRecursively(comments));
    setActiveReplyId(null); // Reset active reply ID after adding a reply
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const deleteReply = (commentId, replyId) => {
    const deleteReplyRecursively = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== replyId)
          };
        } else if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: deleteReplyRecursively(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(deleteReplyRecursively(comments));
  };

  const filteredComments = comments.filter((comment) => {
    const searchInComment = comment.author
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const searchInReplies = comment.replies.some((reply) =>
      reply.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return searchInComment || searchInReplies;
  });

  return (
    <div className="h-screen flex flex-col">
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
        />
      </div>
      <div className="flex-none h-[15%]">
        <InputComment addComment={addComment} />
      </div>
    </div>
  );
};

export default DiscussionMessage;
