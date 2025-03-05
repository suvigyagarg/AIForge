'use client'

import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { countToken } from './ChatView';
import { UserDetailContext } from '@/context/UserDetailContext';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '@/context/ActionContext';

export default function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('code')
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE)
  const { messages, setMessages } = useContext(MessagesContext)
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)
  const convex = useConvex();
  const [loading, setLoading] = useState(false)
 const UpdateTokens =useMutation(api.users.UpdateToken);
 const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const {action ,setAction} =useContext(ActionContext);   
  
  useEffect(() => {
    id && GetFiles();
  }, [id])

  useEffect(()=>{
 setActiveTab('preview')
  },[action])

  const GetFiles = async () => {
    setLoading(true)
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id
    })
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData }
    setFiles(mergedFiles)
    setLoading(false)
  }


  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == 'user') {
        GenerateAiCode();
      }
    }

  }, [messages])


  const GenerateAiCode = async () => {
    setLoading(true)
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT
    const result = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT
    });
    console.log(result.data)
    const aiResp = result.data

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files }
    setFiles(mergedFiles)
    await UpdateFiles({
      workspaceId: id,
      files: aiResp?.files,
    });

    const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));

    await UpdateTokens({
      userId: userDetail?._id,
      token: token
    })

    setUserDetail(prev=>({
      ...prev,
      token:token
    }))

    setActiveTab('code')
    setLoading(false)
  }
  return (
    <div className='relative'>
      <div className='bg-[#181818]w-full p-2 border'>
        <div className='flex items-center flex-wrap shrink-0 justify-center bg-black p-1 w-[140px] gap-3'>
          <h2
            onClick={() => setActiveTab('code')}
            className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500/25  p-1 px-2 rounded-full'}`}
          >Code</h2>
          <h2
            onClick={() => setActiveTab('preview')}
            className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500/25  p-1 px-2 rounded-full'}`}>
            Preview</h2>
        </div>
      </div>
      <SandpackProvider template="react" theme={'dark'}
        files={files}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY
          }
        }}
        options={{
          externalResources: ["https://unpkg.com/@tailwindcss/browser@4"]
        }}
      >
        <SandpackLayout >
          {activeTab === 'code' ?
            <>
              <SandpackFileExplorer style={{ height: '75vh' }} />
              <SandpackCodeEditor style={{ height: '75vh' }} />
            </> :
            <>
              <SandpackFileExplorer style={{ height: '75vh' }} />
           <SandpackPreviewClient/>
            </>}
        </SandpackLayout>
      </SandpackProvider>
      {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
        <Loader2Icon className='animate-spin h-10 w-10 text-white' />
        <h2 className='text-white'>Genarating your files...</h2>
      </div>

      }
    </div>
  )
}
