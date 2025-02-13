import { connectDB } from "@/lib/mongodb";
import chatMessage from "@/models/chatMessage";

export async function GET() {
  await connectDB();

  try {
    const history = await chatMessage.findOne().sort({ createdAt: -1 });
    console.log("HISTORY: \n");
    console.log(history);
    
    return new Response(JSON.stringify(history),
        {
            headers: {"Content-Type": "application/json"},
            status: 200
        }
    );
  } catch (err) {
    console.log("History fetch error: ", err);
    return new Response(JSON.stringify({result: "fetch history error"}, {status:500}));
  }
}
