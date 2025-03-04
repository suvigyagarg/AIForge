'use client'

import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import colors from '@/data/Colors';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useSidebar } from '../ui/sidebar';

export default function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext)
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages)
  const {toggleSidebar} =useSidebar()

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  // Used to get workspace data using workspace ID
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id
    });
    setMessages(result?.messages);
    console.log(result);
  }

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post('/api/ai-chat', {
      prompt: PROMPT
    });

    console.log(result.data.result);
    const aiResp = {
      role: 'ai',
      content: result.data.result
    }

    setMessages(prev => [...prev, aiResp])

    await UpdateMessages({
      workspaceId: id,
      messages: [...messages, aiResp]
    })

    setLoading(false);
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == 'user') {
        GetAiResponse();
      }
    }

  }, [messages]);


  const onGenerate = (input) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }]);
    setUserInput('');
  }

  return (
    <div className='relative h-[85vh] flex flex-col'>
      <div className='flex-1 overflow-y-scroll scrollbar-hide pl-5'>
        {messages?.map((message, index) => (
          <div key={index}
            className='p-3 mb-2 rounded-lg flex gap-2 items-center leading-7'
            style={{
              backgroundColor: colors.CHAT_BACKGROUND
            }}>
            {message?.role == 'user' && <Image src={userDetail?.picture} alt='userImage' width={35} height={35} className='rounded-full' />}
            <div className='flex flex-col'>
              <ReactMarkdown >{message.content}</ReactMarkdown>
            </div>

          </div>

        ))}
        {loading && <div className='p-3 mb-2 rounded-lg flex gap-2 items-center'
          style={{
            backgroundColor: colors.CHAT_BACKGROUND
          }}>
          <Loader2Icon className='animate-spin' />
          <h2>Thinking...</h2>
        </div>}
      </div>

      <div className='flex gap-2 items-end'>
     {userDetail&&<Image 
     className='rounded-full cursor-pointer '
     onClick={toggleSidebar}
     src={userDetail?.picture} alt='user' width={30} height={30} />
    } <div
          className="p-5 border rounded-xl max-w-2xl w-full mt-3 "
          style={{
            backgroundColor: colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2 ">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer" />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>

    </div>
  )
}
