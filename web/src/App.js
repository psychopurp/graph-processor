import "antd/dist/antd.css";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import React, { useState } from "react";
import { TaskCreate } from "./pages/TaskCreate";
import { TaskStatus } from "./pages/TaskStatus";
import "./App.css";
import Layout from "antd/lib/layout/layout";

function App() {
  const menu = [
    {
      name: "创建任务",
      url: "/task/create",
    },
    {
      name: "任务状态",
      url: "/task/status",
    },
  ];

  const [tasks, setTasks] = useState([]);

  return (
    <Router>
      <div className="App">
        <Layout>
          <Header menu={menu} />
          {/* 任务创建组件 */}
          <Route exact path="/" render={() => <Redirect to="/task/create" />} />
          <Route
            path="/task/create"
            render={(props) => (
              <TaskCreate
                onCreate={(task) => {
                  setTasks([...task]);
                }}
              />
            )}
          />
          {/* 任务状态组件 */}
          <Route
            path="/task/status"
            render={(props) => <TaskStatus tasks={tasks} />}
          />
        </Layout>
      </div>
    </Router>
  );
}

export default App;
