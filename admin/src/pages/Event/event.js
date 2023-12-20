import React, { useState, useEffect } from 'react';
import "./event.css";
import { DateTime } from "../../utils/dateTime";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Input, Alert, Badge,
    Form, Pagination, Modal, Empty, Popconfirm, notification, BackTop, Tag, Breadcrumb, InputNumber
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, CheckOutlined, ContainerOutlined } from '@ant-design/icons';
import eventApi from "../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axiosClient from "../../apis/axiosClient";

const { TextArea } = Input;
const { Title } = Typography;

const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const Home = () => {

    const [event, setEvent] = useState([]);
    const [eventTemp, setEventTemp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [visibleReject, setVisibleReject] = useState(false);
    const [form] = Form.useForm();
    const [formReject] = Form.useForm();
    const [totalEvent, setTotalEvent] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [qrCode, setQrCode] = useState();
    const [selected, setSelected] = useState();
    const [visibleUser, setVisibleUser] = useState(false);
    const [uid, setUid] = useState(false);
    const [idReject, setIdReject] = useState();

    const history = useHistory();

    const hideModal = () => {
        setVisible(false);
    };

    const hideDownload = () => {
        downloadQR();
        setVisible(false);
    }

    const handleListEvent = async () => {
        try {
            const response = await eventApi.getListEvents();
            setEvent(response.data);
            setTotalEvent(response.total_count);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDeleteEvent = async (id) => {
        try {
            const response = await eventApi.deleteEvent(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Delete event failed',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully delete event',

                    });
                    setCurrentPage(1);
                    handleListEvent();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleCancelEvent = async (id) => {
        setIdReject(id);
        setVisibleReject(true);
    }

    const handleRejectEvent = async (values) => {
        try {
            const formatData = {
                "note": values.note
            }
            await axiosClient.patch("/event/" + idReject + "/cancel_event", formatData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Reject Event Failed',
                    });
                }
                else {
                    notification["success"]({
                        message: `Notification`,
                        description:
                            'Successfully Reject Event',

                    });
                    setVisibleReject(false);
                    setCurrentPage(1);
                    handleListEvent();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const showModalUser = (id) => {
        setUid(id);
        setVisibleUser(true);
    };

    const handleCancelUser = e => {
        setVisibleUser(false);
    };

    const handleCancelReject = e => {
        setVisibleReject(false);
    }

    const handlePage = async (page, size) => {
        window.scrollTo(0, 0);
        setLoading(true);
        try {
            const response = await eventApi.getListEvents(page);
            setEvent(response.data);
            setTotalEvent(response.total_count);
            setCurrentPage(page);
            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDetaisView = (id) => {
        history.push("/event-detail/" + id)
    }

    const downloadQR = () => {
        const canvas = document.getElementById('qrcode');
        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        console.log('pngUrl', pngUrl);
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = '3A2S.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const checkAuth = () => {
        return localStorage.getItem('role');
    }

    const handleFilter = async (name) => {
        try {
            const response = await eventApi.searchEventNamePending(name.target.value);
            setEvent(response.data);
        } catch (error) {
            console.log('search to fetch event list:' + error);
        }
    }

    const handleAttendanceScore = async (values) => {
        setLoading(true);
        const event = {
            "event": {
                "scope": values.scope,
            }
        }

        try {
            await axiosClient.patch("/event/" + uid + "/approve_event", event).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Approve Event Failed',

                    });
                    setVisibleUser(false);
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Notification`,
                        description:
                            'Successfully Approve Event',

                    });
                    setLoading(false);
                    setVisibleUser(false);
                    setCurrentPage(1);
                    handleListEvent();
                }
            }
            );
        } catch (error) {
            throw error;
        }
    };

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await eventApi.getListEvents();
                setEvent(response.data);
                setEventTemp(response.data);
                setTotalEvent(response.total_count);
                setLoading(false);

            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
        window.scrollTo(0, 0);

    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ marginTop: 20, marginLeft: 24 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <ContainerOutlined />
                            <span>Event</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div id="event">
                    <div id="event_container__list">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14 }}
                        >
                            <Input
                                placeholder="Search by name"
                                allowClear
                                style={{ width: 300 }}
                                onChange={handleFilter}
                                value={selected}
                            />
                        </PageHeader>
                    </div>
                </div>
                {event.length == 0 ?
                    <div id="event" style={{ background: "#FFFFFF", padding: 80 }} >
                        <NoData />
                    </div>
                    :
                    ""}
                {event.map((eventDetail, id) => {
                    return (
                        <div key={id}>
                            <div id="event">
                                {eventDetail.is_online == true ?
                                    <Badge.Ribbon text="ONLINE" style={{ paddingRight: 20 }}>
                                        <div id="event_container__list" style={{ padding: 12 }}>
                                            <Card bordered={false} style={{ borderRadius: 6 }}>
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} span={6}>
                                                        {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} className="image_event" alt="" style={{ height: 165, width: '100%' }}></img> : <img className="image_event" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
                                                    </Col>
                                                    <Col style={{ paddingRight: 0 }} span={7}>
                                                        <Title style={{ marginBottom: 1, color: '#d4380d', fontSize: 15.5, fontFamily: 'Inter, sans-serif' }} level={5}>{eventDetail.event_name}</Title>
                                                        <p style={{ margin: 0, fontSize: 14, marginBottom: 1 }}>{eventDetail.createdBy?.firstName ? <UserOutlined /> : <HomeOutlined />}
                                                            <u style={{ paddingLeft: 5 }}>
                                                                {eventDetail.organization}
                                                            </u>
                                                        </p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                        </svg>{eventDetail.location}</p>
                                                        <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                        </svg>  {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status.toUpperCase()}</Tag></p>
                                                        {eventDetail.type_event.map((item, index) => {
                                                            return (
                                                                <Tag key={index} style={{ marginRight: 5, marginTop: 5, fontSize: 13 }}>{item.toUpperCase()}</Tag>
                                                            )
                                                        })}
                                                    </Col>
                                                    <Col style={{ paddingLeft: 0, paddingRight: 0 }} span={6}>
                                                        <p style={{ margin: 0, fontSize: 14 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
                                                    </Col>
                                                    <Col style={{ paddingLeft: 0, paddingRight: 0, width: 10 }} span={0}>
                                                    </Col>
                                                    <Col style={{ textAlign: "center", float: "left" }} span={5}>
                                                        <div style={{ borderLeft: '1px solid #D3D3D3', height: '100%', float: "left", paddingRight: 2 }}></div>
                                                        <div className="event__button-wrap">
                                                            <Row
                                                                justify="center"
                                                            >
                                                                <Button
                                                                    className="event__btn"
                                                                    icon={<EyeOutlined />}
                                                                    onClick={() => handleDetaisView(eventDetail.uid)}
                                                                >{"View"}
                                                                </Button>
                                                                {
                                                                    checkAuth() === "admin" || checkAuth() == "approval" ?
                                                                        <Popconfirm
                                                                            title="Are you sure approval this event?"
                                                                            onConfirm={() => showModalUser(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                shape="round"
                                                                                className="event__btn"
                                                                                icon={<CheckOutlined />} >{"Approval"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "admin" || checkAuth() == "approval" ?
                                                                        <Button
                                                                            shape="round"
                                                                            className="event__btn"
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => handleCancelEvent(eventDetail.uid)}
                                                                        >{"Reject"}
                                                                        </Button>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "creator" ?
                                                                        <Popconfirm
                                                                            title="Are you sure update this event?"
                                                                            onConfirm={() => handleDeleteEvent(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                className="event__btn"
                                                                                icon={<EditOutlined />} >{"Edit"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "creator" ?
                                                                        <Popconfirm
                                                                            title="Are you sure delete this event?"
                                                                            onConfirm={() => handleDeleteEvent(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                className="event__btn"
                                                                                icon={<DeleteOutlined />} >{"Delete"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }

                                                                <Modal
                                                                    title="QR code"
                                                                    visible={visible}
                                                                    onOk={hideDownload}
                                                                    onCancel={hideModal}
                                                                    okText="DOWNLOAD"
                                                                    cancelText="CANCEL"
                                                                    style={{ textAlign: 'center' }}
                                                                >
                                                                    <QRCode
                                                                        id='qrcode'
                                                                        value={qrCode}
                                                                        fgColor="#000000"
                                                                        size={300}
                                                                        level={'H'}
                                                                        includeMargin={false}
                                                                    />
                                                                </Modal>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </div>
                                    </Badge.Ribbon>
                                    :
                                    <Badge.Ribbon text="OFFLINE" color="#F7941D" style={{ paddingRight: 20 }}>
                                        <div id="event_container__list" style={{ padding: 12 }}>
                                            <Card bordered={false} style={{ borderRadius: 6 }}>
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} span={6}>
                                                        {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} className="image_event" alt="" style={{ height: 165, width: '100%' }}></img> : <img className="image_event" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
                                                    </Col>
                                                    <Col style={{ paddingRight: 0 }} span={7}>
                                                        <Title style={{ marginBottom: 1, color: '#d4380d', fontSize: 15.5, fontFamily: 'Inter, sans-serif' }} level={5}>{eventDetail.event_name}</Title>
                                                        <p style={{ margin: 0, fontSize: 14, marginBottom: 1 }}>{eventDetail.createdBy?.firstName ? <UserOutlined /> : <HomeOutlined />}
                                                            <u style={{ paddingLeft: 5 }}>
                                                                {eventDetail.organization}
                                                            </u>
                                                        </p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                        </svg>{eventDetail.location}</p>
                                                        <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                        </svg>  {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Attendance: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status.toUpperCase()}</Tag></p>
                                                    </Col>
                                                    <Col style={{ paddingLeft: 0, paddingRight: 0 }} span={6}>
                                                        <p style={{ margin: 0, fontSize: 14 }} className="event_container__fixLine" dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
                                                    </Col>
                                                    <Col style={{ paddingLeft: 0, paddingRight: 0, width: 10 }} span={0}>
                                                    </Col>
                                                    <Col style={{ textAlign: "center", float: "left" }} span={5}>
                                                        <div style={{ borderLeft: '1px solid #D3D3D3', height: '100%', float: "left", paddingRight: 2 }}></div>
                                                        <div className="event__button-wrap">
                                                            <Row
                                                                justify="center"
                                                            >
                                                                <Button
                                                                    className="event__btn"
                                                                    icon={<EyeOutlined />}
                                                                    onClick={() => handleDetaisView(eventDetail.uid)}
                                                                >{"View"}
                                                                </Button>
                                                                {
                                                                    checkAuth() === "admin" || checkAuth() == "approval" ?
                                                                        <Popconfirm
                                                                            title="Are you sure approval this event?"
                                                                            onConfirm={() => showModalUser(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                shape="round"
                                                                                className="event__btn"
                                                                                icon={<CheckOutlined />} >{"Approval"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "admin" || checkAuth() == "approval" ?
                                                                        <Button
                                                                            shape="round"
                                                                            className="event__btn"
                                                                            icon={<DeleteOutlined />}
                                                                            onClick={() => handleCancelEvent(eventDetail.uid)}
                                                                        >{"Reject"}
                                                                        </Button>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "creator" ?
                                                                        <Popconfirm
                                                                            title="Are you sure update this event?"
                                                                            onConfirm={() => handleDeleteEvent(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                className="event__btn"
                                                                                icon={<EditOutlined />} >{"Edit"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }
                                                                {
                                                                    checkAuth() === "creator" ?
                                                                        <Popconfirm
                                                                            title="Are you sure delete this event?"
                                                                            onConfirm={() => handleDeleteEvent(eventDetail.uid)}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <Button
                                                                                className="event__btn"
                                                                                icon={<DeleteOutlined />} >{"Delete"}
                                                                            </Button>
                                                                        </Popconfirm>
                                                                        : ""
                                                                }

                                                                <Modal
                                                                    title="QR code"
                                                                    visible={visible}
                                                                    onOk={hideDownload}
                                                                    onCancel={hideModal}
                                                                    okText="DOWNLOAD"
                                                                    cancelText="CANCEL"
                                                                    style={{ textAlign: 'center' }}
                                                                >
                                                                    <QRCode
                                                                        id='qrcode'
                                                                        value={qrCode}
                                                                        fgColor="#000000"
                                                                        size={300}
                                                                        level={'H'}
                                                                        includeMargin={false}
                                                                    />
                                                                </Modal>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </div>
                                    </Badge.Ribbon>
                                }
                            </div>
                        </div>
                    )
                })
                }
                <Modal
                    title="Event Score"
                    visible={visibleUser}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleAttendanceScore(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancelUser}
                    okText="Add"
                    cancelText="Cancel"
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Alert
                            style={{ marginBottom: 20 }}
                            message=" Note when entering the score:"
                            description="The number of the score at the milestone from 1 to 100 points corresponding to each event"
                            type="warning"
                        />
                        <Form.Item
                            name="scope"
                            label="Score"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your score!',
                                },
                                {
                                    required: true,
                                    pattern: /^[-+]?\d+$/,
                                    message: "Number of score must be integer and contain just number!"
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber min={1} max={100} placeholder="Score" style={{ width: "100%" }} />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Reject Event"
                    visible={visibleReject}
                    onOk={() => {
                        formReject
                            .validateFields()
                            .then((values) => {
                                formReject.resetFields();
                                handleRejectEvent(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancelReject}
                    okText="Reject"
                    cancelText="Cancel"
                >
                    <Form
                        form={formReject}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="note"
                            label="Reject reason"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your reject reason!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <TextArea rows={4} style={{ width: "100%" }} placeholder="Reject reason" />
                        </Form.Item>
                    </Form>
                </Modal>
                <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default Home;