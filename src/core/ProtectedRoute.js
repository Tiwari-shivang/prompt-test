import jwt_decode from "jwt-decode";
import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authRoleState, authState } from "../recoil/authRecoil";


const ProtectedRoute = (props) => {
	const { children } = props

	const data = JSON.parse(localStorage.getItem('response'));
	const access_token = data && data.token
	let empRole = access_token != null ? jwt_decode(access_token) : "";
	const setAuthDetailState = useSetRecoilState(authState)
	const setAuthRoleState = useSetRecoilState(authRoleState)
	useEffect(() => {
		setAuthDetailState(data)
		setAuthRoleState(empRole)
	}, [])

	if (access_token) {
		return children;
	} else {
		return <Navigate to="/login" replace />;
	}
}

export default ProtectedRoute