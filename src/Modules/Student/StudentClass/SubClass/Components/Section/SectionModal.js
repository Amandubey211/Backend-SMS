import React from "react";
import { FaUserFriends } from "react-icons/fa"; // Using FontAwesome for group icon

const SectionGroupModal = ({ modalData}) => {
    return (
     
            <div className="p-4">
                {/* Section Name */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purple-500">Section Name</h3>
                    <p className="text-md text-gray-700">{modalData?.section?.sectionName || "No Section Assigned"}</p>
                </div>
                <div className="mb-4">
                    <h4 className="text-lg font-semibold text-purple-500">{`Group('s) Name`}</h4>
                    {/* Group Details */}
                    {modalData?.groups && modalData?.groups.length > 0 ? (
                        <div className="group-section">
                            <ul className="mt-4 grid grid-cols-2 gap-4">
                                {modalData?.groups?.map((group, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 bg-pink-200 p-2 rounded-lg shadow hover:bg-green-200"
                                    >
                                        <FaUserFriends className="text-green-600" />
                                        <span className="text-gray-800 font-medium">{group?.groupName}</span>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    ) : (
                        <p className="text-gray-700">No Groups Assigned</p>
                    )}
                </div>
            </div>
    );
};

export default SectionGroupModal;
