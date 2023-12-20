import React, { useState, useEffect } from 'react';
import "./OrganizingEvent.css";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../../utils/dateTime";
import { AuditOutlined, HomeOutlined } from '@ant-design/icons';
import { Spin, Space, Card, Table, BackTop, Tag, Breadcrumb, Pagination} from 'antd';

const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const OrganizingEvent = () => {

    const [eventOrganizing, setEventOrganizing] = useState([]);
    const [eventTemp, setEventTemp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalEventOrganizing, setTotalEventOrganizing] = useState(Number);
    const [page, setPage] = useState(1);
    const [emailEvent, setEmailEvent] = useState([]);

    const history = useHistory();

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
            title: 'Event Name',
            dataIndex: 'event_name',
            key: 'event_name',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization'
        },
        {
            title: 'Start Time',
            dataIndex: 'start_at',
            key: 'start_at',
            render: (start_at) => (
                <Space size="middle">
                    <p className="start_Time">{DateTime(start_at, DATE_TIME_FORMAT)}</p>
                </Space>
            ),
            width: '15%',
        },
        {
            title: 'End Time',
            dataIndex: 'end_at',
            key: 'end_at',
            render: (end_at) => (
                <Space size="middle">
                    <p className="end_Time">{DateTime(end_at, DATE_TIME_FORMAT)}</p>
                </Space>
            ),
            width: '15%',
        },
        {
            title: 'Number',
            dataIndex: 'size',
            key: 'size',
            render: (text, row) => (
                <Space size="middle">
                    <p style={{ margin: 0 }}>{row.count_join_event}/{text}</p>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Space size="middle">
                    {
                        <Tag color="blue" key={isActive}>
                            ONGOING
                        </Tag>
                    }
                </Space>
            ),
        },
        {
            title: 'Event Status',
            dataIndex: 'is_online',
            key: 'is_online',
            render: (text) => (
                <Space size="middle">
                    {
                        text == true ?
                            <Tag color="cyan" key={text}>
                                ONLINE
                        </Tag> :
                            <Tag color="orange" key={text}>
                                OFFLINE
                    </Tag>
                    }
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => handleViewDetails(record.uid)}>View</a>
                </Space>
            ),
        },
    ];

    const handleViewDetails = async (id) => {
        history.push("/organizing-details/" + id)
    }

    const handleChangPage = async (page) => {
        try {
            setLoading(true);
            const response = await eventApi.listOrganizingEvent(page);
            setEventOrganizing(response.data);
            setTotalEventOrganizing(response.total_count);
            setLoading(false);
            setPage(page);
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await eventApi.listOrganizingEvent();
                setEventOrganizing(response.data);
                setTotalEventOrganizing(response.total_count);
                setLoading(false);
                ;
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
                            <AuditOutlined />
                            <span>UpComing Event</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div style={{ marginTop: 15, marginRight: 15, marginLeft: 10 }}>
                    <div id="organizing_event">
                        <div id="organizing_event_container">
                            <Card title="UpComing Event" bordered={false} >
                                <Table columns={columns} dataSource={eventOrganizing} pagination={false} />
                            </Card>
                            <Pagination style={{ textAlign: "right", padding: 20, paddingTop: 0 }} current={page} defaultCurrent={1} total={totalEventOrganizing} onChange={handleChangPage}></Pagination>
                        </div>
                    </div>
                    
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default OrganizingEvent;