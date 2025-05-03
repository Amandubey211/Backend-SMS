import DriverTableRow from "./DriverTableRow";

const DriverTable = ({ drivers, loading, error, onEdit, openDeleteModal }) => {
    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (!drivers.length) return <div className="p-4 text-center text-gray-500">No drivers found matching the current filters.</div>;

    return (
        <div className="bg-white rounded-md shadow-sm border overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['Driver Name', 'Badge Number', 'License Number', 'Contact Number', 'Status', 'Actions'].map((col, idx) => (
                            <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver, index) => (
                        <DriverTableRow key={driver?._id || index} driver={driver} onEdit={onEdit} openDeleteModal={openDeleteModal} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DriverTable;