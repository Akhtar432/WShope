import React from 'react'
import {TbBrandMeta} from 'react-icons/tb'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine} from 'react-icons/ri'
function Topper() {
  return (
    <div className='bg-[#ea2e0e] text-white pt-2 pb-2'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className=' hidden md:flex items-center space-x-4'>
          <a href='https://www.facebook.com/profile.php?id=100082297226051' target='_blank' className='hover:text-gray-300'>
            <TbBrandMeta className="h-5 w-5"></TbBrandMeta>
          </a>
          <a href='https://www.instagram.com/i4khtar_432/' target='_blank' className='hover:text-gray-300'>
            <IoLogoInstagram className="h-5 w-5"></IoLogoInstagram>
          </a>
          <a href='https://x.com/intezar_akhtar' target='_blank' className='hover:text-gray-300'>
            <RiTwitterXLine className="h-4 w-4"></RiTwitterXLine>
          </a>
        </div>
        <div className='text-sm text-center flex-grow'>
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>
        <div className='text-sm hidden md:block'>
          <a href='tel: +1284578' className='hover:text-gray-300'>
            +1 (234) 575-897
          </a>
        </div>
      </div>
    </div>
  )
}

export default Topper
