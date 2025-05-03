import Sidebar from "../Common/Sidebar";

const HelperSidebarForm = ({ isOpen, isEditing, helperData, sethelperData, handleChange, handleSubmit, resetForm, vehicles }) => {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    return (
        <Sidebar
            isOpen={isOpen}
            onClose={() => {
                resetForm();
            }}
            title={isEditing ? "Edit Helper" : "Add Helper"}
            width="50%"
        >
            <div className="p-4 max-h-screen overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form sections */}
                    <div className="bg-purple-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-purple-800 mb-3">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={helperData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="helperBadgeNumber"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Badge Number
                                </label>
                                <input
                                    type="text"
                                    id="helperBadgeNumber"
                                    name="helperBadgeNumber"
                                    value={helperData.helperBadgeNumber}
                                    onChange={handleChange}
                                    placeholder="Enter badge number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Gender *
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={helperData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    required
                                >
                                    <option value="" disabled>
                                        Select gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="religion"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Religion
                                </label>
                                <input
                                    type="text"
                                    id="religion"
                                    name="religion"
                                    value={helperData.religion}
                                    onChange={handleChange}
                                    placeholder="Enter religion"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="dateOfBirth"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={helperData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="bloodGroup"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Blood Group
                                </label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    value={helperData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="" disabled>
                                        Select blood group
                                    </option>
                                    {bloodGroups.map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-blue-800 mb-3">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={helperData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="contactNumber"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contact Number *
                                </label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={helperData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="emergencyContact"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    id="emergencyContact"
                                    name="emergencyContact"
                                    value={helperData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Enter emergency contact"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={helperData.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-green-800 mb-3">
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="national_Id"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    National ID
                                </label>
                                <input
                                    type="text"
                                    id="national_Id"
                                    name="national_Id"
                                    value={helperData.national_Id}
                                    onChange={handleChange}
                                    placeholder="Enter national ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="joiningDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    id="joiningDate"
                                    name="joiningDate"
                                    value={helperData.joiningDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="resignationDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Resignation Date
                                </label>
                                <input
                                    type="date"
                                    id="resignationDate"
                                    name="resignationDate"
                                    value={helperData.resignationDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="policeVerificationDone"
                                    name="policeVerificationDone"
                                    checked={helperData.policeVerificationDone}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="policeVerificationDone"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Police Verification Done
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-yellow-800 mb-3">
                            Assignment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={helperData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="assignedBus"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Assigned Bus
                                </label>
                                <select
                                    id="assignedBus"
                                    name="assignedBus"
                                    value={helperData.assignedBus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="">Not Assigned</option>
                                    {vehicles?.map((vehicle, index) => (
                                        <option key={vehicles._id} value={vehicle}>
                                            {vehicle?.vehicleNumber} ({vehicle?.vehicleType})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded-md mb-4">
                        <h3 className="text-md font-medium text-red-800 mb-3">
                            Document Upload
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label
                                    htmlFor="photo"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Helper Photo
                                </label>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="documents"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Additional Documents (License copy, ID proof, etc.)
                                </label>
                                <input
                                    type="file"
                                    id="documents"
                                    name="documents"
                                    multiple
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    You can select multiple files. Accepted formats: PDF,
                                    JPG, PNG (max 5MB each)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            {isEditing ? "Update Helper" : "Add Helper"}
                        </button>
                    </div>
                </form>
            </div>
        </Sidebar>
    );
};

export default HelperSidebarForm;