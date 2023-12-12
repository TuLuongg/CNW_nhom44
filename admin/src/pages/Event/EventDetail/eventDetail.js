import React, { useState, useEffect } from "react";
import "./eventDetail.css";
import QRCode from 'qrcode.react';
import userApi from "../../../apis/userApi";
import { useParams } from "react-router-dom";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { Col, Row, Tag, Spin, Card } from "antd";
import { DateTime } from "../../../utils/dateTime";
import axiosClient from "../../../apis/axiosClient";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Typography, Button, Modal, Input, Badge, Select, Form, Tabs, Popconfirm, notification, Alert, InputNumber, Rate, Descriptions, Empty, Statistic } from 'antd';
import { HistoryOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, QrcodeOutlined, AppstoreAddOutlined, ExclamationCircleOutlined, UserOutlined, StarOutlined, MehOutlined, SmileOutlined, TeamOutlined, HomeOutlined, FrownOutlined, CheckOutlined } from '@ant-design/icons';

const containerStyle = {
    width: "100%",
    height: '400px'
};

const center = {
    lat: 16.060269977440598,
    lng: 108.20984466888396
};

const centerQT = {
    lat: 16.074926901030143,
    lng: 108.22292498371291
};

const centerHK = {
    lat: 16.049688044658048,
    lng: 108.16043358186133
};

