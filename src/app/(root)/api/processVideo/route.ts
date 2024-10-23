import { NEXTAUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request){
    const  session =  await getServerSession(NEXTAUTH_CONFIG);
    console.log("session", session);
    // const { url } = await req.json();
    // Put this url in a queue
    // for que

    return Response.json({
        message: "Hello World",
        session
    })
}