import React, { useState, useEffect } from 'react';
import "./eventApproved.css";
import QRCode from 'qrcode.react';
import userApi from "../../../apis/userApi";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../../utils/dateTime";
import { Col, Row, Typography, Spin, Button, PageHeader, Card, Input, Badge, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Empty, Space } from 'antd';
import { ContainerOutlined, EyeOutlined, UserAddOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, ExclamationCircleOutlined, QrcodeOutlined, PlusOutlined, AppstoreAddOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const EventApproved = () => {

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [totalEvent, setTotalEvent] = useState(Number);
    const [currentPage, setCurrentPage] = useState(1);
    const [qrCode, setQrCode] = useState();
    const [role, setRole] = useState();

    const history = useHistory();

    const hideModal = () => {
        setVisible(false);
    };

    const hideDownload = () => {
        downloadQR();
        setVisible(false);
    }

    const handleModal = () => {
        history.push("/event-create");
    }

    const handleListEvent = async () => {
        try {
            const response = await eventApi.getListEventsApproved();
            setEvent(response.data);
            setTotalEvent(response.total_count);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleShowQRCode = async (id) => {
        try {
            const response = await eventApi.showDetailQrCode(id);
            setQrCode(response.qr_code);
            setVisible(true);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
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
                    setCurrentPage(1);
                    handleListEvent();
                }
            }
            );
            console.log(response.qr_code);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    //phân trang tin tuyển
    const handlePage = async (page) => {
        window.scrollTo(0, 0);
        setLoading(true);
        try {
            const response = await eventApi.getListEventsApproved(page);
            setEvent(response.data);
            setTotalEvent(response.total_count);
            setCurrentPage(page);
            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDetailView = (id) => {
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

    const handleFilter = async (name) => {
        try {
            const response = await eventApi.searchEventNameApproval(name.target.value);
            setEvent(response.data);
        } catch (error) {
            console.log('search to fetch event list:' + error);
        }
    }

    function showConfirm(uid) {
        confirm({
            title: 'Do you want to generate meeting these event online?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                handleGeneralMeeting(uid);
            },
            onCancel() {
            },
        });
    }

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

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await eventApi.getListEventsApproved();
                setEvent(response.data);
                setTotalEvent(response.total_count);
                setLoading(false);
                const role = await userApi.pingRole();
                setRole(role.role);
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
                            <span>Event Approved</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div id="event">
                    <div id="event_container__approve">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14 }}
                        >
                            <Row>
                                <Row>
                                    <Input
                                        placeholder="Search by name"
                                        allowClear
                                        style={{ width: 300 }}
                                        onChange={handleFilter}
                                    />
                                </Row>
                            </Row>
                        </PageHeader>
                    </div>
                </div>
                {event.length == 0 ?
                    <div id="event" style={{ background: "#FFFFFF", padding: 80 }} >
                        <NoData />
                    </div>
                    :
                    ""}
                {event.map((eventDetail) => {
                    return (
                        <div key={eventDetail.uid}>
                            <div id="event">
                                {eventDetail.is_online == true ?
                                    <Badge.Ribbon text="ONLINE" style={{ paddingRight: 20 }}>
                                        <div id="event_container__approve" style={{ padding: 12 }}>
                                            <Card bordered={false} style={{ borderRadius: 6 }}>
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} span={6}>
                                                        {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} className="image_event__approve" alt="" style={{ height: 165, width: '100%' }}></img> : <img className="image" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
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
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">{eventDetail.status.toUpperCase()}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                            <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                        </svg>Score: <Tag color="geekblue">{eventDetail?.scope}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><UserAddOutlined /> Approve By: <Tag color="volcano">{eventDetail?.handel_by}</Tag></p>
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
                                                                    onClick={() => handleDetailView(eventDetail.uid)}
                                                                >{"View"}
                                                                </Button>
                                                                {
                                                                    eventDetail.creator_event.qr_code_string && role != "approval" ?
                                                                        <Button
                                                                            shape="round"
                                                                            className="event__btn"
                                                                            icon={<QrcodeOutlined />}
                                                                            onClick={() => handleShowQRCode(eventDetail.uid)}
                                                                        >{"View QR"}
                                                                        </Button>
                                                                        : !eventDetail.creator_event.qr_code_string && role != "approval" ?
                                                                            <Popconfirm
                                                                                title="Are you sure create this QR code?"
                                                                                onConfirm={() => handleCreateQRCode(eventDetail.uid)}
                                                                                okText="Yes"
                                                                                cancelText="No"
                                                                            >
                                                                                <Button
                                                                                    className="event__btn"
                                                                                    icon={<AppstoreAddOutlined />} >{"Create QR"}
                                                                                </Button>
                                                                            </Popconfirm> : ""
                                                                }
                                                                {
                                                                    eventDetail.calendar?.meeting_url == false && eventDetail.status == "accept" && role != "approval" ?
                                                                        <Button
                                                                            className="event__btn"
                                                                            icon={<AppstoreAddOutlined />}
                                                                            onClick={() => showConfirm(eventDetail.uid)}>{"General Link"}
                                                                        </Button> : eventDetail.is_online == true && eventDetail.status == "accept" ?
                                                                            <a href={eventDetail.calendar?.meeting_url}>
                                                                                <Button
                                                                                    className="event__btn"
                                                                                    icon={<AppstoreAddOutlined />}>{"Join Event"}
                                                                                </Button>
                                                                            </a> : ""
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
                                    </Badge.Ribbon> :
                                    <Badge.Ribbon text="OFFLINE" color="#F7941D" style={{ paddingRight: 20 }}>
                                        <div id="event_container__approve" style={{ padding: 12 }}>
                                            <Card bordered={false} style={{ borderRadius: 6 }}>
                                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                    <Col style={{ paddingRight: 0 }} span={6}>
                                                        {eventDetail?.avatar?.length > 0 ? <img src={eventDetail.avatar} className="image_event__approve" alt="" style={{ height: 165, width: '100%' }}></img> : <img className="image" style={{ height: 160, width: '97%' }} alt="" src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg' ></img>}
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
                                                        </svg> {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail.count_join_event}/{eventDetail.size}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined /> Status: <Tag color="green">{eventDetail.status.toUpperCase()}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock" viewBox="0 0 16 16">
                                                            <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0zM6 9.3v2.4c0 .042.02.107.105.175A.637.637 0 0 0 6.5 12h3a.64.64 0 0 0 .395-.125c.085-.068.105-.133.105-.175V9.3c0-.042-.02-.107-.105-.175A.637.637 0 0 0 9.5 9h-3a.637.637 0 0 0-.395.125C6.02 9.193 6 9.258 6 9.3z" />
                                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                        </svg> Score: <Tag color="geekblue">{eventDetail?.scope}</Tag></p>
                                                        <p style={{ padding: 0, fontSize: 14, }}><UserAddOutlined /> Approve By: <Tag color="volcano">{eventDetail?.handel_by}</Tag></p>

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
                                                                    onClick={() => handleDetailView(eventDetail.uid)}
                                                                >{"View"}
                                                                </Button>
                                                                {
                                                                    eventDetail.creator_event.qr_code_string ?
                                                                        <Button
                                                                            shape="round"
                                                                            className="event__btn"
                                                                            icon={<QrcodeOutlined />}
                                                                            onClick={() => handleShowQRCode(eventDetail.uid)}
                                                                        >{"View QR"}
                                                                        </Button>
                                                                        : !eventDetail.creator_event.qr_code_string && role != "approval" && eventDetail.creator_event.is_creator == false ?
                                                                            <Popconfirm
                                                                                title="Are you sure create this QR code?"
                                                                                onConfirm={() => handleCreateQRCode(eventDetail.uid)}
                                                                                okText="Yes"
                                                                                cancelText="No"
                                                                            >
                                                                                <Button
                                                                                    className="event__btn"
                                                                                    icon={<AppstoreAddOutlined />} >{"Create QR"}
                                                                                </Button>
                                                                            </Popconfirm> : eventDetail.creator_event.is_creator == true ?
                                                                                <Popconfirm
                                                                                    title="Are you sure create this QR code?"
                                                                                    onConfirm={() => handleCreateQRCode(eventDetail.uid)}
                                                                                    okText="Yes"
                                                                                    cancelText="No"
                                                                                >
                                                                                    <Button
                                                                                        className="event__btn"
                                                                                        icon={<AppstoreAddOutlined />} >{"Create QR"}
                                                                                    </Button>
                                                                                </Popconfirm> : ""
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
                <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default EventApproved;