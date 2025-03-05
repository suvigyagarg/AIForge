import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useSidebar } from '../ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LucideDownload, Rocket } from 'lucide-react'
import { ActionContext } from '@/context/ActionContext'

export default function Header() {
   const { userDetail, setUserDetail } = useContext(UserDetailContext);
   const {toggleSidebar} = useSidebar();
   const {action ,setAction} = useContext(ActionContext);
   
   const onActionBtn=(action)=>{
    setAction({
     actionType: action,
     timeStamp: Date.now()
    })
   }
   
   const path = usePathname();
   
   return (
     <div className="p-4 flex justify-between items-center border-b">
      <Link href={'/'}>
      <Image src="/logo.png" alt="header" width={45} height={45} />
      </Link>
       {!userDetail?.name ? 
         <div className='flex gap-5'>
           <Button variant='ghost'>Sign In</Button>
           <Button className='text-white' style={{ backgroundColor: colors.BLUE }}>
             Get Started
           </Button>
         </div>
       : 
       path?.includes('workspace') ? 
         <div className='flex gap-2 items-center'>
           <Button
            variant='ghost'
            onClick ={()=>onActionBtn('export')}
           >
             <LucideDownload/> Export
           </Button>
           <Button
            className='bg-blue-500 text-white hover:bg-blue-600'
            onClick ={()=>onActionBtn('deploy')}
           >
             <Rocket/>Deploy
           </Button>
           {userDetail&&<Image 
             src={userDetail?.picture} 
             alt='user' 
             width={30} 
             height={30}
             className='rounded-full w-[30px]'
             onClick={toggleSidebar}
           />}
         </div>
       : 
       userDetail?.name && 
         <Image 
           src={userDetail?.picture} 
           alt='user' 
           width={30} 
           height={30}
           className='rounded-full w-[30px]'
           onClick={toggleSidebar}
         />
       }
     </div>
   )
}