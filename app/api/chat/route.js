import { promises as fs } from 'fs';  // read and write files using promises API
import path from 'path';

// user info file path
const filePath = path.join(process.cwd(), 'public', 'chat', 'user_info.json');

// get data from the filePath (user_info.json)
// async must return Promise, await can onnly be used in async function
export async function GET() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');  // return str
        const jsonData = JSON.parse(data);                  // turn json string to js object
        return new Response(JSON.stringify(jsonData), {     // return json format data
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify( {error: "file not found"} ), {status: 404}); // file not found
    }
}

// save the lastet data to user_info.json
export async function POST(request) {
    try {
        const bodyText = await request.text();  // explain json file from frontend, body is a js obj
        const body = JSON.parse(bodyText);
        console.log(body);
        const newData = {
            "userInfo": {
                "name": body.user_name,
                "email": body.user_email,
                "institution": body.user_inst
            }
        };

        await fs.writeFile(filePath, JSON.stringify(newData, null, 4), 'utf-8');

        return new Response(JSON.stringify({result: 'OK', message: "Data updated!"}), 
    {status: 200, headers: {'Content-Type': 'application/json'}});
    } catch (error) {
        return new Response(JSON.stringify({ result: 'ERROR', message: 'Invalid JSON data' }), {status: 400})  // 400 bad request
    }
}