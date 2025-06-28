import React from 'react'
import { Content, Sidebar, Footer, Header } from '../components/index'

const DefaultLayout = (props) => {
  const handleSideBarControlButton = () =>{
    document.querySelector('.sidebar-fixed').classList.remove('show')
  }
  return (
    <div>
      <Sidebar />
      <div className="wrapper d-flex flex-column min-vh-100" onClick={handleSideBarControlButton}>
        <Header />
        <div className="body flex-grow-1 bodyBackground px-3">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default DefaultLayout
