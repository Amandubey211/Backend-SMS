import { Input, Select, Button } from "antd";

const { Option } = Select;

const HelperQuickFilter = ({ filterConfig, handleFilterChange, resetFilters, uniqueBusRoutes }) => (
    <div className="bg-white p-3  mb-4">
        <div className="flex justify-between  items-center">
            <Input
                type="text"
                name="name"
                value={filterConfig.name}
                onChange={(e) => handleFilterChange({ target: { name: "name", value: e.target.value } })}
                placeholder="Search by driver name..."
                className="w-full max-w-xs"
                allowClear
            />
            <div className="flex gap-1">
                <Select
                    name="status"
                    value={filterConfig.status}
                    onChange={(value) => handleFilterChange({ target: { name: "status", value } })}
                    className="w-40"
                    placeholder="Select Status"
                >
                    <Option value="all">All Status</Option>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
                <Select
                    name="assignedBus"
                    value={filterConfig.assignedBus}
                    onChange={(value) => handleFilterChange({ target: { name: "assignedBus", value } })}
                    className="w-40"
                    placeholder="Select Bus"
                >
                    <Option value="all">All Buses</Option>
                    {uniqueBusRoutes.filter((r) => r !== "all").map((route, idx) => (
                        <Option key={idx} value={route}>
                            {route}
                        </Option>
                    ))}
                </Select>
                <Button onClick={resetFilters} className="bg-gray-100 text-gray-700">
                    Reset
                </Button>
            </div>
        </div>
    </div>
);

export default HelperQuickFilter;