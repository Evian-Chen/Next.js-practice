import connectDB from "@/lib/mongodb";
import chatMessage from "@/models/chatMessage";

export async function GET() {
    await connectDB();

    try {
        const history = await chatMessage.findOne().sort({createdAt: -1});
        return;
    } catch (err) {
        console.log("History fetch error: ", err);
        return;
    }
}