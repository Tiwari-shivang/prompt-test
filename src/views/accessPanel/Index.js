import React, {useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Modal, Row, Tabs} from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb";
import {Space, Switch, Table, Checkbox} from "antd";
import "./style.scss";
import "antd/dist/antd.css";
import {
    useGetAllAccessWithPermission,
    useUpdateAccessPermission,
} from "../../query/roleAccess/roleAccessQuery";

const AccessPanel = () => {
    const navigate = useNavigate();
    const mappedDataArray = [];
    const [newData, setnewData] = useState([]);
    const [role, setRole] = useState("");
    const [reloadScreen, SetReloadScreen] = useState(false);
    const {data: allAccessData, isLoading: isLoadingAllAccessData} =
        useGetAllAccessWithPermission();
    const {
        data: updateData,
        status,
        isLoading: isLoadingUpdateData,
        mutateAsync: updateMutateAsync,
    } = useUpdateAccessPermission();

    const handleUpdateValue = (row, value, Role) => {
        setRole(Role);
        const dataToSend = {
            "module_name": row.name,
            "role_name": Role,
            "access": value.target.checked,
        };
        updateMutateAsync(dataToSend);
    };

    // useEffect(() => {
    //   if(role == "Admin" && status=="success"){
    //     SetReloadScreen(true)
    //   }
    // }, [status && status])

    useEffect(() => {
        for (const key in allAccessData) {
            const mappedData = {
                ...allAccessData[key],
                name: key,
            };
            mappedDataArray.push(mappedData);
        }
        setnewData(mappedDataArray);
    }, [allAccessData]);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "User",
            dataIndex: "User",
            key: "User",
            width: "15%",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        disabled={record.name == "Admin Screen" ? true : false}
                        defaultChecked={record.User}
                        size="small"
                        onChange={(e) => {
                            handleUpdateValue(record, e, "User");
                        }}
                    />
                );
            },
        },
        {
            title: "PM",
            dataIndex: "Reporting_Managers",
            width: "15%",
            key: "Reporting_Managers",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        defaultChecked={record.Reporting_Managers}
                        size="small"
                        onChange={(e) => {
                            handleUpdateValue(record, e, "Reporting_Managers");
                        }}
                    />
                );
            },
        },
        {
            title: "S.PM",
            dataIndex: "Senior_PM",
            width: "15%",
            key: "Senior_PM",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        defaultChecked={record.Senior_PM}
                        size="small"
                        onChange={(e) => {
                            handleUpdateValue(record, e, "Senior_PM");
                        }}
                    />
                );
            },
        },
        {
            title: "BU Head",
            dataIndex: "BU_Head",
            width: "15%",
            key: "BU_Head",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        defaultChecked={record.BU_Head}
                        size="small"
                        onChange={(e) => {
                            handleUpdateValue(record, e, "BU_Head");
                        }}
                    />
                );
            },
        },
        {
            title: "Admin",
            dataIndex: "Admin",
            width: "15%",
            key: "Admin",
            render: (text, record, index) => {
                return (
                    <Checkbox
                        disabled={record.name == "Admin Screen" ? true : false}
                        defaultChecked={record.Admin}
                        size="small"
                        onChange={(e) => {
                            handleUpdateValue(record, e, "Admin");
                        }}
                    />
                );
            },
        },
    ];

    //   const data2=[
    //     {
    //         "BU Head": false,
    //         "Finance Admin": false,
    //         "User": false,
    //         "IT Admin": false,
    //         "HR User": false,
    //         "HR Admin": false,
    //         "Super Admin": true,
    //         "Admin": true,
    //         "Senior PM": false,
    //         "Reporting Managers": false,
    //         "name": "Admin Screen"
    //     },
    //     {
    //         "Finance Admin": false,
    //         "BU Head": false,
    //         "User": false,
    //         "IT Admin": false,
    //         "HR User": false,
    //         "HR Admin": false,
    //         "Super Admin": true,
    //         "Senior PM": true,
    //         "Admin": true,
    //         "Reporting Managers": true,
    //         "name": "Timesheet Approval"
    //     },
    //     {
    //         "Finance Admin": false,
    //         "BU Head": false,
    //         "User": false,
    //         "IT Admin": false,
    //         "HR User": false,
    //         "HR Admin": false,
    //         "Super Admin": false,
    //         "Admin": false,
    //         "Senior PM": true,
    //         "Reporting Managers": true,
    //         "name": "Timesheet Submit"
    //     }
    // ]

    // const data = [
    //   // {
    //   //   key: 1,
    //   //   name: 'Member > Member List',
    //   //   spm: false,
    //   //   pm: true,
    //   //   admin: true,
    //   //   superAdmin:true,
    //   //   emp:true,
    //   //   children: [
    //   //     {
    //   //       key: 11,
    //   //       name: 'Add',
    //   //       spm: false,
    //   //       pm: true,
    //   //       admin: true,
    //   //       superAdmin:false,
    //   //       emp:true,
    //   //     },
    //   //     {
    //   //       key: 12,
    //   //       name: 'Edit',
    //   //       spm: true,
    //   //       pm: false,
    //   //       admin: true,
    //   //       superAdmin:false,
    //   //       emp:true,
    //   //     },
    //   //       {
    //   //           key: 13,
    //   //           name: 'Delete',
    //   //           spm: true,
    //   //           pm: true,
    //   //           admin: false,
    //   //           superAdmin: true,
    //   //           emp: true,
    //   //       },
    //   //   ],
    //   // },
    //   {
    //     key: 2,
    //     name: 'Member > Add Member',
    //     spm: true,
    //     pm: false,
    //     admin: false,
    //     superAdmin:true,
    //     emp:true,
    //   },
    //   {
    //     key: 2,
    //     name: 'Member > Member List',
    //     spm: true,
    //     pm: false,
    //     admin: false,
    //     superAdmin:true,
    //     emp:true,
    //   },
    //   {
    //     key: 2,
    //     name: 'Timesheet > TimeSheet Submit',
    //     spm: true,
    //     pm: false,
    //     admin: false,
    //     superAdmin:true,
    //     emp:true,
    //   },
    //   {
    //     key: 2,
    //     name: 'Timesheet > TimeSheet Approval',
    //     spm: true,
    //     pm: false,
    //     admin: false,
    //     superAdmin:true,
    //     emp:true,
    //   },
    // ];

    return (
        <>
            <Row className="nav mb-2">
                <Col xs={12} sm={12}>
                    <Breadcrumb />
                </Col>
            </Row>
            <div className="accessPanel viewCard">
                <Table rowKey={'key'} columns={columns} dataSource={newData? [...newData.map((item, index)=>({...item, key:index+1}))]:[]} pagination={false} />
                {/* <div className='card-body'>
                <BootstrapTable
                  keyField="id"
                  wrapperClasses='customScroll'
                  //data={mappedDataArray && mappedDataArray.length > 0 ? mappedDataArray : <div> No data available</div>}
                  columns={columns2}
                  data={data2}
                  condensed
                />
              </div> */}
            </div>
            <ReloadScreenModal
                reloadScreen={reloadScreen}
                SetReloadScreen={() => SetReloadScreen(false)}
            />
        </>
    );
};

export const ReloadScreenModal = (props) => {
    const {reloadScreen, SetReloadScreen} = props;

    return (
        <>
            <Modal className="commonModal" show={reloadScreen} onHide={SetReloadScreen} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Row className="mt-3">
                        <Col sm={12}>
                            <p>Please Re-Login the session to see the changes.</p>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        SetReloadScreen(false);
                                    }}
                                >
                                    Ok
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AccessPanel;