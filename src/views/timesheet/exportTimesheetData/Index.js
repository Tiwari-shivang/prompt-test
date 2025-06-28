import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {FaDownload} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {
    useGetProjectResourcesBySpmUuid,
    useGetTimesheetExportData,
} from "../../../query/attendance/attendanceQuery";
import {authState} from "../../../recoil/authRecoil";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";

const Index = () => {
    const {
        reset,
        watch,
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: "onChanged",
    });
    const [reportInfo, setReportInfo] = useState({
        startDate: "",
        endDate: "",
        employeeUuid: "",
    });
    const empDetail = useRecoilValue(authState);

    const {
        data: report,
        isLoading: isLoadingReport,
        refetch: refetchProjectInfoOfCurrentEmp,
    } = useGetTimesheetExportData(reportInfo);
    const {data: allprojectsData, isLoading: isLoadingAllProjectsData} =
        useGetProjectResourcesBySpmUuid(empDetail?.uuid);
    const exportReport = (data) => {
        setReportInfo(data);
        refetchProjectInfoOfCurrentEmp(data);
    };
    const startDate = watch("startDate");

    useEffect(() => {
        if (report != undefined) {
            var mediaType =
                "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
            var userInp = report && report;
            var a = document.createElement("a");
            a.href = mediaType + userInp;
            a.download = "Resource Planning Utilization Data.xlsx";
            a.textContent = "Download file!";
            document.body.appendChild(a);
            a.click();
            setReportInfo({});
        }
    }, [report && report]);

    return (
        <Container>
            <Row className="nav mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className=""></Col>
            </Row>
            <Row className="exportTimesheetData">
                <Col sm={12} className="mb-3">
                    <div className="headerRow cardCustomTitle">Export Timesheet Data</div>
                    <form className="formUtil" onSubmit={handleSubmit(exportReport)}>
                        <Container>
                            <Row>
                                <Col sm={4}>
                                    <label>Select Project *</label>
                                    <select
                                        className="form-control customScroll"
                                        name="project_uuid"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option value="">
                                            {isLoadingAllProjectsData
                                                ? "Loading..."
                                                : "Select Project"}
                                        </option>
                                        {allprojectsData &&
                                            allprojectsData.map((option) => (
                                                <option key={option.uuid} value={option.uuid}>
                                                    {option.project_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.project_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.project_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4}>
                                    <label>Start Date *</label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        name="startDate"
                                        max="9999-01-01"
                                        reference={register({
                                            valueAsDate: false,
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.startDate && (
                                        <small className="form-text text-danger">
                                            {errors.startDate.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4}>
                                    <label>End Date *</label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        name="endDate"
                                        max="9999-01-01"
                                        reference={register({
                                            valueAsDate: false,
                                            required: requiredField(),
                                            validate: {
                                                greaterThan: (v) => {
                                                    if (
                                                        startDate &&
                                                        new Date(startDate) > new Date(v)
                                                    ) {
                                                        return "End date cannot be less than start date.";
                                                    } else return true;
                                                },
                                            },
                                        })}
                                    />
                                    {errors.endDate && (
                                        <small className="form-text text-danger">
                                            {errors.endDate.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12} className="buttonSection centerItem">
                                    <Button
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                        className="exportButton"
                                    >
                                        <FaDownload className="me-1 my-0" /> Export Data
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Col>
            </Row>
        </Container>
    );
};

export default Index;
