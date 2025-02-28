import React, { useState, useRef, useEffect } from "react";
import { FaRegSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";

const emojis = ["😀", "😂", "😍", "😢", "😡"];

const InputComment = ({ addComment, placeholder = "Write Something..." }) => {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const timeoutRef = useRef(null);
  const emojiListRef = useRef(null);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addComment(text);
      setText("");
    }
  };

  const handleEmojiClick = (emoji) => {
    setText(text + emoji);
  };

  const handleMouseEnter = () => {
    setShowEmojis(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowEmojis(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleEmojiListMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleEmojiListMouseLeave = () => {
    setShowEmojis(false);
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
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* <FaRegSmile className="text-gray-500 text-lg cursor-pointer mx-1" />
          <FaPaperclip className="text-gray-500 text-lg cursor-pointer mx-1" /> */}
        </div>
        {/* {showEmojis && (
          <div
            className="absolute right-10 bottom-full mb-2 flex space-x-2 bg-white p-2 rounded shadow-md transition-opacity duration-300 ease-in-out transform opacity-100 animate-slide-in"
            onMouseEnter={handleEmojiListMouseEnter}
            onMouseLeave={handleEmojiListMouseLeave}
            ref={emojiListRef}
          >
            {emojis?.map((emoji, index) => (
              <span
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="cursor-pointer hover:animate-bounce  transform transition-transform duration-300 ease-in-out hover:scale-125"
              >
                {emoji}
              </span>
            ))}
          </div>
        )} */}
      </form>
      <button
        onClick={handleAddComment}
        type="submit"
        className="flex items-center justify-center w-10 h-10 ml-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full focus:outline-none"
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default InputComment;
