const DriverHeader = ({ onAddClick }) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <svg className="h-6 w-6 mr-2 text-purple-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 4.354a4 4 0 110 5.292V15M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h1 className="text-lg font-medium">Driver List Table</h1>
        </div>
        <button className="flex items-center px-3 py-2 rounded-md bg-purple-600 text-white text-sm" onClick={onAddClick}>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 4v16m8-8H4" />
            </svg>
            Add New Driver
        </button>
    </div>
);

export default DriverHeader;