const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const EventDetail = () => {

    const [eventDetail, setEventDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleUser, setVisibleUser] = useState(false);
    const [visible, setVisible] = useState(false);
    const [uid, setUid] = useState(false);
    const [form] = Form.useForm();
    const [role, setRole] = useState();
    const [qrCode, setQrCode] = useState();
    const [dataForm, setDataForm] = useState();
    const [dataStatistical, setDataStatistical] = useState([]);

    let { id } = useParams();
    const history = useHistory();

    const getDataStatistical = async () => {
        try {
            await axiosClient.get("/event/" + id + "/statistical")
                .then(response => {
                    setDataStatistical(response.statistics);
                }
                );

        } catch (error) {
            throw error;
        }
    }

    const onFinish = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            let template_uid = eventDetail.template_feedback.uid;
            const formatData = {
                "question": values.data
            }
            await axiosClient.post("/event/" + id + "/template_feedback/" + template_uid + "/question", formatData)
                .then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Template create failed',

                        });
                        setLoading(false);
                    }
                    else {
                        notification["success"]({
                            message: `Notification`,
                            description:
                                'Successfully Template create',

                        });
                        setLoading(false);
                    }
                }
                );

        } catch (error) {
            throw error;
        }
    };

    const customIcons = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

    const handleListEvent = async () => {
        try {
            const response = await eventApi.getDetailEvent(id);
            console.log(response);
            setEventDetail(response);

        } catch (error) {
            console.log('Failed to fetch event detail:' + error);
        }
    }

    const handleAttendanceScore = async (values) => {
        setVisibleUser(false);
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
                    handleListEvent();
                }
            }
            );
        } catch (error) {
            throw error;
        }
    };

    const handleCancelEvent = async (id) => {
        try {
            await eventApi.cancelEvent(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Approve Event Failed',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully Approve Event',

                    });
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

    const handleGeneralMeeting = (uid) => {
        (async () => {
            try {
                await eventApi.generateEvent(uid).then((event) => {
                    if (event === undefined) {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Generate link meeting to the event failed',

                        });
                    }
                    else {
                        notification["success"]({
                            message: `Notification`,
                            description:
                                'Successfully generate link meeting to the event',

                        });
                        handleListEvent();
                    }
                });
                ;


            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }

    function showConfirm(uid) {
        confirm({
            title: 'Do you want to generate meeting these event online?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                handleGeneralMeeting(uid);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const handleShowQRCode = async (id) => {
        try {
            const response = await eventApi.showDetailQrCode(id);
            setQrCode(response.qr_code);
            console.log(response.qr_code);
            setVisible(true);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const hideModal = () => {
        setVisible(false);
    };

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

    const hideDownload = () => {
        downloadQR();
        setVisible(false);
    }

    const handleCreateQRCode = async (id) => {
        setLoading(true);
        try {
            const response = await eventApi.createQRCode(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'QR Code create failed',
                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully QR Code',

                    });
                    setLoading(false);
                    handleListEvent();
                }
            }
            );
            console.log(response.qr_code);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const onViewParticipant = () => {
        history.push("/organizing-details/" + id)
    }

    useEffect(() => {
        (async () => {
            try {
                await eventApi.getDetailEvent(id).then((item) => {
                    setEventDetail(item);
                    return axiosClient.get("/event/" + id + "/template_feedback/" + item.template_feedback.uid + "/question")
                        .then(response => {
                            setDataForm(response);
                            console.log(response.length)
                            let tabs = [];
                            for (let i = 0; i < response.length; i++) {
                                tabs.push({
                                    is_rating: response[i]?.is_rating,
                                    content: response[i]?.content,
                                    uid: response[i]?.uid
                                })
                            }
                            console.log(tabs)
                            form.setFieldsValue({
                                data: tabs
                            })
                            setLoading(false);
                        }
                        );
                });

                const role = await userApi.pingRole();
                setRole(role.role);

                getDataStatistical();

            } catch (error) {
                console.log('Failed to fetch event detail:' + error);
            }
        })();
        window.scrollTo(0, 0);
    }, [])

    return (
        <div>
            <Spin spinning={loading}>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="Event Details" key="1">
                        <Card className="event-detail" title="Event Detail">
                            {eventDetail.is_online == true ?
                                <Badge.Ribbon text="ONLINE">
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col>
                                            <div className="event-detail__image"
                                            >
                                                <img className="event-detail__image-one" src={eventDetail.avatar} style={{ width: 450, height: 300 }} alt='spaceship' />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="event-detail__content">
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} >
                                                        <Title style={{ marginBottom: 1, color: '#d4380d' }} level={5}>{eventDetail?.event_name}</Title>
                                                        <p style={{ margin: 0, fontSize: 14 }}>{eventDetail?.organization ? <UserOutlined /> : <HomeOutlined />}
                                                            <u style={{ paddingLeft: 5 }}>
                                                                {eventDetail?.organization}
                                                            </u>
                                                        </p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                        </svg>{eventDetail?.location}</p>
                                                        <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                        </svg>   {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                        <p style={{ padding: 0, fontSize: 14, margin: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
                                                        {eventDetail.status == "accept" ?
                                                            <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status?.toUpperCase()}</Tag></p> :
                                                            eventDetail.status == "pending" ? <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="geekblue">{eventDetail.status?.toUpperCase()}</Tag></p> :
                                                                <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="default">{eventDetail.status?.toUpperCase()}</Tag></p>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    {
                                                        !eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure approve this event?"
                                                                onConfirm={() => showModalUser(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<CheckOutlined />} >{"Approve"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        eventDetail.status != "pending" ?
                                                            <Button
                                                                shape="round"
                                                                icon={<UserOutlined />} onClick={onViewParticipant} >{"View Participants"}
                                                            </Button> : ""
                                                    }
                                                    {
                                                        eventDetail.creator_event?.is_creator == true && eventDetail.creator_event?.is_qr_code == true ?
                                                            <Button
                                                                shape="round"
                                                                icon={<QrcodeOutlined />}
                                                                onClick={() => handleShowQRCode(eventDetail.uid)}
                                                            >{"View QR"}
                                                            </Button>
                                                            : eventDetail.creator_event?.is_creator == true && eventDetail.status == "accept" ?
                                                                <Popconfirm
                                                                    title="Are you sure create this QR code?"
                                                                    onConfirm={() => handleCreateQRCode(eventDetail.uid)}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Button
                                                                        shape="round"
                                                                        icon={<AppstoreAddOutlined />} >{"Create QR"}
                                                                    </Button>
                                                                </Popconfirm> : ""
                                                    }
                                                    {
                                                        !eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure reject this event?"
                                                                onConfirm={() => handleCancelEvent(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<DeleteOutlined />} >{"Reject"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        eventDetail.calendar.meeting_url == false && eventDetail.status == "accept" ?
                                                            <Button
                                                                shape="round"
                                                                icon={<AppstoreAddOutlined />}
                                                                onClick={() => showConfirm(eventDetail.uid)}>{"General Link"}
                                                            </Button> : eventDetail.is_online == true && eventDetail.status == "accept" ?
                                                                <a href={eventDetail.calendar.meeting_url}>
                                                                    <Button
                                                                        shape="round"
                                                                        icon={<AppstoreAddOutlined />}>{"Join Event"}
                                                                    </Button>
                                                                </a> : ""
                                                    }
                                                    {
                                                        eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure approve this event?"
                                                                onConfirm={() => showModalUser(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<CheckOutlined />}>{"Approve"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure reject this event?"
                                                                onConfirm={() => handleCancelEvent(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<DeleteOutlined />}>{"Reject"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                </Badge.Ribbon> : <Badge.Ribbon color="#F7941D" text="OFFLINE">
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col>
                                            <div className="event-detail__image"
                                            >
                                                <img className="event-detail__image-one" src={eventDetail.avatar} style={{ width: 450, height: 300 }} alt='spaceship' />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="event-detail__content">
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} >
                                                        <Title style={{ marginBottom: 1, color: '#d4380d' }} level={5}>{eventDetail?.event_name}</Title>
                                                        <p style={{ margin: 0, fontSize: 14 }}>{eventDetail?.organization ? <UserOutlined /> : <HomeOutlined />}
                                                            <u style={{ paddingLeft: 5 }}>
                                                                {eventDetail?.organization}
                                                            </u>
                                                        </p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                        </svg>{eventDetail?.location}</p>
                                                        <p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-week" viewBox="0 0 16 16">
                                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                                                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                                                        </svg>   {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                        <p style={{ padding: 0, fontSize: 14, margin: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
                                                        {eventDetail.status == "accept" ?
                                                            <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="geekblue">{eventDetail.status?.toUpperCase()}</Tag></p> :
                                                            eventDetail.status == "pending" ? <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="red">{eventDetail.status?.toUpperCase()}</Tag></p> :
                                                                <p style={{ padding: 0, fontSize: 14 }}><HistoryOutlined /> Status: <Tag color="default">{eventDetail.status?.toUpperCase()}</Tag></p>
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    {
                                                        !eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure approve this event?"
                                                                onConfirm={() => showModalUser(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<CheckOutlined />} >{"Approve"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        !eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure reject this event?"
                                                                onConfirm={() => handleCancelEvent(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<DeleteOutlined />} >{"Reject"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        eventDetail.status != "pending" ?
                                                            <Button
                                                                shape="round"
                                                                icon={<UserOutlined />} onClick={onViewParticipant} >{"View Participants"}
                                                            </Button> : ""
                                                    }
                                                    {
                                                        eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure approve this event?"
                                                                onConfirm={() => showModalUser(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<CheckOutlined />}>{"Approve"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                    {
                                                        eventDetail.creator_event?.is_creator && eventDetail.status == "pending" && role != "creator" ?
                                                            <Popconfirm
                                                                title="Are you sure reject this event?"
                                                                onConfirm={() => handleCancelEvent(eventDetail.uid)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Button
                                                                    shape="round"
                                                                    className="event__btn__detail"
                                                                    icon={<DeleteOutlined />}>{"Reject"}
                                                                </Button>
                                                            </Popconfirm>
                                                            : ""
                                                    }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Badge.Ribbon>}
                        </Card>
                        <Modal
                            title="Approve Event"
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
                                    description="The corresponding number of points at the milestone from 1 to 100 points corresponding to each event"
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
                        <Card className="event-detail" >
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col>
                                    <p style={{ margin: 0, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <h4><strong>Type Event</strong></h4>
                            </Row>
                            <Row>
                                {eventDetail.type_event?.map((item, index) => {
                                    return (
                                        <Tag key={index} style={{ marginRight: 5, marginTop: 0, fontSize: 13 }}>{item.toUpperCase()}</Tag>
                                    )
                                })}
                            </Row>
                        </Card>
                        <Card className="event-detail" >
                            <LoadScript
                                googleMapsApiKey="AIzaSyDWFEQkm-VD4QPVVYKgFvsYUOFE1MjID5w"
                            >
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={eventDetail.location == "03 Quang Trung, Đà Nẵng" ? centerQT : eventDetail.location == "245 Nguyễn Văn Linh, Đà Nẵng" ? center : centerHK}
                                    zoom={10}
                                >
                                    <Marker position={eventDetail.location == "03 Quang Trung, Đà Nẵng" ? centerQT : eventDetail.location == "245 Nguyễn Văn Linh, Đà Nẵng" ? center : centerHK} />
                                    <></>
                                </GoogleMap>
                            </LoadScript>
                        </Card>
                    </TabPane>
                    <TabPane tab="Evaluation Form" key="2">
                        <Row justify="center">
                            <div className="event-detail-content-evaluation background-eval" style={{ marginTop: 10, backgroundColor: "#CC0033", width: 950, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                <p style={{ textAlign: "center", padding: 5, paddingTop: 10, paddingBottom: 10, marginTop: 10, color: "#FFFFFF" }}><strong>Evaluation Form</strong></p>
                            </div>
                        </Row>
                        {eventDetail.is_close == false ?
                            <Row justify="center">
                                <Card className="event-detail-content-evaluation" >
                                    <div style={{ width: 900 }}>
                                        <Form form={form} name="dynamic_form_nest_item"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                        >
                                            <Form.List name="data" style={{ width: "100%" }}>
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(field => (
                                                            <Row key={field.key} align="baseline"
                                                                style={{ width: "100%" }}>
                                                                <Form.Item
                                                                    noStyle
                                                                    shouldUpdate={(prevValues, curValues) =>
                                                                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                                                    }
                                                                >
                                                                    {() => (
                                                                        <Form.Item
                                                                            {...field}
                                                                            label="Select"
                                                                            name={[field.name, 'is_rating']}
                                                                            fieldKey={[field.fieldKey, 'is_rating']}
                                                                            style={{ marginRight: 30 }}
                                                                            rules={[{ required: true, message: 'Please enter type' }]}
                                                                        >
                                                                            <Select style={{ width: 130 }}>
                                                                                <Option value="true">Rating</Option>
                                                                                <Option value="false">Text Area</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    )}
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    label="Question"
                                                                    name={[field.name, 'content']}
                                                                    fieldKey={[field.fieldKey, 'content']}
                                                                    rules={[{ required: true, message: 'Please enter content' }]}
                                                                >
                                                                    <Input style={{ width: 500 }} ></Input>
                                                                </Form.Item>

                                                                <MinusCircleOutlined style={{ marginLeft: 10 }} onClick={() => remove(field.name)} />

                                                            </Row>
                                                        ))}
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Add option
                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                            <Form.Item>
                                                <Row justify="end">
                                                    <Button type="primary" htmlType="submit">
                                                        Create
                                                </Button>
                                                </Row>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </Card>
                            </Row>
                            : <Row justify="center">
                                <Card className="event-detail-content-evaluation" >
                                    <div style={{ width: 900 }}>
                                        <Form form={form} name="dynamic_form_nest_item"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                        >
                                            <Form.List name="data" style={{ width: "100%" }}>
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(field => (
                                                            <Row key={field.key} align="baseline"
                                                                style={{ width: "100%" }}>
                                                                <Form.Item
                                                                    noStyle
                                                                    shouldUpdate={(prevValues, curValues) =>
                                                                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                                                    }
                                                                >
                                                                    {() => (
                                                                        <Form.Item
                                                                            {...field}
                                                                            label="Select"
                                                                            name={[field.name, 'is_rating']}
                                                                            fieldKey={[field.fieldKey, 'is_rating']}
                                                                            style={{ marginRight: 30 }}
                                                                            rules={[{ required: true, message: 'Please enter type' }]}
                                                                        >
                                                                            <Select style={{ width: 130 }} disabled >
                                                                                <Option value="true">Rating</Option>
                                                                                <Option value="false">Text Area</Option>
                                                                            </Select>
                                                                        </Form.Item>
                                                                    )}
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...field}
                                                                    label="Question"
                                                                    name={[field.name, 'content']}
                                                                    fieldKey={[field.fieldKey, 'content']}
                                                                    rules={[{ required: true, message: 'Please enter content' }]}
                                                                >
                                                                    <Input style={{ width: 500 }} disabled ></Input>
                                                                </Form.Item>
                                                            </Row>
                                                        ))}
                                                    </>
                                                )}
                                            </Form.List>
                                        </Form>
                                    </div>
                                </Card>
                            </Row>}
                    </TabPane>
                    <TabPane tab="Event Rating Statistics" key="3">
                        <Row justify="center">
                            <div className="event-detail-content-evaluation background-eval" style={{ marginTop: 10, backgroundColor: "#CC0033", width: 950, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                <p style={{ textAlign: "center", padding: 5, paddingTop: 10, paddingBottom: 10, marginTop: 10, color: "#FFFFFF" }}><strong>Review Collection Form</strong></p>
                            </div>
                        </Row>
                        <Row justify="center">
                            <Card className="event-detail-content-evaluation" >
                                <Row gutter={16} style={{ marginBottom: 20 }}>
                                    <Col span={12}>
                                        <Card>
                                            <Statistic
                                                title="Total Average Rating"
                                                value={dataStatistical?.total}
                                                valueStyle={{ color: '#0080ff' }}
                                                suffix={<StarOutlined />}
                                            />
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card>
                                            <Statistic
                                                title="Total Number Of Feedback"
                                                value={dataStatistical?.total_feedback}
                                                valueStyle={{ color: '#3f8600' }}
                                                suffix={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
                                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                                </svg>}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                                <div style={{ width: 900 }}>
                                    {dataStatistical?.question_rating?.map((item, index) => {
                                        return (
                                            <div>
                                                <Descriptions layout="vertical" bordered>
                                                    <Descriptions.Item label={item.content}>Average Rating: <Rate disabled value={item.total_rating} character={({ index }) => customIcons[index + 1]} /></Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        )
                                    })}
                                    {dataStatistical?.question_comment?.map((item, index) => {
                                        return (
                                            <div>
                                                <Descriptions layout="vertical" bordered>
                                                    <Descriptions.Item label={item.content}>{item.comment}</Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </Row>
                    </TabPane>
                </Tabs>
            </Spin>
        </div>
    );
};

export default EventDetail;
