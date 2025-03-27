// DaySlotFields.jsx

import React from "react";
import { Form, Select, DatePicker, Button, TimePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

export default function DaySlotFields({ form, timetableType, allSubjects }) {
  return (
    <Form.List name="days">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            const isWeekly = timetableType === "weekly";
            return (
              <div key={key} className="border p-2 mb-3 rounded bg-gray-100">
                {/* Weekly => day. Others => date. */}
                {isWeekly ? (
                  <Form.Item
                    {...restField}
                    name={[name, "day"]}
                    label="Day"
                    rules={[{ required: true, message: "Select a day" }]}
                  >
                    <Select placeholder="Select Day" size="large">
                      <Option value="Monday">Monday</Option>
                      <Option value="Tuesday">Tuesday</Option>
                      <Option value="Wednesday">Wednesday</Option>
                      <Option value="Thursday">Thursday</Option>
                      <Option value="Friday">Friday</Option>
                      <Option value="Saturday">Saturday</Option>
                      <Option value="Sunday">Sunday</Option>
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item
                    {...restField}
                    name={[name, "date"]}
                    label="Date"
                    rules={[{ required: true, message: "Select a date" }]}
                  >
                    <DatePicker size="large" />
                  </Form.Item>
                )}

                {/* Slots */}
                <Form.Item {...restField} label="Time Slots">
                  <Form.List name={[name, "slots"]}>
                    {(slotFields, { add: addSlot, remove: removeSlot }) => (
                      <>
                        {slotFields.map(
                          ({ key: slotKey, name: slotName, ...restSlot }) => (
                            <div
                              key={slotKey}
                              className="flex items-center gap-4 mb-2"
                            >
                              {/* Start Time */}
                              <Form.Item
                                {...restSlot}
                                name={[slotName, "startTime"]}
                                label="Start Time"
                                rules={[
                                  {
                                    required: true,
                                    message: "Start time required",
                                  },
                                ]}
                                style={{ marginBottom: 0, width: "15%" }}
                              >
                                <TimePicker
                                  placeholder="Start"
                                  format="HH:mm"
                                  size="large"
                                />
                              </Form.Item>

                              {/* End Time */}
                              <Form.Item
                                {...restSlot}
                                name={[slotName, "endTime"]}
                                label="End Time"
                                rules={[
                                  {
                                    required: true,
                                    message: "End time required",
                                  },
                                ]}
                                style={{ marginBottom: 0, width: "15%" }}
                              >
                                <TimePicker
                                  placeholder="End"
                                  format="HH:mm"
                                  size="large"
                                />
                              </Form.Item>

                              {/* Subject or Event Name */}
                              {timetableType === "weekly" ||
                              timetableType === "exam" ? (
                                <Form.Item
                                  {...restSlot}
                                  name={[slotName, "subjectId"]}
                                  label="Subject"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Subject required",
                                    },
                                  ]}
                                  style={{ marginBottom: 0, width: "25%" }}
                                >
                                  <Select
                                    placeholder="Select Subject"
                                    size="large"
                                  >
                                    {allSubjects?.map((subj) => (
                                      <Option
                                        key={subj.subjectId}
                                        value={subj.subjectId}
                                      >
                                        {subj.subjectName}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <Form.Item
                                  {...restSlot}
                                  name={[slotName, "eventName"]}
                                  label="Event Name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Event name required",
                                    },
                                  ]}
                                  style={{ marginBottom: 0, width: "25%" }}
                                >
                                  <input
                                    type="text"
                                    placeholder="Event Name"
                                    className="border rounded p-1 w-full"
                                  />
                                </Form.Item>
                              )}

                              {/* Remove Slot button */}
                              <Button
                                danger
                                onClick={() => removeSlot(slotKey)}
                                style={{ alignSelf: "flex-end" }}
                              >
                                Remove
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={() => addSlot()}
                        >
                          Add Slot
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>

                {/* Remove Day */}
                <div className="text-right">
                  <Button danger onClick={() => remove(name)}>
                    Remove Day
                  </Button>
                </div>
              </div>
            );
          })}
          <Button type="dashed" onClick={() => add()}>
            + Add Day
          </Button>
        </>
      )}
    </Form.List>
  );
}
