// BookIssueRow.js
import React from 'react';

const BookIssueRow = ({ item }) => {
    return (
        <tr className="text-left text-gray-700 bg-gray-100">
            {/* <td className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center">
                    <img src={item.image} alt="Profile" className="h-8 w-8 rounded-full mr-2"/>
                    <span>{item.studentName}</span>
                </div>
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                <div className="text-base">class-{item.classLevel}</div>
                <div className="text-[12px]">section-{item.section}</div>
            </td> */}
            <td className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center">
                    <img src={item.image} alt="Profile" className="h-8 w-8 mr-2"/>
                    <div className="flex flex-col">
                        <span>{item.bookTitle}</span>
                        <span className="text-[12px] text-green-600">{item.category}</span>
                    </div>
                </div>
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                {item.author}
            </td>
            <td className="px-5 py-2 border-b border-gray-200">
                <div>Issue: {item.issueDate}</div>
                <div>Return: {item.dueDate}</div>
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
