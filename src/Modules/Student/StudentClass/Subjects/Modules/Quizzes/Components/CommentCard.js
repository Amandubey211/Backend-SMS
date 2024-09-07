import { FaEdit } from "react-icons/fa";

const CommentCard = ({ avatar, name, timestamp, comment }) => {
  return (
    <div className="max-w-sm p-4 bg-white border-y   mb-4">
      <div className="flex items-center mb-2">
        <img
          src={avatar}
          alt={`${name} avatar`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="flex items-center">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <FaEdit className="ml-2 text-green-500 cursor-pointer" />
          </div>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
      </div>
      <p className="text-gray-700 text-sm">{comment}</p>
    </div>
  );
};

export default CommentCard;
