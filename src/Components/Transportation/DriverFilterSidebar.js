import Sidebar from "../Common/Sidebar";

const DriverFilterSidebar = ({ isOpen, setIsOpen, filterConfig, handleFilterChange, resetFilters, uniqueBusRoutes }) => (
    <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Advanced Filters"
        width="30%"
    >
        <div className="p-4">
            <form className="space-y-4">
                <div>
                    <label
                        htmlFor="filterName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Driver Name
                    </label>
                    <input
                        type="text"
                        id="filterName"
                        name="name"
                        value={filterConfig.name}
                        onChange={handleFilterChange}
                        placeholder="Search by name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="filterStatus"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Status
                    </label>
                    <select
                        id="filterStatus"
                        name="status"
                        value={filterConfig.status}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="filterBus"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Assigned Bus
                    </label>
                    <select
                        id="filterBus"
                        name="assignedBus"
                        value={filterConfig.assignedBus}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">All Buses</option>
                        {(uniqueBusRoutes || ["all"])
                            .filter((route) => route !== "all")
                            .map((route, index) => (
                                <option key={index} value={route}>
                                    {route}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                        Reset Filters
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>
        </div>
    </Sidebar>
);

export default DriverFilterSidebar;
