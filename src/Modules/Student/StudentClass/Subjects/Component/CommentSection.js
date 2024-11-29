import React from 'react';
import emojiIcon from '../../../../../Assets/StudentAssets/emoji.svg';
import docUploadIcon from '../../../../../Assets/StudentAssets/uploadDoc.svg';


const comments = [
  {
    id: 1,
    name: "Leslie Alexander",
    date: "Fab/02",
    time: "09:02",
    comment: "Hi Sir Lorem ipsum dolor sit amet tetur adipiscing elit, seLorem ipsum",
    avatar: "https://via.placeholder.com/40" // Dummy avatar URL
  },
  {
    id: 2,
    name: "Leslie Alexander",
    date: "Fab/02",
    time: "09:02",
    comment: "Hi Sir Lorem ipsum dolor sit amet tetur adipiscing elit, seLorem ipsum",
    avatar: "https://via.placeholder.com/40" // Dummy avatar URL
  }
];



const CommentSection = () => {
  return (
    <div className="mt-6">
      <hr className="border-gray-200 mb-4"/>
      <h3 className="mb-4 text-lg font-semibold text-gray-700">Comments</h3>
      {comments?.map((comment) => (
        <div key={comment.id} className="mb-4">
          <div className="flex items-center mb-2">
            <img src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full mr-2" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{comment.name}</p>
              <p className="text-sm text-gray-500">{comment.date} / {comment.time}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{comment.comment}</p>
        </div>
      ))}
      <div className="border-t pt-4">
        <div className="relative mb-2">
          <div className="flex items-start border border-gray-300 rounded-md p-2 text-sm bg-white">
            <textarea
              className="w-full border-none focus:ring-0 focus:outline-none resize-none h-24"
              placeholder="Write Something"
              style={{ paddingLeft: '0.5rem' }} // Add padding to the left
            />
            <div className="absolute right-2 bottom-2 flex items-center">
              <img src={emojiIcon} alt="Emoji" className="w-5 h-5 mr-2"/>
              <img src={docUploadIcon} alt="Document Upload" className="w-5 h-5"/>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm px-6 py-2 rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};


export default CommentSection;
