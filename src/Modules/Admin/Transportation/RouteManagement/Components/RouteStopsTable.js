import React from "react";
import { Table, Typography, Badge, Button } from "antd";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { AiOutlineDrag } from "react-icons/ai";
import StrictModeDroppable from "../StrictModeDroppable";

const { Text } = Typography;

export default function RouteStopsTable({
  selectedStops,
  setSelectedStops,
  setAssignModal,
  formErrors,
  t,
}) {
  const columns = [
    // Column definitions...
  ];

  const onDragEnd = ({ source, destination }) => {
    // Drag and drop logic...
  };

  return (
    <>
      <Typography.Title level={5}>{t("Selected Stops")}</Typography.Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="table">
          {(provided) => (
            <Table
              rowKey="key"
              columns={columns}
              dataSource={selectedStops}
              components={{
                body: {
                  wrapper: (props) => (
                    <tbody
                      {...props}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {props.children}
                      {provided.placeholder}
                    </tbody>
                  ),
                  row: (props) => (
                    <Draggable
                      draggableId={props["data-row-key"]}
                      index={props.index}
                    >
                      {(provided) => (
                        <tr
                          {...props}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ),
                },
              }}
            />
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  );
}
