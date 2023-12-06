import React, { useState, useEffect } from "react";
import axiosClient from "../../../apis/axiosClient";
import { useParams } from "react-router-dom";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { Row, Spin, Card } from "antd";
import { Button, Breadcrumb, notification, Form, Input, Rate } from 'antd';
import { AuditOutlined, FrownOutlined, SmileOutlined, MehOutlined, HomeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Evaluation = () => {

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
                    const test = form.getFieldsValue("is_rating").users[0].is_rating
                    console.log(test)
                }
                );

        } catch (error) {
            throw error;
        }
    }

    const customIcons = {
        1: <FrownOutlined />,
        2: <FrownOutlined />,
        3: <MehOutlined />,
        4: <SmileOutlined />,
        5: <SmileOutlined />,
    };

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
                        history.push("/event");
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
            <Spin spinning={loading}>
                <div style={{ marginLeft: "13%", marginRight: "12%", marginBottom: 10, marginTop: 30 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <AuditOutlined />
                            <span>Event</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >Event Details</Breadcrumb.Item>
                        <Breadcrumb.Item >Event Evaluation</Breadcrumb.Item>
                    </Breadcrumb>
                </div>


                <Card className="event-detail-map" title={"Event Name: " + eventDetail.event_name}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        initialValues={{
                            'input-number': 3,
                            'checkbox-group': ['A', 'B'],
                            rate: 3.5,
                        }}
                    >
                        <Form.List name="users">
                            {(fields) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Row key={field.key} style={{ display: 'flex', marginBottom: 8, marginTop: 30 }} align="baseline" justify="center">
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'uid']}
                                                fieldKey={[field.fieldKey, 'uid']}
                                            >
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'content']}
                                                fieldKey={[field.fieldKey, 'content']}
                                                style={{ width: 800 }}
                                            >
                                                <Input disabled />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'scope']}
                                                fieldKey={[field.fieldKey, 'scope']}
                                                style={
                                                    form.getFieldsValue("is_rating").users[index].is_rating ===
                                                        true
                                                        ? { display: "flex", width: 800 }
                                                        : { display: "none" }
                                                }
                                            >
                                                <Rate style={{ padding: 0, margin: 0 }} character={({ index }) => customIcons[index + 1]}></Rate>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'is_rating']}
                                                fieldKey={[field.fieldKey, 'is_rating']}
                                            >
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'comment']}
                                                fieldKey={[field.fieldKey, 'comment']}
                                                style={
                                                    form.getFieldsValue("is_rating").users[index].is_rating ===
                                                        false
                                                        ? { display: "flex", width: 800 }
                                                        : { display: "none" }
                                                }
                                            >
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Row>
                                    ))}
                                </>
                            )}
                        </Form.List>
                        {/* {dataForm.map((item, id) => {
                            return (
                                <Descriptions layout="vertical" bordered>
                                    <Descriptions.Item label={item.content}>
                                        {
                                            item.is_rating == true ?
                                                <Form.Item name="scope">
                                                    <Rate />
                                                </Form.Item> :
                                                <Form.Item name="comment">
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                        }
                                    </Descriptions.Item>
                                </Descriptions>
                            )
                        })} */}
                        <Form.Item>
                            <Row justify="end">
                                <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
                                    Submit
                                </Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>

            </Spin>
        </div >
    );
};

export default Evaluation;
