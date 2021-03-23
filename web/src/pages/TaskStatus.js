/* eslint-disable */
import React from "react";
import { Panel } from "../components/Panel";
import { Col, Row, Tabs, Card, Tag, Button, Empty, List, Progress } from "antd";
import { Task } from "../model/task";
import { DownloadOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import {
  getTasks,
  getDegreeHistogram,
  getKMeans,
  downLoadFile,
  downLoad,
  getCluster,
  getPredictLink,
} from "../api/getTasks";
import { Graph, GraphLinear } from "../components/graph";
import { Image } from "antd";

export const TaskStatus = (props) => {
  const { data, error, loading } = useRequest(
    () => {
      return getTasks();
    },
    { initialData: [] }
  );
  console.log(data);
  // const tasks = props.tasks;
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

                  {/* <Col span={6} style={{ margin: "0 10px 0 10px" }}>
                    <JobPannel task={item} />
                  </Col> */}

                  <Col span={17} style={{ margin: "0 10px 0 10px" }}>
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
  console.log(item);
  return (
    <div style={{ height: "100%", width: "100%" }}>
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
              onClick={() => {
                downLoad(item.samplePicPath);
              }}
            >
              导出
            </Button>
          </div>
        }
      >
        {" "}
        <div
          style={{
            height: "240px",
            width: "250px",
            // backgroundColor: "#fff000",
          }}
        >
          <Graph filepath={item.samplePicPath}></Graph>
        </div>
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
              {choice(item, task)}
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

const choice = (item, task) => {
  switch (item.job_name) {
    case "显示节点度分布图":
      return degree(task.samplePicPath);
    case "计算聚类系数":
      return cluster(task.samplePicPath);
    case "节点分类":
      return degree(task.samplePicPath);
    case "节点聚类":
      return kmeans(task.samplePicPath);
    case "链路预测":
      return link_predict(task.samplePicPath);

    default:
      return <Empty />;
  }
};

const degree = (sampleFilePath) => {
  console.log(sampleFilePath);
  const { data, error, loading } = useRequest(
    () => {
      return getDegreeHistogram(sampleFilePath);
    },
    { initialData: [] }
  );

  return <div>{!loading ? <Image width={400} src={data} /> : <Empty />}</div>;
};

const cluster = (sampleFilePath) => {
  const { data, error, loading } = useRequest(
    () => {
      return getCluster(sampleFilePath);
    },
    { initialData: { list: [], path: "" } }
  );
  let x_data = [];
  let y_data = [];
  for (let i of data.list) {
    x_data.push(i[0]);
    y_data.push(i[1]);
  }

  let option = {
    xAxis: {
      type: "category",
      data: x_data,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: y_data,
        type: "line",
      },
    ],
  };

  return (
    <Col span={24} style={{ backgroundColor: "" }}>
      {!loading ? (
        <div>
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              downLoad(data.path);
            }}
          >
            导出
          </Button>
          {GraphLinear(option)}
        </div>
      ) : (
        <Empty />
      )}
    </Col>
  );
};

const kmeans = (sampleFilePath) => {
  const { data, error, loading } = useRequest(
    () => {
      return getKMeans(sampleFilePath);
    },
    { initialData: [] }
  );

  return <div>{!loading ? <Image width={400} src={data} /> : <Empty />}</div>;
};

const link_predict = (sampleFilePath) => {
  const { data, error, loading } = useRequest(
    () => {
      return getPredictLink(sampleFilePath);
    },
    { initialData: { path: "" } }
  );

  return (
    <Col span={24} style={{ backgroundColor: "" }}>
      {!loading ? (
        <div>
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            shape="round"
            size="small"
            onClick={() => {
              downLoad(data.path);
            }}
          >
            导出链路预测文件
          </Button>
        </div>
      ) : (
        <Empty />
      )}
    </Col>
  );
};
