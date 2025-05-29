import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    reomoveCommonDataFromScoreCard,
    getScoreCard,
} from "../../../../Store/Slices/Admin/scoreCard/scoreCard.thunk";

const CommonDataTable = ({ scoreCardData }) => {
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const commonData = scoreCardData?.commonData || [];
        setTableData(
            commonData.map((item) => ({
                key: item._id,
                cellNumber: item.cellNumber,
                fieldName: item.fieldName.join(` ${item.separate} `),
                separator: item.separate,
            }))
        )
    }, [scoreCardData])

    // Handle delete
    const handleDelete = (cellNumber) => {
        if (!cellNumber) {
            return message.error("Failed to remove field.");
        }
        dispatch(
            reomoveCommonDataFromScoreCard({
                cellNumber,
                classId: scoreCardData?.classId,
                sectionId: scoreCardData?.sectionId
            })
        ).then((action) => {
            if (action?.meta?.requestStatus === "fulfilled") {
                if (action?.payload?.success) {
                    // Update local data dynamically
                    setTableData((prevData) =>
                        prevData.filter((item) => item?.cellNumber !== cellNumber)
                    );
                    message.success("Data deleted successfully!");
                    dispatch(getScoreCard({cid:scoreCardData.classId,sectionId:scoreCardData.sectionId})).then((action) => {
      
                    });
                } else {
                    message.warning(`${action?.payload?.message}`);
                }
            } else {
                message.error(action?.payload?.message || "Failed to remove field.");
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


    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
        />
    );
};

export default CommonDataTable;
