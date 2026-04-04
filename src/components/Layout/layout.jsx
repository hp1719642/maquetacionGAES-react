import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import LogoutButton from '../Common/LogoutButton'

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content">
          {children}
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}

export default Layout