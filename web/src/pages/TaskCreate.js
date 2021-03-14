/* eslint-disable */
import React, { useState } from "react";
import { Col, Layout, Row } from "antd";
import { Panel } from "../components/Panel";
import { TaskForm } from "../components/TaskForm";
import { StartTaskPanel } from "../components/StartTaskPanel";

const { Content } = Layout;

export const TaskCreate = (props) => {
  const [tasks, setTasks] = useState([]);

  return (
    <Panel
      component={
        <Row>
          <Col span={14}>
            <TaskForm
              onAddTask={(task) => {
                setTasks([...tasks, task]);
              }}
            />
          </Col>

          <Col span={9} offset={1}>
            <StartTaskPanel
              tasks={tasks}
              onCreate={(tasks) => {
                // props.onCreate(tasks);
                setTasks([]);
              }}
              onDelete={(index) => {
                tasks.splice(index, 1);
                setTasks([...tasks]);
              }}
            />
          </Col>
        </Row>
      }
    />
  );
};
