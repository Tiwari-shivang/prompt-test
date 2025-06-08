import React from 'react'

import { SidebarNav } from './SidebarNav'
import logo from '../assets/brand/logoWhite.svg'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'


const Sidebar = () => {

  const handleSideBarController = (e) =>{
      if(e.target.href){
        document.querySelector('.sidebar-fixed').classList.remove('show')
      } 
  }

  return (
    // <CSidebar
    <div className='sidebar sidebar-fixed'
      onClick={handleSideBarController}
    >
      <div className="sidebar-brand d-none d-md-flex" to="/">
        <img className="sidebar-brand-full" src={logo} />
        {/* <img className="sidebar-brand-narrow" src={logoNarrow} alt="logo-narrow" /> */}
      </div>
      <div className='sidebar-nav customScroll'>
        <SimpleBar>
          <SidebarNav />
        </SimpleBar>
      </div>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      /> */}
    {/* </CSidebar> */}
    </div>
  )
}

export default React.memo(Sidebar)
