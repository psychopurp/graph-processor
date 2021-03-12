/* eslint-disable */
import React from "react";
import { Panel } from "../components/Panel";
import { Col, Row, Tabs, Card, Tag, Button, Empty, List, Progress } from "antd";
import { Task } from "../model/task";
import { DownloadOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import api from "../api";
import { getTasks } from "../api/getTasks";

export const TaskStatus = (props) => {
  const { data, error, loading } = useRequest(
    () => {
      return getTasks();
    },
    { initialData: [] },
  );
  console.log(data);
  const tasks = props.tasks;
  //   tasks.push(
  //     new Task("test", null, ["显示节点度分布图", "显示节点度分布图"], 10)
  //   );
  //   tasks.push(new Task("test2", null, ["分布图"], 10));
  //   console.log(tasks);

  return (
    <Panel
      component={
        !data || data.length === 0 || error ? (
          <Empty style={{ height: "730px" }} />
        ) : (
          <Tabs>
            {data.map((item, index) => (
              <Tabs.TabPane
                key={index}
                tab={item.name}
                style={{ height: "730px" }}
              >
                <Row style={{ height: "100%" }}>
                  <Col span={6}>
                    <ImagePannel task={item} />
                  </Col>

                  <Col span={6} style={{ margin: "0 10px 0 10px" }}>
                    <JobPannel task={item} />
                  </Col>

                  <Col span={11}>
                    <JobResult task={item} />
                  </Col>
                </Row>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )
      }
    />
  );
};

const ImagePannel = (props) => {
  const item = props.task;
  return (
    <div style={{ height: "100%" }}>
      {" "}
      <Card
        hoverable
        title="原始图"
        style={{ height: "45%", margin: "0 0 5px 0" }}
      >
        {" "}
        <p>image</p>
      </Card>
      <Card
        hoverable
        title="采样图"
        style={{ height: "45%" }}
        extra={
          <div>
            <Tag color="#87d068">图采样率：{item.sampleRate}%</Tag>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              shape="round"
              size="small"
            >
              导出
            </Button>
          </div>
        }
      >
        {" "}
        <p>image </p>
      </Card>
    </div>
  );
};

const JobPannel = (props) => {
  const item = props.task;
  const jobs = item.jobStatusList;

  return (
    <Card title="分析任务列表" hoverable style={{ height: "90%" }}>
      <List
        itemLayout="horizontal"
        dataSource={jobs}
        renderItem={(item, index) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <p>{item.job_name}</p>
              <Progress percent="50" size="small" status="active" />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

const JobResult = (props) => {
  const task = props.task;

  return (
    <Card title="已完成任务可视化结果" hoverable style={{ height: "90%" }}>
      <Tabs tabPosition="left" style={{ height: "100%" }}>
        {task.jobStatusList.map((item, index) => (
          <Tabs.TabPane key={index} tab={item.job_name}>
            <Row align="middle" justify="center">
              <Empty />
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
