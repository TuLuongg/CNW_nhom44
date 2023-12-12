import React, { useState, useEffect } from 'react';
import "./attendance.css";
import QrReader from 'react-qr-reader';
import eventApi from "../../apis/eventApi";
import { useHistory } from 'react-router-dom';
import { Spin, notification, Modal } from 'antd';

const Attendance = () => {

    const [dataScan, setDataScan] = useState();
    const [loading, setLoading] = useState(true);
    const [visibleModal, setVisibleModal] = useState();
    const [processScan, setProcessScan] = useState(false);

    const history = useHistory();

    function handleScan(data) {
        if (data) {
            setVisibleModal(true);
            setDataScan(data);
            setProcessScan(true);
        }
    }

    const handleAttendance = () => {
        if (dataScan) {
            (async () => {
                try {
                    await eventApi.attendanceByQRCode(dataScan).then(response => {
                        if (response === undefined) {
                            notification["error"]({
                                message: `Notification`,
                                description:
                                    'Attendance Event Failed',

                            });
                            setVisibleModal(false);
                            setProcessScan(false);
                        }
                        else {
                            notification["success"]({
                                message: `Notification`,
                                description:
                                    'Successfully Attendance Event',

                            });
                            setProcessScan(false);
                            setVisibleModal(false);
                            history.push("/event")
                        }
                    }
                    );;

                } catch (error) {
                    console.log('Failed to fetch event list:' + error);
                }
            })();
        } else {
            notification["error"]({
                message: `Notification`,
                description:
                    'Data QR Code Failed',

            });
            setProcessScan(false);
        }
    }

    const handleCancelModalRemove = () => {
        setVisibleModal(false);
        setProcessScan(false);
    }

    const handleError = (err) => {
        console.error(err)
    }

    useEffect(() => {
        setTimeout(function () {
            setLoading(false);
        }, 500);
    }, [])

    return (
        <div>
            <Spin spinning={loading}>
                {processScan == false ?
                    <div id="qrcode" style={{ textAlign: "center", width: 250, height: 250 }}>
                        <QrReader
                            delay={1000}
                            style={{ width: '100%' }}
                            onError={handleError}
                            onScan={handleScan}
                        />
                    </div>
                    :
                    <p>Please wait for the data to be scanned</p>
                }

                <Modal
                    title="Are you sure to take this action？"
                    visible={visibleModal}
                    onOk={handleAttendance}
                    onCancel={handleCancelModalRemove}
                />
            </Spin>
        </div >
    )
}

export default Attendance;