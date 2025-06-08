import React, { useEffect } from 'react';
import { useRecoilValue } from "recoil";
import { authRoleState } from "../recoil/authRecoil";

export const rules = {
	"Super_Admin": "adminDashboard",
	"Admin": "adminDashboard",
	"BU_Head": "adminDashboard",
	"HR_Admin": "hrDashboard",
	"HR_User": "hrDashboard",
	"User": "employeeDashboard",
	"Reporting_Managers": "pmDashboard",
	"Senior_PM": "pmDashboard",
	"IT_Admin": "employeeDashboard",
	"Finance_Admin": "hrDashboard",
};

const DashboardAccess = (props) => {
	const getRole = useRecoilValue(authRoleState)
	const authRoles = getRole && getRole?.Role

	const getDashboard = authRoles ? rules[authRoles] : "";
	useEffect(() => {
		props.sendData(getDashboard)
	}, [getDashboard])

	return true;

}

export default DashboardAccess