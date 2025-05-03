const HelperQuickFilter = ({ filterConfig, handleFilterChange, resetFilters, uniqueBusRoutes }) => (
    <div className="bg-white p-3 rounded-md shadow-sm mb-4">
        <div className="flex flex-wrap gap-2 items-center">
            <input
                type="text"
                name="name"
                value={filterConfig.name}
                onChange={handleFilterChange}
                placeholder="Search by driver name..."
                className="w-full max-w-xs px-3 py-2 border rounded-md"
            />
            <select name="status" value={filterConfig.status} onChange={handleFilterChange} className="px-3 py-2 border rounded-md">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <select name="assignedBus" value={filterConfig.assignedBus} onChange={handleFilterChange} className="px-3 py-2 border rounded-md">
                <option value="all">All Buses</option>
                {uniqueBusRoutes.filter(r => r !== "all").map((route, idx) => (
                    <option key={idx} value={route}>{route}</option>
                ))}
            </select>
            <button onClick={resetFilters} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md">Reset</button>
        </div>
    </div>
);

export default HelperQuickFilter;