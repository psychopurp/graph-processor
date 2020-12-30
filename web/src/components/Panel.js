import React from "react";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

export const Panel = (props) => {
  let component = props.component;
  return (
    <Layout style={{ height: "100%"}}>
      <Content style={{ padding: "80px 24px 24px 24px", height: "100%", }}>
        <div style={content}>{component}</div>
      </Content>
    </Layout>
  );
};

const content = {
  height: "100%",
  padding: "24px",
  background: "#fff",
  overFlow: "auto",
};
