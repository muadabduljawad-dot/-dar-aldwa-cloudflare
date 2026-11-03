import {readFileSync} from 'node:fs';
const config=JSON.parse(readFileSync('wrangler.jsonc','utf8').replace(/^\/\/.*$/gm,''));
const id=config.d1_databases?.find(x=>x.binding==='DB')?.database_id;
if(!id||id==='00000000-0000-4000-8000-000000000000'||!/^[-a-f0-9]{36}$/i.test(id))throw new Error('Set the real D1 database_id in wrangler.jsonc before deploying.');
const url=new URL(config.vars.PUBLIC_SITE_URL);if(url.protocol!=='https:'||url.hostname==='example.com')throw new Error('Set PUBLIC_SITE_URL to your HTTPS domain or workers.dev URL in wrangler.jsonc.');
console.log('Cloudflare configuration is ready.');
