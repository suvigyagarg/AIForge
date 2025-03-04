import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'

export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="p-4 flex justify-between items-center py-2">
      <Image src="/logo.png" alt="header" width={40} height={40} />
      {!userDetail && <div className='flex gap-5'>
        <Button variant='ghost'>Sign In</Button>
        <Button className='text-white'
          style={{ backgroundColor: colors.BLUE }} >Get Started</Button>
      </div>}
    </div>
  )
}
