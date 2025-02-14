import React, { useState, useEffect, useRef } from "react";
import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";

const emojis = ["😀", "😂", "😍", "😢", "😡"];

const AnnouncementInputComment = ({
  addComment,
  placeholder = "Write Something...",
  initialText = "",
  onChange,
}) => {
  const [text, setText] = useState(initialText);
  const [showEmojis, setShowEmojis] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setText(initialText); // Sync initial text if it changes
  }, [initialText]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addComment(text);
      setText("");
    }
  };

  const handleEmojiClick = (emoji) => {
    const newText = text + emoji;
    setText(newText);
    if (onChange) {
      onChange(newText); // Notify parent of change
    }
  };

  return (
    <div className="flex items-center p-1 bg-white mb-3 rounded-full border border-gray-300 relative">
      <form onSubmit={handleAddComment} className="relative flex-grow">
        <input
          type="text"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full py-2 pl-4 pr-20 text-sm border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {/* <FaRegSmile className="text-gray-500 text-lg cursor-pointer mx-1" />
          <FaPaperclip className="text-gray-500 text-lg cursor-pointer mx-1" /> */}
        </div>
        {showEmojis && (
          <div className="absolute right-10 bottom-full mb-2 flex space-x-2 bg-white p-2 rounded shadow-md">
            {emojis?.map((emoji, index) => (
              <span
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="cursor-pointer"
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </form>
      <button
        onClick={handleAddComment}
        type="submit"
        className="flex items-center justify-center w-10 h-10 ml-2 text-white bg-pink-500 rounded-full"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default AnnouncementInputComment;
