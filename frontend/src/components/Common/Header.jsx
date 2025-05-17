import React from 'react'
import Topper from '../Layout/Topper'
import Navbar from './Navbar'

function Header() {
  return (
    <header className='border-b border-gray-200'>
      <Topper/>
      <Navbar/>
    </header>
  )
}

export default Header
