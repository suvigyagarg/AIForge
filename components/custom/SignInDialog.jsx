import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google';
import { UserDetailContext } from '@/context/UserDetailContext';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import uuid4 from 'uuid4';

function SignInDialog({ openDialog, closeDialog }) {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreateUser);
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            //console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );

            //console.log(userInfo);
            const user = userInfo.data;
            await CreateUser({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4()
            })

            if (typeof window !== undefined) {
                localStorage.setItem('user', JSON.stringify(user))
            }


            setUserDetail(userInfo?.data);
            //Save this inside out Database 
            closeDialog(false);
            window.location.reload()
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h2 className='font-bold text-2xl text-center text-white'>{Lookup.SIGNIN_HEADING}</h2>
                            <p className='mx-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</p>
                            <button type="button" onClick={googleLogin} class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4
                             focus:outline-none focus:ring-[#4285F4]/50 font-bold rounded-lg text-md px-5 py-2.5 text-center inline-flex
                              items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
                                <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                                    <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd" />
                                </svg>
                                Sign in with Google
                            </button>         
                            <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default SignInDialog