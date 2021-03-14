/* eslint-disable */
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Upload,
  Button,
  Select,
  Slider,
  InputNumber,
  Switch,
  Spin,
  Empty,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Task } from "../model/task";
import { useRequest } from "ahooks";
import api from "../api";

import React, { useCallback, useEffect, useState } from "react";
import { useFetchApi } from "../hooks/fetch";

export const TaskForm = (props) => {
  const layout = {
    labelCol: { span: 4, pull: 0 },
    wrapperCol: { span: 16, pull: 0 },
  };
  const [edgeFileList, setEdgeFile] = useState([]);
  const [nodeFileList, setNodeFile] = useState([]);

  const { data, error, loading } = useRequest(
    () => {
      return api.get("getAnalyticjobs");
    },
    { initialData: [] },
  );
  // console.log(data, error, loading);

  const uploadEdgeFile = {
    onRemove: (file) => {
      const index = edgeFileList.indexOf(file);
      edgeFileList.splice(index, 1);
      setFile([...edgeFileList]);
    },
    action: async (file) => {
      //   console.log(file);
      edgeFileList.push(file);
      setEdgeFile([...edgeFileList]);
    },
    customRequest: () => {},
    fileList: edgeFileList,
  };

  const uploadNodeFile = {
    onRemove: (file) => {
      const index = nodeFileList.indexOf(file);
      nodeFileList.splice(index, 1);
      setFile([...nodeFileList]);
    },
    action: async (file) => {
      //   console.log(file);
      nodeFileList.push(file);
      setNodeFile([...nodeFileList]);
    },
    customRequest: () => {},
    fileList: nodeFileList,
  };

  const handleUpload = () => {};
  const [form] = Form.useForm();

  const [sampleRate, setSampleRate] = useState(30);
  const onSampleRateChange = (val) => {
    setSampleRate(val);
  };

  const initForm = () => {
    setSampleRate(30);
    setEdgeFile([]);
    setNodeFile([]);
    form.setFieldsValue({ taskName: "", sampleRate: 30 });
  };
  return (
    <div>
      <Card title="任务配置" bordered={true} style={{ padding: "0 0 24px 0" }}>
        <Spin spinning={loading}>
          {!data || data.length === 0 || error ? (
            <Empty />
          ) : (
            <Form
              form={form}
              name="basic"
              {...layout}
              onFinish={(val) => {
                let task = new Task(
                  val.taskName,
                  val.taskLoadEdge.file,
                  val.taskLoadNode ? val.task.taskLoadNode.file : null,
                  val.jobs,
                  val.sampleRate,
                );

                initForm();
                props.onAddTask(task);
              }}
            >
              <Form.Item
                label="任务名称"
                name="taskName"
                rules={[{ required: true, message: "请输入任务名称" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="装载边文件"
                name="taskLoadEdge"
                rules={[{ required: true, message: "请选择分析的图文件" }]}
              >
                <Upload {...uploadEdgeFile}>
                  <Button disabled={edgeFileList.length !== 0}>
                    <UploadOutlined />
                    选择文件
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="装载节点文件"
                name="taskLoadNode"
                rules={[{ required: false, message: "请选择分析的图文件" }]}
              >
                <Upload {...uploadNodeFile}>
                  <Button disabled={nodeFileList.length !== 0}>
                    <UploadOutlined />
                    选择文件
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="选择分析任务"
                name="jobs"
                rules={[{ required: true, message: "请选择分析任务" }]}
                initialValue={[data[0]]}
              >
                <Select mode="multiple" placeholder="选择你的分析任务">
                  {data.map((item, index) => (
                    <Select.Option key={item}>{item}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="图采样率">
                <Row>
                  <Col span={19}>
                    <Form.Item name="sampleRate" initialValue={sampleRate}>
                      <Slider
                        min={1}
                        max={100}
                        value={sampleRate}
                        onChange={onSampleRateChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4} offset={1}>
                    <InputNumber
                      min={1}
                      max={100}
                      value={sampleRate}
                      onChange={onSampleRateChange}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item label="使用推荐配置" name="suggest">
                <Switch defaultChecked checked={true} />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 4, offset: 16 }}>
                <Button type="primary" htmlType="submit">
                  加入任务队列
                </Button>
              </Form.Item>
              {/* <Col span={4} offset={16}></Col> */}
            </Form>
          )}{" "}
        </Spin>
      </Card>
    </div>
  );
};
