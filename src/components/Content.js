import React, { Suspense, useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'

// routes config
import routes from '../routes'
import ProtectedRoute from '../core/ProtectedRoute';
import DashboardAccess from '../utilits/dashboardAccess';

const Content = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [roles, setRoles] = useState("")
  
  // if page is not dashboard 
  useEffect(()=>{
      window.onpopstate = function(){
        if(location && location.pathname.split("/")[1] === "dashboard"){
          navigate(location && location.pathname)
        }
      }
  },[location])

 function getData(data) {
  setRoles(data)
 }

  return (
    <div className="container" style={{ paddingLeft: "0px" }}>
      <Suspense>
        <ProtectedRoute>
          <DashboardAccess sendData={getData}/>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={ <route.element />}
                  />
                )
              )
            })}
            <Route path="/dashboard" element={<Navigate to={`/dashboard/${roles}`} replace />} />
            <Route path="*" element={<Navigate to={`/dashboard/${roles}`} replace />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </ProtectedRoute>
      </Suspense>
    </div>
  )
}

export default React.memo(Content)
