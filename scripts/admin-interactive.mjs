import {createInterface,emitKeypressEvents} from 'node:readline';
import {stdin,stdout} from 'node:process';
import {spawnSync} from 'node:child_process';
if(!stdin.isTTY)throw new Error('Run in a terminal, or use admin:stdin with JSON on stdin.');
const rl=createInterface({input:stdin,output:stdout});
const ask=q=>new Promise(r=>rl.question(q,r));
const email=(await ask('Administrator email: ')).trim();
const remote=(await ask('Target (remote / local) [remote]: ')).trim()!=='local';rl.close();
function secret(label){return new Promise((resolve,reject)=>{let value='';stdout.write(label);emitKeypressEvents(stdin);stdin.setRawMode(true);stdin.resume();const cleanup=()=>{stdin.off('keypress',listener);stdin.setRawMode(false);stdin.pause();stdout.write('\n')};const listener=(text,key={})=>{if(key.ctrl&&key.name==='c'){cleanup();reject(new Error('Cancelled'));return}if((key.name==='return'||key.name==='enter')){cleanup();resolve(value);return}if(key.name==='backspace'){value=value.slice(0,-1);return}if(text&&!key.ctrl&&!key.meta&&![...text].some(c=>c<' '))value+=text};stdin.on('keypress',listener)})}
const password=await secret('Password (12+ characters, hidden): ');const confirm=await secret('Repeat password (hidden): ');
if(password!==confirm)throw new Error('Passwords do not match');
const result=spawnSync(process.execPath,['scripts/create-admin.mjs'],{input:JSON.stringify({email,password,remote}),stdio:['pipe','inherit','inherit']});process.exit(result.status??1);
