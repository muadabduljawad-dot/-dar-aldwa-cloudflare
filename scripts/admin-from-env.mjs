import {spawnSync} from 'node:child_process';
const email=process.env.DAR_ADMIN_EMAIL,password=process.env.DAR_ADMIN_PASSWORD;
if(!email||!password)throw new Error('Set DAR_ADMIN_EMAIL and DAR_ADMIN_PASSWORD repository secrets first.');
const r=spawnSync(process.execPath,['scripts/create-admin.mjs'],{input:JSON.stringify({email,password,remote:true}),stdio:['pipe','inherit','inherit']});process.exit(r.status??1);
