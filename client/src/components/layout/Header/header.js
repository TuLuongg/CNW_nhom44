
import React, { useEffect, useState } from 'react';
import styles from './header.module.css';
import userApi from "../../../apis/userApi";
import logo from "../../../assets/image/logo.png";
import DropdownAvatar from "../../DropdownMenu/dropdownMenu";
import { useHistory, NavLink } from "react-router-dom";
import { Layout, Avatar, Badge, Row, Col, List, Popover, Modal, Drawer } from 'antd';
import { BellOutlined, NotificationTwoTone, BarsOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Header } = Layout;

function Topbar() {

  const [countNotification, setCountNotification] = useState(0);
  const [notification, setNotification] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [titleNotification, setTitleNotification] = useState('');
  const [contentNotification, setContentNotification] = useState('');
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [userData, setUserData] = useState([]);
  const [cart, setCart] = useState();

  const history = useHistory();

  const handleLink = (link) => {
    setVisibleDrawer(false);
    history.push(link);
  }

  const Logout = async () => {
    await userApi.logout();
    localStorage.removeItem("client");
    history.push("/login");
    window.location.reload(false);
  }

  const content = (
    <div>
      {notification.map((values, index) => {
        return (
          <div>
            <List.Item style={{ padding: 0, margin: 0 }}>
              <List.Item.Meta
                style={{ width: 250, margin: 0 }}
                avatar={<NotificationTwoTone style={{ fontSize: '20px', color: '#08c' }} />}
                title={<a onClick={() => handleNotification(values.content, values.title)}>{values.title}</a>}
                description={<p className={styles.fixLine} dangerouslySetInnerHTML={{ __html: values.content }}></p>}
              />
            </List.Item>
          </div>
        )
      })}
    </div>
  );

  const handleNotification = (valuesContent, valuesTitile) => {
    setVisible(true);
    setVisiblePopover(visible !== visible)
    setContentNotification(valuesContent);
    setTitleNotification(valuesTitile);
  }

  const handleVisibleChange = (visible) => {
    setVisiblePopover(visible);
  };

  const handleOk = () => {
    setVisible(false);
  }

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onClose = () => {
    setVisibleDrawer(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await userApi.getProfile();
        const cart = localStorage.getItem('cartLength');
        console.log(cart);
        setCart(cart);
        setUserData(response);
      } catch (error) {
        console.log('Failed to fetch profile user:' + error);
      }
    })();
  }, [])

  return (
    <Header
      style={{ background: "#D70018" }}
      className={styles.header}
    >
      <div className="">
        <img style={{ color: "#000000", fontSize: 15, height: 55, cursor: "pointer" }} src={logo} onClick={() => handleLink("/home")}></img>
      </div>
      <BarsOutlined className={styles.bars} onClick={showDrawer}/>
      <div className={styles.navmenu}>
        <NavLink className={styles.navlink} to="/home" activeStyle>
          Trang chủ
        </NavLink>
        <NavLink className={styles.navlink} to="/product-list/643cd2aed2f4cf93f513bdad" activeStyle>
          Sản phẩm
        </NavLink>
        <NavLink className={styles.navlink} to="/news" activeStyle>
          Tin tức
        </NavLink>
        <NavLink className={styles.navlink} to="/contact" activeStyle>
          Liên hệ
        </NavLink>
      </div>
      <div className={styles.logBtn}>
        <div style={{ position: 'relative', display: 'flex', float: 'right', alignItems: "center", cursor: 'pointer' }}>
            <Row>
              <Col onClick={() => handleLink("/cart")}>
                <p style={{ marginRight: 10, padding: 0, margin: 0, color: '#FFFFFF' }}><ShoppingOutlined style={{ fontSize: '18px', color: '#FFFFFF' }} /> {cart} sản phẩm</p>
              </Col>
              <Col>
                <Badge style={{ marginLeft: 10 }} overflowCount={9999} count={userData?.score > 0 ? userData?.score : 0} />
              </Col>
            </Row>
            &emsp;
            <Row>
              <span className={styles.container} style={{ marginRight: 15 }} >
                <Popover placement="bottomRight" title="Thông Báo" content={content} visible={visiblePopover} onVisibleChange={handleVisibleChange} trigger="click">
                  <Badge count={countNotification} >
                    <Avatar style={{ backgroundColor: "#FFFFFF", marginLeft: 5, marginRight: 5, cursor: "pointer" }} icon={<BellOutlined style={{ fontSize: '18px', color: '#000000' }} />} />
                  </Badge>
                </Popover>
              </span>
            </Row>
            <Row>
              <DropdownAvatar key="avatar" />
            </Row>
            <Modal
              title={titleNotification}
              visible={visible}
              onOk={handleOk}
              onCancel={handleOk}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <p dangerouslySetInnerHTML={{ __html: contentNotification }} ></p>
            </Modal>
        </div>
      </div>
      <Drawer title="Menu" placement="right" onClose={onClose} open={visibleDrawer}>
        <div className={styles.navmenu2}>
          <NavLink className={styles.navlink2} to="/home" activeStyle>
            Trang chủ
          </NavLink>
          <NavLink className={styles.navlink2} to="/event" activeStyle>
            Sản phẩm
          </NavLink>
          <NavLink className={styles.navlink2} to="/about" activeStyle>
            Về chúng tôi
          </NavLink>
          <NavLink className={styles.navlink2} to="/contact" activeStyle>
            Liên hệ
          </NavLink>
          <div className={styles.navlink2}>
            <div style={{display: 'flex', cursor: 'pointer'}} onClick={() => handleLink("/cart")}>
              <p style={{ marginRight: 10, padding: 0, margin: 0, color: 'black' }}><ShoppingOutlined style={{ fontSize: '18px', color: 'black' }} /> {cart} sản phẩm</p>
              <Badge style={{ marginLeft: 10 }} overflowCount={9999} count={userData?.score > 0 ? userData?.score : 0} />
            </div>
          </div>
          <div className={styles.navlink2}>
            <DropdownAvatar key="avatar" />
          </div>
        </div>
      </Drawer>
    </Header >
  );
}

export default Topbar;