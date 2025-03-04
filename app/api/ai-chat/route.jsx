import { chatSession } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req){
    const {prompt }= await req.json();

    try{
        const result =await chatSession.sendMessage(prompt);
       const AIresp =result.response.text();

       return NextResponse.json({ result: AIresp })

    }catch(e){
        return NextResponse.json({error:e})
    }
}