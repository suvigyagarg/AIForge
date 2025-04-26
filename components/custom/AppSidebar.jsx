import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from "../ui/button"
import { MessageCircleCode ,SidebarClose } from "lucide-react"
import WorkspaceHistory from "./WorkspaceHistory"
import SideBarFooter from "./SideBarFooter"
import { useRouter } from "next/navigation"


export function AppSidebar() {
  const router =useRouter();
  const {toggleSidebar}=useSidebar();
  return (
    <Sidebar className="">
    <SidebarHeader className="p-5 pb-0 ">
    <div className='flex justify-between items-center '>
      <Image src={'/logo.png'} alt='log' width={40} height={40}/>
      <SidebarClose className='cursor-pointer h-6 w-6 font-thin' onClick={toggleSidebar} />
      </div>
        <Button className="mt-4 p-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent
         bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 
        disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20 "
        onClick={()=>router.push('/')}
        > <MessageCircleCode/> Start New Chat
        </Button>
    </SidebarHeader>
      <SidebarContent className="p-4 mb-3 scrollbar-hide">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter className="p-0 m-0">
        <SideBarFooter/>
      </SidebarFooter>
    </Sidebar>
  )
}
