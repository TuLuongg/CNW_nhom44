import React, { useState, useEffect } from "react";
import styles from "../EventDetail/eventDetail.css";
import axiosClient from "../../../apis/axiosClient";
import { useParams } from "react-router-dom";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { Col, Row, Tag, Spin, Card } from "antd";
import { DateTime } from "../../../utils/dateTime";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Typography, Button, Badge, Breadcrumb, Popconfirm, notification, Form, Input, Select} from 'antd';
import { HistoryOutlined, AuditOutlined, AppstoreAddOutlined, CloseOutlined, UserOutlined, MehOutlined, TeamOutlined, HomeOutlined, CheckOutlined } from '@ant-design/icons';

import Slider from "react-slick";

const { Meta } = Card;
const { Option } = Select;

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

const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { TextArea } = Input;

const EventDetail = () => {

    const [eventDetail, setEventDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggest, setSuggest] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataForm, setDataForm] = useState([]);
    const [lengthForm, setLengthForm] = useState();
    const [form] = Form.useForm();
    const [template_feedback, setTemplateFeedback] = useState();
    let { id } = useParams();
    const history = useHistory();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4
    };

    const settingsMobile = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const hideModal = () => {
        setVisible(false);
    };

    const handleJointEvent = async (id) => {
        try {
            await eventApi.joinEvent(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Joint Event Failed',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully Joint Event',
                    });
                    listEvent();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleCancelJointEvent = async (id) => {
        try {
            await eventApi.cancelJoinEvent(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Notification`,
                        description:
                            'Cancel Join Event Failed',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Successfully Cancel Joint Event',
                    });
                    listEvent();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const listEvent = () => {
        setLoading(true);
        (async () => {
            try {
                const response = await eventApi.getDetailEvent(id);
                console.log(response);
                setEventDetail(response);
                setLoading(false);

            } catch (error) {
                console.log('Failed to fetch event detail:' + error);
            }
        })();
        window.scrollTo(0, 0);
    }

    const handleDetailEvent = (id) => {
        history.replace("/event-detail/" + id);
        window.location.reload();
        window.scrollTo(0, 0);
    }

    const getDataForm = async (uid) => {
        try {
            await axiosClient.get("/event/" + id + "/template_feedback/" + uid + "/question")
                .then(response => {
                    console.log(response);
                    setDataForm(response);
                    let tabs = [];
                    for (let i = 0; i < response.length; i++) {
                        tabs.push({
                            content: response[i]?.content,
                            uid: response[i]?.uid,
                            is_rating: response[i]?.is_rating
                        })
                    }
                    form.setFieldsValue({
                        users: tabs
                    })
                    setLengthForm(tabs.length)
                }
                );

        } catch (error) {
            throw error;
        }
    }

    const handleDirector = () => {
        history.push("/evaluation/" + id)
    }

    const onFinish = async (values) => {
        console.log(values.users);
        let tabs = [];
        for (let i = 0; i < values.users.length; i++) {
            tabs.push({
                scope: values.users[i]?.scope == undefined ? null : values.users[i]?.scope,
                comment: values.users[i]?.comment == undefined ? null : values.users[i]?.comment,
                question_uid: values.users[i]?.uid,

            })
        }
        console.log(tabs);
        setLoading(true);
        try {
            const dataForm = {
                "answers": tabs
            }
            await axiosClient.post("/event/" + id + "/answer", dataForm)
                .then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Answer event question failed',

                        });
                        setLoading(false);
                    }
                    else {
                        notification["success"]({
                            message: `Notification`,
                            description:
                                'Successfully answer event question',

                        });
                        setLoading(false);
                        form.resetFields();
                    }
                }
                );

        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await eventApi.getDetailEvent(id).then((item) => {

                    setEventDetail(item);
                    getDataForm(item.template_feedback.uid)
                });
                const suggest = await eventApi.getSuggest();
                setSuggest(suggest);

                setLoading(false);

            } catch (error) {
                console.log('Failed to fetch event detail:' + error);
            }
        })();
        window.scrollTo(0, 0);
    }, [])

    return (
        <div>
            <Spin spinning={false}>
                <Row>
                    <div className="container_img">
                        <img className="bg-image" src={eventDetail?.avatar} style={{ width: '100%' }} alt='spaceship' />
                    </div>
                </Row>
                <Card className="event-detail" >
                    <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <AuditOutlined />
                                <span>San phẩm</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item >Chi tiết sản phẩm</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {/* {eventDetail?.is_online == true ?
                        <Badge.Ribbon text="ONLINE">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col>
                                    <div className="event-detail__image"
                                    >
                                        <img className="event-detail__image-one" src={eventDetail?.avatar} alt='spaceship' />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="event-detail__content">
                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                            <Col style={{ paddingRight: 0 }} >
                                                <Title style={{ marginBottom: 1, color: '#d4380d' }} level={5}>{eventDetail?.event_name}</Title>
                                                <p className="event_client__fixLine" style={{ margin: 0, fontSize: 14 }}>{eventDetail?.organization ? <UserOutlined /> : <HomeOutlined />}
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
                                                </svg> {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>
                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail?.count_join_event}/{eventDetail.size}</Tag></p>
                                                {
                                                    eventDetail.join_event?.attendance == false && eventDetail.join_event?.is_join_event == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined />Attendance Status: <Tag color="magenta">No Attendance</Tag></p> :
                                                    eventDetail.join_event?.attendance == true && eventDetail.join_event?.is_join_event == true ?
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined />Attendance Status: <Tag color="magenta">Have Attendance </Tag></p> : null
                                                }
                                                {eventDetail.is_close == true ? <p style={{ padding: 0, fontSize: 14 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-dash" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
                                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                                </svg> Status: <Tag color="cyan">Closed </Tag></p> :
                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-dash" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
                                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                                    </svg>Status: <Tag color="cyan">Open </Tag></p>
                                                }
                                                {
                                                    eventDetail.join_event?.is_feeback == false && eventDetail.join_event?.is_join_event == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                                                    <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
                                                  </svg> Evaluation Status: <Tag color="orange">Not Yet Rated</Tag></p> 
                                                    :  eventDetail.join_event?.is_feeback == true && eventDetail.join_event?.is_join_event == true ?
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                                                        <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
                                                      </svg>Evaluation Status: <Tag color="orange">Have Evaluation </Tag></p> : null
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            {
                                                eventDetail.join_event?.is_join_event == true && eventDetail.join_event?.attendance == false && eventDetail.is_close == false ? <Popconfirm
                                                    title="Are you sure cancel event this event?"
                                                    onConfirm={() => handleCancelJointEvent(eventDetail.uid)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        shape="round"
                                                        className="event__btn__detail"
                                                        icon={<CloseOutlined />} >{"Cancel Join"}
                                                    </Button>

                                                </Popconfirm> : eventDetail.join_event?.is_join_event == false && eventDetail.join_event?.attendance == false && eventDetail.is_close == false ?
                                                    <Popconfirm
                                                        title="Are you sure joint this event?"
                                                        onConfirm={() => handleJointEvent(eventDetail.uid)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button
                                                            shape="round"
                                                            className="event__btn__detail"
                                                            icon={<CheckOutlined />} >{"Join Event"}
                                                        </Button>

                                                    </Popconfirm> : ""
                                            }
                                            {
                                                eventDetail.calendar.meeting_url == false && eventDetail.status == "accept" && eventDetail.join_event?.is_join_event == true && eventDetail.is_close == false ?
                                                    <a href={eventDetail.calendar.meeting_url}>
                                                        <Button
                                                            disabled
                                                            shape="round"
                                                            className="event__btn__detail"
                                                            icon={<AppstoreAddOutlined />}>{"Join Online"}
                                                        </Button>
                                                    </a> : eventDetail.calendar.meeting_url.length > 0 && eventDetail.is_online == true && eventDetail.status == "accept" && eventDetail.join_event?.is_join_event == true & eventDetail.is_close == false ?
                                                        <a href={eventDetail.calendar.meeting_url}>
                                                            <Button
                                                                shape="round"
                                                                className="event__btn__detail"
                                                                icon={<AppstoreAddOutlined />}
                                                            >{"Join Online"}
                                                            </Button>
                                                        </a> : ""
                                            }
                                            {
                                              eventDetail.is_close == true && eventDetail.form_close == false && eventDetail.join_event.is_join_event && eventDetail.join_event.is_feeback != true ?
                                                    <Button
                                                        shape="round"
                                                        className="event__btn__detail"
                                                        icon={<CheckOutlined />}
                                                        onClick={() => handleDirector()}
                                                    >{"Review"}
                                                    </Button> : null
                                            }
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Badge.Ribbon>
                        : <Badge.Ribbon color="#F7941D" text="OFFLINE">
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col>
                                    <div className="event-detail__image"
                                    >
                                        <img className="event-detail__image-one" src={eventDetail?.avatar} alt='spaceship' />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="event-detail__content">
                                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                            <Col style={{ paddingRight: 0 }} >
                                                <Title className="event_client__fixLine" style={{ marginBottom: 1, color: '#d4380d' }} level={5}>{eventDetail?.event_name}</Title>
                                                <p className="event_client__fixLine" style={{ margin: 0, fontSize: 14 }}>{eventDetail?.organization ? <UserOutlined /> : <HomeOutlined />}
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
                                                </svg> {DateTime(eventDetail?.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail?.end_at, DATE_TIME_FORMAT)}</p>
                                                <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><TeamOutlined /> Number Of Participants: <Tag color="blue">{eventDetail?.count_join_event}/{eventDetail?.size}</Tag></p>
                                                {
                                                    eventDetail.join_event?.attendance == false && eventDetail.join_event?.is_join_event == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined />Attendance Status: <Tag color="magenta">No Attendance</Tag></p> :
                                                    eventDetail.join_event?.attendance == true && eventDetail.join_event?.is_join_event == true ?
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><HistoryOutlined />Attendance Status: <Tag color="magenta">Have Attendance </Tag></p> : null
                                                }
                                                {eventDetail?.is_close == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-dash" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
                                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                                </svg> Status: <Tag color="cyan">Closed </Tag></p> :
                                                    <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-dash" viewBox="0 0 16 16">
                                                        <path fill-rule="evenodd" d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
                                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                                                    </svg>Status: <Tag color="cyan">Open </Tag></p>
                                                }
                                                {
                                                    eventDetail.join_event?.is_feeback == false && eventDetail.join_event?.is_join_event == true ? <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                                                    <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
                                                  </svg> Evaluation Status: <Tag color="orange">Not Yet Rated</Tag></p> 
                                                    :  eventDetail.join_event?.is_feeback == true && eventDetail.join_event?.is_join_event == true ?
                                                        <p style={{ padding: 0, fontSize: 14, marginBottom: 1 }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                                                        <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/>
                                                      </svg>Evaluation Status: <Tag color="orange">Have Evaluation </Tag></p> : null
                                                }


                                            </Col>
                                        </Row>
                                        <Row>
                                            {
                                                eventDetail.join_event?.is_join_event == true && eventDetail.join_event?.attendance == false && eventDetail.is_close == false ? <Popconfirm
                                                    title="Are you sure cancel event this event?"
                                                    onConfirm={() => handleCancelJointEvent(eventDetail.uid)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button
                                                        shape="round"
                                                        className="event__btn__detail"
                                                        icon={<CloseOutlined />} >{"Cancel Join"}
                                                    </Button>

                                                </Popconfirm> : eventDetail.join_event?.is_join_event == false && eventDetail.join_event?.attendance == false && eventDetail.is_close == false ?
                                                    <Popconfirm
                                                        title="Are you sure joint this event?"
                                                        onConfirm={() => handleJointEvent(eventDetail.uid)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button
                                                            shape="round"
                                                            className="event__btn__detail"
                                                            icon={<CheckOutlined />} >{"Join Event"}
                                                        </Button>

                                                    </Popconfirm> : ""
                                            }
                                            {
                                              eventDetail.is_close == true && eventDetail.form_close == false && eventDetail.join_event.is_join_event && eventDetail.join_event.is_feeback != true ?
                                                    <Button
                                                        shape="round"
                                                        className="event__btn__detail"
                                                        icon={<CheckOutlined />}
                                                        onClick={() => handleDirector()}
                                                    >{"Review"}
                                                    </Button> : null
                                            }
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Badge.Ribbon>}

                </Card>
                <Card className="event-detail-content" >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col>
                            <p style={{ margin: 0, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: eventDetail.description }}></p>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <h4><strong>Type Of Event</strong></h4>
                    </Row>
                    <Row>
                        {eventDetail.type_event?.map((item, index) => {
                            return (
                                <Tag key={index} style={{ marginRight: 5, marginTop: 0, fontSize: 13 }}>{item.toUpperCase()}</Tag>
                            )
                        })}
                    </Row>
                </Card>
                <Card className="event-detail-map" >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <LoadScript
                            id="script-loader"
                            googleMapsApiKey="AIzaSyA-OdikhS2bo0Azp4wmS5kwDymGTV0FXjM"
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
                    </Row>
                </Card>

                <div className="suggest">
                    <h2 style={{ textAlign: "center" }}> Other events you may like </h2>
                    <Slider {...settings} style={{ textAlign: "center" }}>
                        {suggest?.map((item, id) => {
                            return (
                                <div>
                                    <Row justify="center">
                                        <Card
                                            hoverable
                                            style={{ width: 250, height: 280, marginBottom: 30, marginTop: 30 }}
                                            cover={<img alt="example" style={{ width: 250, height: 150 }} src={item.avatar} />}
                                            onClick={() => handleDetailEvent(item.uid)}
                                        >
                                            <Meta style={{ padding: 10, marginTop: 15 }} title={item.event_name} description={<p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}> {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>} />
                                        </Card>
                                    </Row>
                                </div>
                            )
                        })}
                    </Slider>
                </div>

                <div className="suggest-mobile">
                    <h2 style={{ textAlign: "center" }}> Other events you may like </h2>
                    <Slider {...settingsMobile} style={{ textAlign: "center" }}>
                        {suggest?.map((item, id) => {
                            return (
                                <div>
                                    <Row justify="center">
                                        <Card
                                            hoverable
                                            style={{ width: 250, height: 280, marginBottom: 30, marginTop: 30 }}
                                            cover={<img alt="example" style={{ width: 250, height: 150 }} src={item.avatar} />}
                                            onClick={() => handleDetailEvent(item.uid)}
                                        >
                                            <Meta style={{ padding: 10, marginTop: 15 }} title={item.event_name} description={<p style={{ marginTop: 5, fontSize: 14, marginBottom: 1 }}> {DateTime(eventDetail.start_at, DATE_TIME_FORMAT)} - {DateTime(eventDetail.end_at, DATE_TIME_FORMAT)}</p>} />
                                        </Card>
                                    </Row>
                                </div>
                            )
                        })}
                    </Slider>
                </div> */}
     </Card>
            </Spin>
        </div >
    );
};

export default EventDetail;
