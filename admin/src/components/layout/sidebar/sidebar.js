import React, { useEffect, useState } from 'react';
import "./sidebar.css";
import { Layout, Menu } from 'antd';
import { useHistory, useLocation } from "react-router-dom";
import { UserOutlined, ContainerOutlined, DashboardOutlined, BarsOutlined, ProfileOutlined, ShoppingOutlined, AuditOutlined, ShoppingCartOutlined, FormOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "product-list",
      title: "Danh sách sản phẩm",
      link: "/product-list",
      icon: <FormOutlined />
    },
    {
      key: "category-list",
      title: "Danh mục sản phẩm",
      link: "/category-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "order-list",
      title: "Quản lý đơn hàng",
      link: "/order-list",
      icon: <ShoppingCartOutlined />
    },
    {
      key: "news-list",
      title: "Tin tức",
      link: "/news-list",
      icon: <BarsOutlined />
    },
  ];

  const menuSubEventAdmin = [
    {
      key: "event",
      title: "Event Pending",
      link: "/event",
      icon: <ContainerOutlined />
    },
    {
      key: "event-approved",
      title: "Event Approved",
      link: "/event-approved",
      icon: <ContainerOutlined />
    },
    {
      key: "event-reject",
      title: "Event Reject",
      link: "/event-reject",
      icon: <ContainerOutlined />
    }
  ];

  const menuSubEventStudentAdmin = [
    {
      key: "organizing-event",
      title: "Upcoming Event",
      link: "/organizing-event",
      icon: <AuditOutlined />
    },
    {
      key: "organized-event",
      title: "Organized Event",
      link: "/organized-event",
      icon: <AuditOutlined />
    }
  ];

  const menuSidebarCreator = [
    {
      key: "my-event",
      title: "My Event",
      link: "/my-event",
      icon: <FormOutlined />
    },
    {
      key: "notification",
      title: "Notification",
      link: "/notification",
      icon: <NotificationOutlined />
    },
  ];

  const menuSidebarApprove = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "my-event",
      title: "My Event",
      link: "/my-event",
      icon: <FormOutlined />
    },
    {
      key: "notification",
      title: "Notification",
      link: "/notification",
      icon: <NotificationOutlined />
    },
  ];

  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
  })

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={215}
      style={{
        position: "fixed",
        top: 60,
        height: '100%',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)"
      }}
    >
     <Menu
          mode="inline"
          selectedKeys={location.pathname.split("/")}
          defaultOpenKeys={['account']}
          style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
          theme='light'
        >

          {
            menuSidebarAdmin.map((map) => (
              <Menu.Item
                onClick={() => navigate(map.link, map.key)}
                key={map.key}
                icon={map.icon}
                className="customeClass"
              >
                {map.title}
              </Menu.Item>
            ))
          }
          {/* < SubMenu key="sub1" icon={<InsertRowBelowOutlined />} title="Event Censorship">
            {menuSubEventAdmin.map((map) => (
              <Menu.Item
                onClick={() => navigate(map.link, map.key)}
                key={map.key}
                icon={map.icon}
                className="customeClass"
              >
                {map.title}
              </Menu.Item>
            ))}
          </SubMenu>

          < SubMenu key="sub2" icon={<ProfileOutlined />} title="Event Management">
            {menuSubEventStudentAdmin.map((map) => (
              <Menu.Item
                onClick={() => navigate(map.link, map.key)}
                key={map.key}
                icon={map.icon}
                className="customeClass"
              >
                {map.title}
              </Menu.Item>
            ))}
          </SubMenu> */}
        </Menu>

    </Sider >
  );
}

export default Sidebar;