import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    reomoveScoreCardCellData,
    getScoreCard,
} from "../../../../Store/Slices/Admin/scoreCard/scoreCard.thunk";

const CellDataTable = () => {
    const dispatch = useDispatch();
    const { scoreCardData, loading, error } = useSelector(
        (state) => state.admin.scoreCard
    );
    const [tableData, setTableData] = useState([]);

    // Fetch initial data
    const fetchData = (classId) => {
        dispatch(getScoreCard(classId)).then((action) => {
            if (action.payload?.success) {
                const cellData = action.payload.data.cellData || [];
                setTableData(
                    cellData.map((item) => ({
                        key: item._id,
                        dataId: item.dataId,
                        cellNumber: item.cellNumber,
                        title: item.title,
                        modelName: item.modelName,
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
            reomoveScoreCardCellData({
                cellNumber,
                classId: scoreCardData.classId,
            })
        ).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                if (action.payload?.success) {
                    setTableData((prevData) =>
                        prevData.filter((item) => item.cellNumber !== cellNumber)
                    );
                    message.success("Data deleted successfully!");
                    dispatch(getScoreCard(scoreCardData.classId)).then((action) => {

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
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Type",
            dataIndex: "modelName",
            key: "modelName",
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
    tableData.length < 1 ? (
        <div>No data available</div>
    ) : (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
        />
    )
);

};

export default CellDataTable;
