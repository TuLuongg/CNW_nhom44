import React, { useState, useEffect } from 'react';
import "./orderList.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Badge, Empty, Input, Space,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table
} from 'antd';
import {
    AppstoreAddOutlined, QrcodeOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, ShoppingCartOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import eventApi from "../../apis/eventApi";
import orderApi from "../../apis/orderApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../utils/dateTime";
import ProductList from '../ProductList/productList';
import axiosClient from '../../apis/axiosClient';

const { Option } = Select;
const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { Title } = Typography;

const OrderList = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();

    const history = useHistory();

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const categoryList = {
                "description": values.description,
                "status": values.status
            }
            await axiosClient.put("/order/" + id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
                setTotalList(res.totalDocs)
                setOrder(res.data.docs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteOrder = async (id) => {
        setLoading(true);
        try {
            await orderApi.deleteOrder(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa đơn hàng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa đơn hàng thành công',

                    });
                    setCurrentPage(1);
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditOrder = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await orderApi.getDetailOrder(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    status: response.status,
                    address: response.address,
                    description: response.description,
                    orderTotal: response.orderTotal,
                    products: response.products,
                    user: response.user,
                    billing: response.billing,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await orderApi.searchOrder(name);
            setTotalList(res.totalDocs)
            setOrder(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.username}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.email}</a>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'orderTotal',
            key: 'orderTotal',
            render: (text) => <a>{text?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</a>,
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'billing',
            key: 'billing',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (slugs) => (
                <span >
                   {slugs === "rejected" ? <Tag style={{width: 95, textAlign: "center"}} color="red">Đã hủy</Tag> : slugs === "approved" ? <Tag style={{width: 95, textAlign: "center"}} color="geekblue" key={slugs}>
                        Vận chuyển
                    </Tag> : slugs === "final" ? <Tag color="green" style={{width: 95, textAlign: "center"}}>Đã giao</Tag> :<Tag color="blue" style={{width: 95, textAlign: "center"}}>Đợi xác nhận</Tag>}
                </span>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditOrder(record._id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div
                            style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa đơn hàng này?"
                                onConfirm={() => handleDeleteOrder(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                await orderApi.getListOrder({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setTotalList(res.totalDocs)
                    setOrder(res.data.docs);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingCartOutlined />
                                <span>Quản lý đơn hàng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }}/>
                    </div>
                </div>

                <Modal
                    title="Cập nhật đơn hàng"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select >
                                <Option value="final">Đã giao</Option>
                                <Option value="approved">Đang vận chuyển</Option>
                                <Option value="pending">Đợi xác nhận</Option>
                                <Option value="rejected">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea rows={4} placeholder="Lưu ý" />
                        </Form.Item>

                    </Form>
                </Modal>


                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={total} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default OrderList;