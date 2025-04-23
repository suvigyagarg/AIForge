import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React, {useContext} from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { googleLogout } from '@react-oauth/google';
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";



function SideBarFooter() {
    const router=useRouter();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const options=[
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
            icon:LogOut,
            path:'signOut'
        }
    ]

    const onOptionClick=(option)=>{
       
        if(option?.path=='signOut')
        {
            googleLogout();
            if(typeof window!==undefined)
            {
                localStorage.clear();
            }
            router.push('/');
            window.location.reload();
            return ;
        }
        router.push(option.path)
    }
  return (
    <div >
        <div className='bg-black py-1'>
        {options.map((option,index)=>(
            <Button variant="ghost" 
            onClick={()=>onOptionClick(option)}
            className="w-full flex justify-start my-3" key={index}>
                <option.icon/>
                {option.name}
            </Button>
        ))}
        </div>
        <div className=' h-15 flex'>
         <h1 className='font-white p-3'>
          <Image
                src={userDetail?.picture}
                     alt="user"
                     width={32}
                     height={32}
                     className=" rounded-full w-[30px] cursor-pointer"
                    //  onClick={toggleSidebar}
                   />
         </h1>
        </div>
        
    </div>
  )
}

export default SideBarFooter