import React, { useState } from 'react';
import FormInput from "../../../Accounting/subClass/component/FormInput";
import FormSelect from '../../../Accounting/subClass/component/FormSelect';

const AddIssue = () => {
    const [issueData, setIssueData] = useState({
        class: '',
        section: '',
        student: '',
        category: '',
        book: '',
        authorName: '',
        issueDate: '',
        returnDate: '',
        status: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setIssueData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Issue data to submit:', issueData);
        // Implement submission logic here
    };

    return (
        <div className="p-4 bg-gray-50 border rounded-lg overflow-auto" style={{ maxHeight: '90vh' }}>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <FormSelect 
                    id="class" 
                    label="Class" 
                    options={[{ value: "10", label: "10" }, { value: "9", label: "9" }]}
                    value={issueData.class}
                    onChange={handleInputChange} 
                />
                <FormSelect 
                    id="section" 
                    label="Section" 
                    options={[{ value: "A", label: "A" }, { value: "B", label: "B" }]}
                    value={issueData.section}
                    onChange={handleInputChange} 
                />
                <FormInput 
                    id='student' 
                    label='Student' 
                    value={issueData.student}
                    onChange={handleInputChange} 
                />
                <FormSelect 
                    id="category" 
                    label="Category" 
                    options={[{ value: "History", label: "History" }, { value: "Science", label: "Science" }]}
                    value={issueData.category}
                    onChange={handleInputChange} 
                />
                <FormInput 
                    id='book' 
                    label='Book' 
                    value={issueData.book}
                    onChange={handleInputChange} 
                />
                <FormInput 
                    id='authorName' 
                    label='Author Name' 
                    value={issueData.authorName}
                    onChange={handleInputChange} 
                />
                      <FormInput id="dueDate" label="Due Date" type="date" value={issueData.issueDate} onChange={handleInputChange} required />
                      <FormInput id="dueDate" label="Due Date" type="date" value={issueData.returnDate} onChange={handleInputChange} required />

               
               
                <FormSelect 
                    id="status" 
                    label="Status" 
                    options={[{ value: "Pending", label: "Pending" }, { value: "Returned", label: "Returned" }]}
                    value={issueData.status}
                    onChange={handleInputChange} 
                />
                <button 
                    type="submit"
                    className="mt-4 w-full p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                    Add Book Issue
                </button>
            </form>
        </div>
    );
};

export default AddIssue;
