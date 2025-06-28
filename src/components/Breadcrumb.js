import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import routes from '../routes'
import { authRoleState } from '../recoil/authRecoil';
import { useRecoilValue } from 'recoil';

const Breadcrumb = () => {
  const getRole = useRecoilValue(authRoleState);
  const authRoles = getRole && getRole?.Role;
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()

  const dashboardRedirect = () => {
    if (authRoles == "Senior_PM" || authRoles == "Reporting_Managers") {
      navigate('/dashboard/pmDashboard')
    }
    else if(authRoles == "BU_Head" || authRoles == "Admin"  || authRoles == "Super_Admin"){
      navigate('/dashboard/adminDashboard')
    }else{
      navigate('/dashboard/employeeDashboard')
    }
  }


  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array?.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <div aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li key={-1} className="breadcrumb-item"><a style={{color:'#1890ff'}} onClick={dashboardRedirect}>Home</a></li> 
         {breadcrumbs.map((breadcrumb, index) => {
            return (
              <li className="breadcrumb-item"
                {...(breadcrumb.active ? { active: 'true' } : { href: breadcrumb.pathname })}
                key={index}
              >
                {breadcrumb.name}
              </li>
            )
          })}
      </ol>
    </div>
  )
}

export default React.memo(Breadcrumb)
