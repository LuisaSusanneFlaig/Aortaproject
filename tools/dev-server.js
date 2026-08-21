import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number.parseInt(process.env.PORT || '8765', 10);
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm'
};

createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
        const requestedPath = pathname === '/' ? '/index.html' : pathname;
        const filePath = path.resolve(projectRoot, `.${requestedPath}`);
        if (!filePath.startsWith(`${projectRoot}${path.sep}`)) throw new Error('Invalid path');
        const info = await stat(filePath);
        if (!info.isFile()) throw new Error('Not a file');

        response.writeHead(200, {
            'Cache-Control': 'no-store',
            'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
        });
        createReadStream(filePath).pipe(response);
    } catch {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
    }
}).listen(port, '127.0.0.1', () => {
    console.log(`ScrollytellingBuilder: http://127.0.0.1:${port}`);
});
