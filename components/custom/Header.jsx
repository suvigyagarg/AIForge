import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LucideDownload, Rocket } from "lucide-react";
import { ActionContext } from "@/context/ActionContext";
import SignInDialog from "./SignInDialog";
import { SocialIcon } from "react-social-icons";
export default function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();
  const { action, setAction } = useContext(ActionContext);
  const path = usePathname();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="p-4 w-full flex justify-between items-center">
      <Link href={"/"}>
        <Image src={"/logo.png"} alt="Logo" width={48} height={48} />
      </Link>
      {!userDetail?.name ? (
        <div className="flex gap-5 ml-auto">
          <Button
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 
           rounded-lg text-sm px-5 py-2.5 text-center 
           dark:focus:ring-gray-500 me-2 mb-2 font-bold"
            onClick={setOpenLoginDialog}
          >
            Sign In
          </Button>
          <Button
            onClick={setOpenLoginDialog}
            className="text-white bg-gradient-to-r from-sky-800 via-blue-600 to-blue-800 hover:bg-gradient-to-br 
          focus:ring-4 focus:outline-none focus:ring-white dark:focus:ring-blue-800
           font-lg rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 font-bold"
          >
            Get Started
          </Button>
        </div>
      ) : (
        path?.includes("workspace") && (
          <div className="flex gap-2 items-center">
            <Button
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 
           rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center
           dark:focus:ring-gray-500 me-2 mb-2 font-bold"
              onClick={() => onActionBtn("export")}
            >
              <LucideDownload className="w-4 h-4  text-[#626890]" />
              Export
            </Button>
            <Button
              className="text-white bg-gradient-to-r from-sky-800 via-blue-600 to-blue-800 hover:bg-gradient-to-br 
          focus:ring-4 focus:outline-none focus:ring-white dark:focus:ring-blue-800
           font-lg rounded-lg text-md px-5 py-3.5 text-center me-2 mb-2 font-bold"
              onClick={() => onActionBtn("deploy")}
            >
              <Rocket />
              Share{" "}
            </Button>
          </div>
        )
      )}
      <div className="flex items-end">
          
        {userDetail && (
          <div className="flex items-center">
          <SocialIcon
            url="https://github.com/suvigyagarg"
            bgColor="black"
            fgColor="white"
            style={{ height: '40px', width: '40px' }}
          />
          <SocialIcon
            url="https://www.linkedin.com/in/suvigya-garg-16b76a24a/"
            bgColor="black"
            fgColor="white"
            style={{ height: '40px', width: '40px' }}
          />
          <SocialIcon
            url="https://x.com/confused_mnkey"
             bgColor="black"
            fgColor="white"
            style={{ height: '36px', width: '36px' }}
          />
          {userDetail&& <Image
            src={userDetail?.picture}
            alt="user"
            width={34}
            height={34}
            className=" w-[30px] cursor-pointer rounded-full ml-2"
            onClick={toggleSidebar}
          /> }
            
          </div>
         
        )}
      
        
      </div>

      <SignInDialog
        openDialog={openLoginDialog}
        closeDialog={setOpenLoginDialog}
      />
    </div>
  );
}
