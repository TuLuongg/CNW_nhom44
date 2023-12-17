import React, { useState, useEffect } from 'react';
import "./OrganizedEvent.css";
import eventApi from "../../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../../utils/dateTime";
import { AuditOutlined, HomeOutlined } from '@ant-design/icons';
import { Spin, Space, Card, Breadcrumb, Table, BackTop, Tag, Pagination } from 'antd';

const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const OrganizedEvent = () => {

    const [event, setEvent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalEventOrganized, setTotalEventOrganized] = useState(Number);

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
                        <Tag color="green" key={isActive}>
                            CLOSE
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
        history.push("/organized-details/" + id)
    }

    const handleChangPage = async (page) => {
        try {
            setLoading(true);
            const response = await eventApi.listOrganizedEvent(page);
            setEvent(response.data);
            setTotalEventOrganized(response.total_count);
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
                const response = await eventApi.listOrganizedEvent();
                setEvent(response.data);
                setTotalEventOrganized(response.total_count);
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
                            <AuditOutlined />
                            <span>Organized Event</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{ marginTop: 20, marginRight: 15, marginLeft: 10 }}>
                    <div id="organized_event">
                        <div id="organized_event_container" >
                            <Card title="Organized Event" bordered={false} >
                                <Table columns={columns} dataSource={event} pagination={false}
                                />
                            </Card>
                            <Pagination style={{ textAlign: "right", padding: 20, paddingTop: 0 }} current={page} defaultCurrent={1} total={totalEventOrganized} onChange={handleChangPage}></Pagination>
                        </div>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default OrganizedEvent;