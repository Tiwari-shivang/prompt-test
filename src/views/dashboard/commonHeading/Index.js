
import React, { useState , useEffect } from "react"
import { Col } from 'react-bootstrap'
import { Tooltip } from 'antd';
import { useGetTeamMemberProjectInfoByEmpUuid } from "../../../query/attendance/attendanceQuery"
import { useRecoilValue } from "recoil"
import { authState } from "../../../recoil/authRecoil";

const CommonHeading = () => {
	const empDetail = useRecoilValue(authState)
	const [projectWiseAllocation, setProjectWiseAllocation] = useState("")

	// const {
    //     data: projectInfoOfCurrentEmp,
    //     isLoading: isLoadingProjectInfoOfCurrentEmp,
    //     refetch: refetchProjectInfoOfCurrentEmp,
    //     remove: removeTeamMemberProjectInfo,
    // } = useGetTeamMemberProjectInfoByEmpUuid(empDetail && empDetail.uuid);

	// useEffect(() => {
	// 	refetchProjectInfoOfCurrentEmp();
	//   }, []);

	// useEffect(() => {
	//  let mapData=""
	// 	if (projectInfoOfCurrentEmp && projectInfoOfCurrentEmp.length > 0) {
    //         projectInfoOfCurrentEmp && projectInfoOfCurrentEmp.map((currElement, index) => {
	// 			mapData+=currElement.allocation + "%" + " " +currElement.project_name+ (index != projectInfoOfCurrentEmp.length-1?", ": "")
	// 	   })
	// 	   console.log(mapData , "mapdata")
	// 	   setProjectWiseAllocation(mapData)
	// 	}
	// }, [projectInfoOfCurrentEmp && projectInfoOfCurrentEmp.length > 0]);

	return (
				<Col xs={12} >
					<h6 className="heading d-flex">Welcome {empDetail.first_name} {empDetail.last_name} </h6>
				</Col>
	)
}

export default CommonHeading