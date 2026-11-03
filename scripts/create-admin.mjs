import {webcrypto} from 'node:crypto';
import {createInterface} from 'node:readline';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
// Supply JSON on stdin, never put passwords in command-line arguments.
let text='';for await(const chunk of process.stdin)text+=chunk;
const {email,password,remote=false}=JSON.parse(text);
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof password!=='string'||password.length<12)throw new Error('Valid email and a password of at least 12 characters required');
const salt=webcrypto.randomUUID(),enc=new TextEncoder();const k=await webcrypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bytes=await webcrypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations:100000},k,256);const hash=Buffer.from(bytes).toString('hex');const q=s=>"'"+String(s).replaceAll("'","''")+"'";
const sql=`INSERT INTO users(email,hash,salt,role,created) VALUES(${q(email.toLowerCase())},${q(hash)},${q(salt)},'admin',${q(new Date().toISOString())}) ON CONFLICT(email) DO UPDATE SET hash=excluded.hash,salt=excluded.salt,role='admin'; DELETE FROM sessions WHERE email=${q(email.toLowerCase())};`;
const dir=await mkdtemp(join(tmpdir(),'dar-admin-'));try{const file=join(dir,'admin.sql');await writeFile(file,sql,{mode:0o600});const r=spawnSync(process.execPath,['./node_modules/wrangler/bin/wrangler.js','d1','execute','DB',remote?'--remote':'--local','--config','wrangler.jsonc','--persist-to','.wrangler/state','--file',file],{stdio:['ignore','pipe','pipe']});if(r.status!==0)throw new Error('Account setup failed: '+r.stderr.toString());console.log('Administrator account saved. No password was logged.')}finally{await rm(dir,{recursive:true,force:true})}
