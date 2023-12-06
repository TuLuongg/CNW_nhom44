import React, { useState, useEffect } from 'react';
import "./event.css";
import { DateTime } from "../../utils/dateTime";
import { Typography, Tag, Spin, Tabs, Menu, Layout, Skeleton, BackTop, List, Badge } from "antd";
import { HistoryOutlined, TeamOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
import eventApi from "../../apis/eventApi";
import { useHistory } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:MM";
const { TabPane } = Tabs;

const Event = () => {

    const history = useHistory();

    const [event, setEvent] = useState([]);
    const [eventJoined, setEventJoined] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalEvent, setTotalEvent] = useState(Number);
    const imageRandom = [
        "https://images.vietnamworks.com/logo/500x600_114029.jpg",
        "https://images.vietnamworks.com/logo/500x600_113854.png",
        "https://images.vietnamworks.com/logo/500x600_114129.jpg",
        "https://images.vietnamworks.com/logo/500x600_113990.jpg",
        "https://images.vietnamworks.com/logo/500x600 (updated 2)_113957.png",
        "https://images.vietnamworks.com/logo/500x600_113868.jpg",
        "https://images.vietnamworks.com/logo/500x600_113996.png",
        "https://images.vietnamworks.com/logo/500x600_113984.png",
        "https://images.vietnamworks.com/logo/500x600_113994.jpg",
        "https://images.vietnamworks.com/logo/500x600_113990.jpg",
        "https://images.vietnamworks.com/logo/500x600_113992.jpg",
        "https://images.vietnamworks.com/logo/500x600_114010.png",
        "https://images.vietnamworks.com/logo/500x600_114012.jpg",
        "https://images.vietnamworks.com/logo/500x600_114017.png",
        "https://images.vietnamworks.com/logo/500x600_114100.png",
        "https://images.vietnamworks.com/logo/500x600_114088.jpg",
        "https://images.vietnamworks.com/logo/500x600_114146.jpg"
    ];

    var item = imageRandom[Math.floor(Math.random() * imageRandom.length)];
    var item2 = imageRandom[Math.floor(Math.random() * imageRandom.length)];
    var item3 = imageRandom[Math.floor(Math.random() * imageRandom.length)];

    //phân trang tin tuyển
    const handlePagePublic = async (pageNumber) => {
        window.scrollTo(0, 0);
        try {
            await eventApi.getListEvents().then((event) => {
                let temp = event.data;
                setEvent(temp);
                setTotalEvent(temp.total_count);
                setLoading(false);
            });

            const responseJoin = await eventApi.getEventJoin();
            setEventJoined(responseJoin.data);
        } catch (error) {
            throw (error);
        }
    }

    const handleDetailEvent = (id) => {
        history.push("/event-detail/" + id)
    }

    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
        handlePagePublic(1);
        setTimeout(function () {

        }, 500);
    }, [])

    const menu = (
        <Menu>
            <Menu.Item key="0" style={{ paddingLeft: 20, paddingRight: 20 }}>
                All event types
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Online
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Offline
            </Menu.Item>
        </Menu>
    );

    const menuEvent = (
        <Menu>
            <Menu.Item key="0" style={{ paddingLeft: 20, paddingRight: 20 }}>
                All event
        </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Going On
        </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Up Coming
        </Menu.Item>
        </Menu>
    );

    const menuEventClose = (
        <Menu>
            <Menu.Item key="0" style={{ paddingLeft: 20, paddingRight: 20 }}>
                All status
        </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Form is open
        </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Have evaluated
        </Menu.Item>
        </Menu>
    );

    const menuEventAttendance = (
        <Menu>
            <Menu.Item key="0" style={{ paddingLeft: 20, paddingRight: 20 }}>
                All status
    </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Form is open
    </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" style={{ paddingLeft: 20, paddingRight: 20 }}>
                Have evaluated
    </Menu.Item>
        </Menu>
    )

    return (
        <Layout className="layout-default">
            <Spin spinning={false}>
                <Layout>
                    <Tabs defaultActiveKey="1" onChange={callback} className="tabs">
                        <TabPane
                            tab={
                                <span>
                                    <ContainerOutlined />
                              List Event
                            </span>
                            }
                            key="1" >
                            <Content >
                                <Skeleton loading={loading} active title paragraph>
                                    <div
                                        className="listEvent">
                                        <List
                                            itemLayout="vertical"
                                            size="large"
                                            pagination={{
                                                onChange: page => {
                                                    window.scrollTo(0, 0);
                                                },
                                                pageSize: 5,
                                            }}
                                            dataSource={event}
                                            renderItem={item => (
                                                <div>
                                                    {item.is_online == true ?
                                                        <Badge.Ribbon text="ONLINE">
                                                            <List.Item
                                                                key={item.title}
                                                                extra={
                                                                    <img
                                                                        width={280}
                                                                        height="100%"
                                                                        alt="logo"
                                                                        src={item.avatar}
                                                                    />
                                                                }
                                                                className="list_item"
                                                                style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                onClick={() => handleDetailEvent(item.uid)}
                                                            >
                                                                <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  <sup> (NEW)</sup></Title>
                                                                <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                </svg>{item.location}</p>
                                                                <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                            </List.Item>
                                                        </Badge.Ribbon>
                                                        : <Badge.Ribbon color="#F7941D" text="OFFLINE">
                                                            <List.Item
                                                                key={item.title}
                                                                extra={
                                                                    <img
                                                                        width={280}
                                                                        height="100%"
                                                                        alt="logo"
                                                                        src={item.avatar}
                                                                    />
                                                                }
                                                                className="list_item"
                                                                style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                onClick={() => handleDetailEvent(item.uid)}
                                                            >
                                                                <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  <sup> (NEW)</sup></Title>
                                                                <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                    </svg>{item.location}</p>
                                                                <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                            </List.Item>
                                                        </Badge.Ribbon>
                                                    }
                                                </div>


                                            )}
                                        />
                                    </div>
                                </Skeleton>
                            </Content>
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <UserOutlined />
                         My Event
                        </span>
                            }
                            key="2">
                            <Content >
                                <Skeleton loading={loading} active title paragraph>
                                    <div
                                        className="listEvent">
                                        <div
                                            className="listEvent">
                                            <List
                                                itemLayout="vertical"
                                                size="large"
                                                pagination={{
                                                    onChange: page => {
                                                        window.scrollTo(0, 0);
                                                    },
                                                    pageSize: 7,
                                                }}
                                                dataSource={eventJoined}
                                                renderItem={item => (
                                                    <div>
                                                        {item.is_online == true ?
                                                            <Badge.Ribbon text="ONLINE">
                                                                <List.Item
                                                                    key={item.title}
                                                                    extra={
                                                                        <img
                                                                            width={280}
                                                                            height="100%"
                                                                            alt="logo"
                                                                            src={item.avatar}
                                                                        />
                                                                    }
                                                                    className="list_item"
                                                                    style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                    onClick={() => handleDetailEvent(item.uid)}
                                                                >
                                                                    <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  <sup> (NEW)</sup></Title>
                                                                    <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                    </svg>{item.location}</p>
                                                                    <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                    </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                    {
                                                                        item.is_close && item.form_close == false && item.join_event.is_feeback == false?
                                                                            <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Waiting for evaluate</Tag></p> :
                                                                            item.is_close && item.join_event.is_feeback == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Have evaluated</Tag></p> :
                                                                                item.is_close && item.form_close && item.join_event.is_feeback == false ?
                                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Not Yet Rated</Tag></p> :
                                                                                    item.is_close ?
                                                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed </Tag></p> :
                                                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Ongoing </Tag></p>
                                                                    }
                                                                    <p style={{ padding: 0, fontSize: 14 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                        <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                    </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                                </List.Item>
                                                            </Badge.Ribbon>
                                                            : <Badge.Ribbon color="#F7941D" text="OFFLINE">
                                                                <List.Item
                                                                    key={item.title}
                                                                    extra={
                                                                        <img
                                                                            width={280}
                                                                            height="100%"
                                                                            alt="logo"
                                                                            src={item.avatar}
                                                                        />
                                                                    }
                                                                    className="list_item"
                                                                    style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                    onClick={() => handleDetailEvent(item.uid)}
                                                                >


                                                                    <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  <sup> (NEW)</sup></Title>
                                                                    <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                    </svg>{item.location}</p>
                                                                    <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                    </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                    {
                                                                        item.is_close && item.form_close == false && item.join_event.is_feeback == false?
                                                                            <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Waiting for evaluate</Tag></p> :
                                                                            item.is_close && item.join_event.is_feeback == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Have evaluated</Tag></p> :
                                                                                item.is_close && item.form_close && item.join_event.is_feeback == false ?
                                                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed Event & Not Yet Rated</Tag></p> :
                                                                                    item.is_close ?
                                                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Closed </Tag></p> :
                                                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Ongoing </Tag></p>
                                                                    }
                                                                    <p style={{ padding: 0, fontSize: 14 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                        <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                    </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                                </List.Item>
                                                            </Badge.Ribbon>
                                                        }
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </Skeleton>
                            </Content>
                        </TabPane>
                        {/* <TabPane
                            tab={
                                <span>
                                    <HistoryOutlined />
                         Joined Event
                        </span>
                            }
                            key="3">
                            <Content >
                                <Skeleton loading={loading} active title paragraph>
                                    <div
                                        className="listEvent">
                                        <PageHeader
                                            className="site-page-header"
                                        >
                                            <Row justify="end" >
                                                <Dropdown overlay={menuEventAttendance} trigger={['click']} >
                                                    <a className="ant-dropdown-link" style={{ color: '#696969' }} onClick={e => e.preventDefault()}>
                                                        All event <DownOutlined />
                                                    </a>
                                                </Dropdown>
                                                <Dropdown overlay={menu} trigger={['click']} >
                                                    <a className="ant-dropdown-link" style={{ color: '#696969', marginLeft: 14 }} onClick={e => e.preventDefault()}>
                                                        All event types <DownOutlined />
                                                    </a>
                                                </Dropdown>
                                                <Dropdown overlay={menuEventClose} trigger={['click']} >
                                                    <a className="ant-dropdown-link" style={{ color: '#696969', marginLeft: 14 }} onClick={e => e.preventDefault()}>
                                                        All attendance <DownOutlined />
                                                    </a>
                                                </Dropdown>
                                            </Row>
                                        </PageHeader>
                                        <List
                                            itemLayout="vertical"
                                            size="large"
                                            pagination={{
                                                onChange: page => {
                                                    window.scrollTo(0, 0);
                                                },
                                                pageSize: 7,
                                            }}
                                            dataSource={eventJoined}
                                            renderItem={item => (
                                                <div>
                                                    {item.is_online == true ?
                                                        <Badge.Ribbon text="ONLINE">
                                                            <List.Item
                                                                key={item.title}
                                                                extra={
                                                                    <img
                                                                        width={280}
                                                                        height="100%"
                                                                        alt="logo"
                                                                        src={item.avatar}
                                                                    />
                                                                }
                                                                className="list_item"
                                                                style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                onClick={() => handleDetailEvent(item.uid)}
                                                            >
                                                                <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  </Title>
                                                                <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                </svg>{item.location}</p>
                                                                <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Waiting for evaluate</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                            </List.Item>
                                                        </Badge.Ribbon>
                                                        : <Badge.Ribbon color="#F7941D" text="OFFLINE">
                                                            <List.Item
                                                                key={item.title}
                                                                extra={
                                                                    <img
                                                                        width={280}
                                                                        height="100%"
                                                                        alt="logo"
                                                                        src={item.avatar}
                                                                    />
                                                                }
                                                                className="list_item"
                                                                style={{ marginBottom: 15, background: "#ffffff", borderRadius: 4, boxShadow: "0 0 5px 5px rgb(0 0 0 / 3%)" }}
                                                                onClick={() => handleDetailEvent(item.uid)}
                                                            >


                                                                <Title style={{ marginTop: 10, marginBottom: 0, color: '#d4380d', cursor: "pointer", wordWrap: "break-word" }} level={5} >{item.event_name?.toUpperCase()}  </Title>
                                                                <p style={{ wordWrap: "break-word", margin: 0, padding: 0 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: item.description }} ></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                </svg>{item.location}</p>
                                                                <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                                </svg>  {DateTime(item.start_at, DATE_TIME_FORMAT)} - {DateTime(item.end_at, DATE_TIME_FORMAT)}</p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{item.count_join_event}/{item.size}</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">Waiting for evaluate</Tag></p>
                                                                <p style={{ padding: 0, fontSize: 14 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                                    <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                                </svg> Score: <Tag color="geekblue">{item?.scope}</Tag></p>
                                                            </List.Item>
                                                        </Badge.Ribbon>
                                                    }
                                                </div>
                                            )}
                                        />
                                    </div>
                                </Skeleton>
                            </Content>
                        </TabPane> */}

                    </Tabs>
                    <Sider width={500} style={{
                        top: 0,
                        height: '100%',
                        left: 0,
                        padding: 0,
                        zIndex: 1,
                        marginTop: 0,
                        background: "#f0f2f5",
                    }}
                        className="sider-bar"
                    >
                        <div >
                            <img alt=" tuyển dụng - Tìm việc mới nhất, lương thưởng hấp dẫn." src={item} style={{ paddingLeft: 20, paddingTop: 10, width: 360 }}></img>
                            <img alt=" tuyển dụng - Tìm việc mới nhất, lương thưởng hấp dẫn." src={item2} style={{ paddingLeft: 20, paddingTop: 10, width: 360 }}></img>
                            <img alt=" tuyển dụng - Tìm việc mới nhất, lương thưởng hấp dẫn." src={item3} style={{ paddingLeft: 20, paddingTop: 10, width: 360 }}></img>
                        </div>
                    </Sider>
                </Layout>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </Layout>
    );
}

export default Event;