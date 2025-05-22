import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    reomoveCommonDataFromScoreCard,
    getScoreCard,
} from "../../../../Store/Slices/Admin/scoreCard/scoreCard.thunk";

const CommonDataTable = () => {
    const dispatch = useDispatch();
    const { scoreCardData, loading, error } = useSelector(
        (state) => state.admin.scoreCard
    );
    const [tableData, setTableData] = useState([]);

    // Fetch initial data
    const fetchData = (classId) => {
        dispatch(getScoreCard(classId)).then((action) => {
            if (action.payload?.success) {
                const commonData = action.payload.data.commonData || [];
                setTableData(
                    commonData.map((item) => ({
                        key: item._id,
                        cellNumber: item.cellNumber,
                        fieldName: item.fieldName.join(", "),
                        separator: item.separate,
                    }))
                );
                
            } else {
                message.error("Failed to fetch scorecard data.");
            }
        });
    };

    // Handle delete
    const handleDelete = (cellNumber) => {
        if (!cellNumber) {
            return message.error("Failed to remove field.");
        }
        dispatch(
            reomoveCommonDataFromScoreCard({
                cellNumber,
                classId: scoreCardData.classId,
            })
        ).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                if (action.payload?.success) {
                    // Update local data dynamically
                    setTableData((prevData) =>
                        prevData.filter((item) => item.cellNumber !== cellNumber)
                    );
                    message.success("Data deleted successfully!");
                        dispatch(getScoreCard(scoreCardData.classId)).then((action) => {
                          if (!action.payload?.success) {
                            message.error('Failed to fetch scorecard data.');
                          }
                        });
                } else {
                    message.warning(`${action.payload?.message}`);
                }
            } else {
                message.error(action.payload?.message || "Failed to remove field.");
            }
        });
    };

    useEffect(() => {
        if (scoreCardData?.classId) {
            fetchData(scoreCardData.classId);
        }
    }, [scoreCardData?.classId]);

    const columns = [
        {
            title: "Cell Number",
            dataIndex: "cellNumber",
            key: "cellNumber",
        },
        {
            title: "Field Name",
            dataIndex: "fieldName",
            key: "fieldName",
        },
        {
            title: "Separator",
            dataIndex: "separator",
            key: "separator",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this row?"
                    onConfirm={() => handleDelete(record.cellNumber)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger>
                        <MdDeleteOutline size={25} />
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
        />
    );
};

export default CommonDataTable;
