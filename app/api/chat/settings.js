import connectDB from "@/lib/mongodb";
import chatSettings from "@/models/chatSettings";

export async function POST(request) {
    try {
        /**
         * Only three options are opend to users to modify but there are more options in DB
         * params needs to be processed
         */
        const userParams = await request.json();
        const dbParas = await getParams();

        // testing
        console.log("user params: ", userParams);
        console.log("db params: ". dbParams);
        
    } catch (err) {
        console.error("Post settings error: ", err);
        return;
    }
}

export async function getParams() {
    await connectDB();

    try {
        const dbParams = await chatSettings.findOne().sort({createdAt: -1});
        return dbParams;
    } catch (err) {
        console.error("Fetch DB params error: ", err);
        return;
    }
}