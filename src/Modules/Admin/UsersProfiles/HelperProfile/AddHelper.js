import React, { useState } from "react";
import ImageUpload from "../../Addmission/Components/ImageUpload";
// import ImageUpload from "../../Addmission/Components/ImageUpload";
import FormInput from "../../Accounting/subClass/component/FormInput";
import FormSelect from "../../Accounting/subClass/component/FormSelect";
import Layout from '../../../../Components/Common/Layout';
import DashLayout from '../../../../Components/Admin/AdminDashLayout';

const AddHelper = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [helperData, setHelperData] = useState({
        name: "",
        dob: "",
        gender: "",
        salary: "",
        phone: "",
        email: "",
        address: "",
        helperImage: null,
    });

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHelperData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setHelperData((prev) => ({
                ...prev,
                helperImage: file,
            }));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setHelperData((prev) => ({
            ...prev,
            helperImage: null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("Helper data to submit:", helperData);
        // Implement submission logic here
    };

    return (
        <div
            className="p-4 bg-gray-50 h-full border rounded-lg overflow-auto"
            style={{ maxHeight: "90vh" }}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col justify-around gap-5">
                    <div className="flex flex-row justify-around p-2 border-b border-gray-200">
                        <div>
                            <div className="image-upload-container">
                                <ImageUpload
                                    imagePreview={imagePreview}
                                    handleImageChange={handleImageChange}
                                    handleRemoveImage={handleRemoveImage}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <FormInput
                                id="name"
                                name="name"
                                label="Name"
                                value={helperData.name}
                                onChange={handleInputChange}
                            />
                            <FormInput
                                id="dob"
                                name="dob"
                                label="Date of Birth"
                                type="date"
                                value={helperData.dob}
                                onChange={handleInputChange}
                            />
                            <FormSelect
                                id="gender"
                                name="gender"
                                label="Gender"
                                options={genderOptions}
                                value={helperData.gender}
                                onChange={handleInputChange}
                            />
                            <FormInput
                                id="salary"
                                name="salary"
                                label="Salary"
                                type="number"
                                value={helperData.salary}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <h1 className="font-medium underline">Address</h1>
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-5">
                            <FormInput
                                id="phone"
                                name="phone"
                                label="Phone"
                                value={helperData.phone}
                                onChange={handleInputChange}
                            />
                            <FormInput
                                id="email"
                                name="email"
                                label="Email"
                                value={helperData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <FormInput
                                id="address"
                                name="address"
                                label="Address"
                                value={helperData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-10 rounded-md hover:from-pink-600 hover:to-purple-600"
                >
                    Add New Helper
                </button>
            </form>
        </div>
    );
};

export default AddHelper;
