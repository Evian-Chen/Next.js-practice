/**
 * This file is used to define GET and POST functions.
 * These functions transport information between backend and API.
 */

import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'data', 'info.json');

export async function GET() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        return new Response(JSON.stringify(jsonData), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newData = {
            "appInfo": {
                "id": body.app_id,
                "name": body.app_name,
                "version": body.app_version,
                "author": body.app_author,
                "remark": body.app_remark
            }
        };

        await fs.writeFile(filePath, JSON.stringify(newData, null, 4), 'utf-8');

        return new Response(JSON.stringify({ result: 'OK', message: 'Data saved successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ result: 'ERROR', message: 'Invalid JSON data' }), { status: 400 });
    }
}
