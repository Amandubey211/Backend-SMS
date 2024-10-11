import React, { useState } from "react";

const InputComment = ({
  onAddComment,
  placeholder = "Write a comment...",
  initialText = "",
}) => {
  const [text, setText] = useState(initialText);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText(""); // Reset the input field after adding the comment
    }
  };

  return (
    <div className="input-comment">
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full py-2 pl-4 pr-20 text-sm border-none rounded-full focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 ml-2 text-white bg-blue-500 rounded-full"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InputComment;
