const DriverTableRow = ({ driver, onEdit, openDeleteModal }) => (
    <tr>
        <td className="px-6 py-4">{driver?.fullName || "Unnamed Driver"}</td>
        <td className="px-6 py-4">{driver?.driverBadgeNumber || "N/A"}</td>
        <td className="px-6 py-4">{driver?.licenseNumber || "N/A"}</td>
        <td className="px-6 py-4">{driver?.contactNumber || "N/A"}</td>
        <td className="px-6 py-4">
            <span className={driver.status === "active" ? "text-green-600" : "text-orange-500"}>
                {driver.status === "active" ? "Active" : "Inactive"}
            </span>
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center space-x-3">
                <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => onEdit(driver)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>

                <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => openDeleteModal(driver)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </td>
    </tr>
);
export default DriverTableRow;
