// BookIssueRow.js
import React from 'react';

const BookIssueRow = ({ item }) => {
    console.log("Book is Item", item)

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };
    
    return (
        <tr className="text-left text-gray-700 ">

            <td className="px-5 py-3 border-b border-gray-100">
                <div className="flex items-center">
                    <div className="rounded-full border border-gray-100">
                        <img src={item.bookId.image} alt="Profile" className="h-8 w-8 rounded-full" />
                    </div>

                    <div className="flex flex-col ml-2">
                        <span>{item.bookId.name}</span>
                    </div>
                </div>
            </td>
            <td className="px-5 py-2 border-b border-gray-100">
                {item.author}
            </td>
            <td className="px-5 py-2 border-b border-gray-100">
                {item.bookId.category}
            </td>
            <td className="px-5 py-2 border-b border-gray-100">
                <div>{formatDate(item.issueDate)}</div>
            </td>
            <td className="px-5 py-2 border-b border-gray-100">
                <div> {formatDate(item.returnDate)}</div>
            </td>
            <td className="px-5 py-2 border-b border-gray-100">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.status === "Return" ? "bg-green-200 text-green-800" : "bg-red-200 text-gray-800"}`}>
                    {item.status}
                </span>
            </td>

        </tr>
    );
};

export default BookIssueRow;
