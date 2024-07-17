// BookIssueRow.js
import React from 'react';

const BookIssueRow = ({ item }) => {
    console.log("Book is Item", item)
    return (
        <tr className="text-left text-gray-700 bg-gray-100">
           
            <td className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center">
                <div className="rounded-full border border-gray-300">
                    <img src={item.image} alt="Profile" className="h-8 w-8 mr-2 rounded-full" />
                </div>

                    <div className="flex flex-col">
                        <span>{item.author}</span>
                        <span className="text-[12px] text-green-600">{item.author}</span>
                    </div>
                </div>
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                {item.author}
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                <div>{item.issueDate}</div>
                <div> {item.returnDate}</div>
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.status === "Paid" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                    {item.status}
                </span>
            </td>
           
        </tr>
    );
};

export default BookIssueRow;
