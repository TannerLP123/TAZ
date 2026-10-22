import http from 'node:http';
import {readFile} from 'node:fs/promises';
const root = new URL('./legacy/', import.meta.url);
http.createServer(async (req,res)=>{
 const path = new URL(req.url,'http://localhost').pathname;
 const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/schedule.mjs':'schedule.mjs'};
 if(!files[path]){res.writeHead(404);return res.end('Not found');}
 try{const data=await readFile(path === '/schedule.mjs' ? new URL('./src/schedule.mjs', import.meta.url) : new URL(files[path],root));res.setHeader('Content-Type',path.endsWith('.js')||path.endsWith('.mjs')?'text/javascript':path.endsWith('.css')?'text/css':'text/html');res.end(data);}catch{res.writeHead(500);res.end('Unable to load application');}
}).listen(Number(process.env.PORT)||3000,'0.0.0.0');
