import React from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { createConfiguration } from '../../../../Store/Slices/Finance/Configuration/configuration.thunk';
import { useNavigate } from 'react-router-dom';

export default function ConfigurationCreateModel({closeConfigModel,data,configType}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        let allData = {configData:{...data,...values},...values,configType}
        dispatch(createConfiguration({data:allData,navigate}))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    closeConfigModel()
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input placeholder="Enter Title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter Description" />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-4">
            <Button className='bg-gradient-to-r from-pink-500 to-purple-500 text-white' onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form.Item>

        {/* Details section */}
        <div className="mt-4">
          <div>• Save repeated form info in finance config.</div>
          <div>• No need to retype the same data again.</div>
          <div>• Load and apply it directly when needed.</div>
        </div>
      </Form>
    </div>
  );
}
