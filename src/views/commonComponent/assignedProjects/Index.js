import React, {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {useGetTeamMemberProjectInfoByEmpUuid} from "../../../query/attendance/attendanceQuery";
import {authState} from "../../../recoil/authRecoil";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";

const AssignedProjects = () => {
    const empDetail = useRecoilValue(authState);
    const {
        data: projectInfoOfCurrentEmp,
        isLoading: isLoadingProjectInfoOfCurrentEmp,
        refetch: refetchProjectInfoOfCurrentEmp,
        remove: removeTeamMemberProjectInfo,
    } = useGetTeamMemberProjectInfoByEmpUuid(empDetail && empDetail.uuid);

    useEffect(() => {
        refetchProjectInfoOfCurrentEmp();
    }, []);

    return (
        <>
            <div className="assignedProjectsCard dashboardCard cardShadow">
                <div className="cardCustomTitle">Assigned Projects</div>
                <div className="projectsList customScroll">
                    {isLoadingProjectInfoOfCurrentEmp ? (
                        <div className="loadingScreen">
                            <Loader />
                        </div>
                    ) : !projectInfoOfCurrentEmp || !projectInfoOfCurrentEmp.length ? (
                        <div className="emptyListText">No projects assigned.</div>
                    ) : (
                        projectInfoOfCurrentEmp &&
                        projectInfoOfCurrentEmp?.map((item, index) => (
                            <p key={index} className="keyAndValueText mb-0">
                                <span className="name me-1">{item.project_name}:</span>
                                <span className="value">{item.allocation}%</span>
                            </p>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default AssignedProjects;
