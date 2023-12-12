import React, { useState, useEffect } from 'react';
import "./organizedEventDetails.css";
import { useParams } from "react-router-dom";
import eventApi from "../../../../apis/eventApi";
import { AuditOutlined, HomeOutlined, CheckOutlined, ArrowUpOutlined, ArrowDownOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Spin, Space, Card, Table, BackTop, Tag, Breadcrumb, PageHeader, Row, Col, Modal, Form, Button, Select, notification, Alert, Statistic, Steps, message, Input, Result, Image } from 'antd';
import huongdan01 from "../../../../assets/image/HUONGDAN01.png";
import huongdan02 from "../../../../assets/image/HUONGDAN02.png";
import huongdan03 from "../../../../assets/image/HUONGDAN03.png";
import huongdan04 from "../../../../assets/image/HUONGDAN04.png";
import huongdan05 from "../../../../assets/image/HUONGDAN05.png";
import huongdan06 from "../../../../assets/image/HUONGDAN06.png";
import huongdan07 from "../../../../assets/image/HUONGDAN07.png";
import axiosClient from "../../../../apis/axiosClient";
import InfiniteScroll from "react-infinite-scroll-component";

const { Step } = Steps;

const OrganizedEventDetails = () => {

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalEvent, setTotalEvent] = useState(Number);
    const [page, setPage] = useState(1);
    const [statistic, setStatistic] = useState([]);
    const [visibleExcel, setVisibleExcel] = useState(false);
    const [current, setCurrent] = useState(0);
    const [formExportExcel] = Form.useForm();

    let { id } = useParams();

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'index',
            render: (value, item, index) => (
                (page - 1) * 10 + (index + 1)
            ),
        },
        {
            title: 'Id',
            dataIndex: 'id_student',
            key: 'id_student',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Class',
            dataIndex: 'class_activity',
            key: 'class_activity',
        },
        {
            title: 'Status',
            dataIndex: 'is_attendance',
            key: 'is_attendance',
            render: (is_attendance, record) => (
                <Space size="middle">
                    {
                        record.is_cancel == true ?
                            <Tag color="default" >
                                Cancel
                        </Tag> :
                            is_attendance === false ?
                                <Tag color="red" >
                                    No Attendance
                        </Tag> : <Tag color="blue" >
                                    Have Attended
                        </Tag>
                    }

                </Space>
            ),
        },
    ];

    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const showModalExcel = () => {
        setVisibleExcel(true);
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleOkExportExcel = async () => {
        if (formExportExcel.getFieldValue("sheet_name") == null && formExportExcel.getFieldValue("spreadsheet_key") == null) {
            message.warning('Please enter sheet name and spreadsheet key');
        } else if (formExportExcel.getFieldValue("sheet_name") == null) {
            message.warning('Please enter sheet name');
        } else if (formExportExcel.getFieldValue("spreadsheet_key") == null) {
            message.warning('Please enter the spreadsheet key');
        } else {
            setLoading(true);
            try {
                const value = {
                    "spreadsheet": {
                        "spreadsheet_key": formExportExcel.getFieldValue("spreadsheet_key"),
                        "sheet_name": formExportExcel.getFieldValue("sheet_name")
                    }
                }
                await axiosClient.post("/event/" + id + "/take_part_in_event/export_list_attendance", value).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Export google sheet failed',
                        });
                    } else if (response.message === "Please double check spreadsheets_key and sheet_name. Please read the instructions.") {
                        notification["error"]({
                            message: `Notification`,
                            description:
                                'Please double check spreadsheets_key and sheet_name. Please read the instructions',
                        })
                    }
                    else {
                        notification["success"]({
                            message: `Notification`,
                            description:
                                'Successfully export google sheet',

                        });
                        setVisibleExcel(false);
                        formExportExcel.resetFields();
                        setCurrent(0);
                    }
                })
                setLoading(false);
            } catch (error) {
                throw error;
            }
        }
    }

    const cancelExportExcel = () => {
        setVisibleExcel(false);
        setCurrent(0);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await eventApi.getEventDetailStudent(id);
                setEvent(response.data);
                setTotalEvent(response.total_count);
                setLoading(false);
                setStatistic(response);
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
                        <Breadcrumb.Item href="/organized-event">
                            <AuditOutlined />
                            <span>Organized Event</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >Students Participate In The Event</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div id="event_organized">
                    <div id="event_organized__list">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="Users Attendance"
                                        value={statistic.count_attendance}
                                        valueStyle={{ color: '#0080ff' }}
                                        prefix={<CheckOutlined />}
                                        suffix={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                        </svg>}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="Users Join"
                                        value={statistic.count_join}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                        suffix={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16">
                                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                        </svg>}
                                    />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic
                                        title="Users Cancel"
                                        value={statistic.count_cancel}
                                        valueStyle={{ color: '#cf1322' }}
                                        prefix={<ArrowDownOutlined />}
                                        suffix={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-x" viewBox="0 0 16 16">
                                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                            <path fill-rule="evenodd" d="M12.146 5.146a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z" />
                                        </svg>}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div id="event_details">
                    <div id="event_container_details__list">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14 }}
                        >
                            <Row justify="end">
                                <Space>
                                    <Button icon={<VerticalAlignBottomOutlined />} onClick={() => showModalExcel()}>Export Google Sheet</Button>
                                </Space>
                            </Row>
                        </PageHeader>
                    </div>
                </div>
                <Modal
                    title="Export Goole Sheet"
                    visible={visibleExcel}
                    width={700}
                    onCancel={cancelExportExcel}
                    footer={
                        <div className="steps-action">
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => next()}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => handleOkExportExcel()}>
                                    Done
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                    Previous
                                </Button>
                            )}
                        </div>
                    }
                >
                    <>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">
                            <div>
                                {steps[current].title === "First" ?
                                    <InfiniteScroll
                                        dataLength={500}
                                        height={450}
                                    >
                                        <Form
                                            form={formExportExcel}
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
                                                message="Instructions for using the function to export data to google sheet:"
                                                type="warning"
                                            />
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 1"
                                                description="In the toolbar please enter https://docs.google.com/spreadsheets/u/0/"
                                                type="warning"
                                            />
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 2"
                                                description="Then click on the + . icon"
                                                type="warning"
                                            />
                                            <Image src={huongdan01} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 3 & 4"
                                                description="Rename sheet & Click the 'share' button to share"
                                                type="warning"
                                            />
                                            <Image src={huongdan02} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 5"
                                                description="In the input box enter the email 'id-a2s-system@a2s-system.iam.gserviceaccount.com' and click the 'final' button"
                                                type="warning"
                                            />
                                            <Image src={huongdan03} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 6 & 7"
                                                description="Adjust to 'edit' permission and press 'send'"
                                                type="warning"
                                            />
                                            <Image src={huongdan04} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 8  & 9"
                                                description="Copy the id in the red circled box and copy the sheet name"
                                                type="warning"
                                            />
                                            <Image src={huongdan05} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 10  & 11"
                                                description="Paste id in the red circled box and sheet name"
                                                type="warning"
                                            />
                                            <Image src={huongdan06} style={{ width: "100%", height: "auto" }}></Image>
                                            <Alert
                                                style={{ marginBottom: 20 }}
                                                message="Step 12"
                                                description="Then click next and press 'done' to finish"
                                                type="warning"
                                            />
                                            <Image src={huongdan07} style={{ width: "100%", height: "auto" }}></Image>
                                        </Form> 
                                        </InfiniteScroll> : steps[current].title === "Second" ?
                                        <Form
                                            form={formExportExcel}
                                            name="eventCreate"
                                            layout="vertical"
                                            initialValues={{
                                                residence: ['zhejiang', 'hangzhou', 'xihu'],
                                                prefix: '86',
                                            }}
                                            scrollToFirstError
                                        >
                                            <Form.Item
                                                name="sheet_name"
                                                label="Sheet Name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your sheet name!',
                                                    },
                                                ]}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Input placeholder="Sheet Name" />
                                            </Form.Item>

                                            <Form.Item
                                                name="spreadsheet_key"
                                                label="Spreadsheet Key"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your spreadsheet key!',
                                                    },
                                                ]}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Input placeholder="Spreadsheet Key" />
                                            </Form.Item>
                                        </Form> : <Result
                                            title="Notification"
                                            subTitle="Please click 'done' for the process to be processed. Please read the instructions carefully before clicking!"
                                        />}
                            </div>
                        </div>
                    </>
                </Modal>
                <div style={{ marginTop: 20 }}>
                    <div id="organized_event_details">
                        <div id="organized_event_details_container">
                            <Card title="Students Participate In The Event" bordered={false} >
                                <Table columns={columns} dataSource={event} pagination={{
                                    onChange(current) {
                                        setPage(current);
                                    }
                                }} />
                            </Card>
                        </div>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default OrganizedEventDetails;