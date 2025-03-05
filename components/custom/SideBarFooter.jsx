import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useSidebar } from '../ui/sidebar'

export default function SideBarFooter() {
    const router =useRouter()
    const {toggleSidebar} = useSidebar()
    const options =[
        {
            name:'Settings',
            icon:Settings
        },
        {
            name:'Help Center',
            icon:HelpCircle
        },
        {
            name:'My Subscription',
            icon:Wallet,
            path:'/pricing'
        },
        {
            name:'Sign Out',
            icon:LogOut
        }
    ]

  const onOptionClick=(option)=>{
      router.push(option.path)
  }
  return (
    <div className='p-2 mb-10'>
        {options.map((option,index )=>(
           <Button 
           onClick={()=>{
            toggleSidebar()
            onOptionClick(option);
           }}
           variant='ghost' key={index} className='w-full flex justify-start my-3'>
            <option.icon/>
            {option.name}
           </Button> 
        ))}
    </div>
  )
}
