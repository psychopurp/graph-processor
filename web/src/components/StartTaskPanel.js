import React, { useState } from "react";

import {
  Statistic,
  Row,
  Col,
  Button,
  Divider,
  Card,
  List,
  Tag,
  Spin,
  message,
} from "antd";
import { useRequest } from "ahooks";
import api from "../api";
import qs from "qs";

export const StartTaskPanel = (props) => {
  const tasks = props.tasks;

  const params = { id: "admin", name: "用户" };
  const [uploading, setUploading] = useState(false);

  // const { data, error, loading } = useRequest(api.post("createTask", params), {
  //   throwOnError: true,
  // });
  // console.log(data, error, loading);

  const upLoadSingleTask = async (task) => {
    try {
      let formData = new FormData();
      formData.append("file", task.file.originFileObj);
      console.log(task);
      let filePath = await api.post("upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await api.post("createTask", {
        name: task.name,
        file_path: filePath,
        sample_rate: task.sampleRate,
        analytic_jobs: task.jobTypes,
      });
    } catch (error) {
      message.error("文件上传失败");
      throw new Error(error);
    }
  };

  const uploadTasks = async () => {
    setUploading(true);
    for (let i = 0; i < tasks.length; ) {
      await upLoadSingleTask(tasks[i]);
      props.onDelete(i);
    }
    setUploading(false);
    message.success("任务上传成功", 0.5);
  };

  return (
    <div>
      <Row justify="center" align="middle">
        <Col span={10}>
          <Statistic title="待开始的任务" value={tasks.length} suffix="个" />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() => {
              uploadTasks();
              props.onCreate(tasks);
            }}
          >
            开始任务
          </Button>
        </Col>
      </Row>
      <Divider />

      <Card style={{ overflow: "auto", height: "500px" }}>
        <Spin tip="Uploading..." spinning={tasks.length !== 0 && uploading}>
          <List
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={(item, index) => (
              <List.Item>
                {TaskItem(item, () => {
                  props.onDelete(index);
                })}
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

const TaskItem = (item, onDelete) => {
  const fileSize = (size) => {
    let newSize = (size / 1024).toFixed(2);
    return newSize;
  };

  return (
    <div style={{ width: "100%", ...titleStyle }}>
      <Row>
        <div style={{ margin: "0 0 10px 0" }}>
          任务名称: <span style={spanStyle}>{item.name}</span>
        </div>
        <div style={{ margin: "0 0 0 15px" }}>
          <Tag color="#87d068">图采样率：{item.sampleRate}%</Tag>
        </div>
      </Row>

      <Row justify="start">
        <Col span={5}>
          <div style={{ margin: "0px 5px 0 0" }}>处理任务列表:</div>
        </Col>
        <Col span={18}>
          {item.jobTypes.map((i, idx) => (
            <Tag key={idx} color="pink">
              {i}
            </Tag>
          ))}{" "}
        </Col>
      </Row>

      <Row>
        <div style={{ margin: "5px 0 5px 0" }}>
          文件:{" "}
          <span style={{ margin: "0 60px 0 0", ...spanStyle }}>
            {item.file.name}
          </span>{" "}
          size:
          <span style={spanStyle}>{fileSize(item.file.size)} KB </span>
        </div>
      </Row>

      <Row justify="end">
        <Col span={6}>
          <Button size="small" type="danger" onClick={onDelete} block>
            取消
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const spanStyle = {
  color: "#000",
  fontWeight: 400,
};

const titleStyle = {
  color: "#000000A6",
  fontSize: "14px",
  lineHeight: 1.715,
};
