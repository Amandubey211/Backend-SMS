import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    reomoveScoreCardCellData,
    getScoreCard,
} from "../../../../Store/Slices/Admin/scoreCard/scoreCard.thunk";

const CellDataTable = ({ scoreCardData }) => {
    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const cellData = scoreCardData?.cellData || [];
        setTableData(
            cellData.map((item) => ({
                key: item._id,
                dataId: item.dataId,
                cellNumber: item.cellNumber,
                title: item.title,
                modelName: item.modelName,
            }))
        );
    }, [scoreCardData])

    // Handle delete
    const handleDelete = (cellNumber,sectionId) => {
        if (!cellNumber) {
            return message.error("Failed to remove field.");
        }
        console.log(sectionId);
        
        dispatch(
            reomoveScoreCardCellData({
                cellNumber,
                classId: scoreCardData.classId,
                sectionId
            })
        ).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                if (action.payload?.success) {
                    setTableData((prevData) =>
                        prevData.filter((item) => item.cellNumber !== cellNumber)
                    );
                    message.success("Data deleted successfully!");
                    dispatch(getScoreCard({ cid: scoreCardData.classId, sectionId: scoreCardData.sectionId })).then((action) => {
                    });
                } else {
                    message.warning(`${action.payload?.message}`);
                }
            } else {
                message.error(action.payload?.message || "Failed to remove field.");
            }
        });
    };


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
                    onConfirm={() => handleDelete(record.cellNumber,scoreCardData?.sectionId)}
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


    return (

        <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
        />

    );

};

export default CellDataTable;
