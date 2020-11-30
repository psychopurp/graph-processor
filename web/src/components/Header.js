import React, { useState } from "react";

import { useLocation, useHistory } from "react-router-dom";

import { Layout, Menu } from "antd";

export const Header = (props) => {
  const menu = props.menu;
  const menuList = menu.map((item, index) => (
    <Menu.Item key={item.url}>{item.name}</Menu.Item>
  ));
  let location = useLocation();
  let history = useHistory();
  let path = location.pathname;
  const [selectedKey, setSelect] = useState(path);

  return (
    <Layout style={{ position: "absolute", top: "0", width: "100%" }}>
      <Layout.Header>
        <div style={titleStyle}>图数据处理平台</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[selectedKey]}
          onClick={(val) => {
            setSelect(val.key);
            history.push(val.key);
          }}
        >
          {menuList}
        </Menu>
      </Layout.Header>
    </Layout>
  );
};

const titleStyle = {
  float: "left",
  color: "#fff",
  fontSize: "22px",
  fontWeight: 600,
  margin: "0 24px 0 24px",
};
