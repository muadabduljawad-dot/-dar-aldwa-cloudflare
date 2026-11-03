import {env} from 'cloudflare:workers';
import {seed} from './seed';
import {blockKinds,videoSource,mapEmbed} from './block-library';
import type {Site} from './model';
export const db=()=>{if(!env.DB)throw new Error('Database unavailable');return env.DB};
export async function published():Promise<Site>{const row=await db().prepare('SELECT body FROM documents WHERE id=?').bind('published').first<{body:string}>();return row?JSON.parse(row.body):seed;}
export const now=()=>new Date().toISOString();
export const key=()=>crypto.randomUUID();
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('');}
export async function passwordHash(password:string,salt:string){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return Array.from(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:100000},material,256))).map(n=>n.toString(16).padStart(2,'0')).join('');}
export function same(a:string,b:string){let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return diff===0;}
// Standalone Cloudflare uses sessions only. Never trust caller-supplied identity headers.
export function owner(_req:Request){return false;}
export async function identity(req:Request){const token=req.headers.get('cookie')?.match(/(?:^|;\s*)dar_session=([^;]+)/)?.[1];if(!token)return null;const row=await db().prepare('SELECT users.email,users.role FROM sessions JOIN users ON users.email=sessions.email WHERE token=? AND expires>?').bind(await digest(token),Date.now()).first<{email:string,role:string}>();return row?{...row,owner:false}:null;}
export function validSite(s:any):s is Site{
const bi=(v:any)=>v&&typeof v.ar==='string'&&typeof v.en==='string'&&v.ar.length<20000&&v.en.length<20000;
const url=(v:any)=>v===undefined||v===''||typeof v==='string'&&v.length<2000&&(v.startsWith('/')&&!v.startsWith('//')||/^https:\/\//.test(v));
if(!s||!bi(s.name)||!bi(s.tagline)||!bi(s.about)||!bi(s.address)||!Array.isArray(s.pages)||s.pages.length>100||!Array.isArray(s.gallery)||s.gallery.length>300||!Array.isArray(s.phones)||s.phones.length>20)return false;
if(!s.name.ar||!s.name.en||!/^#[0-9a-fA-F]{6}$/.test(s.primary)||!/^#[0-9a-fA-F]{6}$/.test(s.accent)||!url(s.logoAr)||!url(s.logoEn)||!url(s.favicon)||!url(s.seoImage)||!url(s.facebook)||typeof s.email!=='string'||s.email.length>160||!/^\d{8,15}$/.test(s.whatsapp))return false;
if(s.logoSize<55||s.logoSize>160||s.fontSize<13||s.fontSize>19||s.spacing<.7||s.spacing>1.3||s.heroOpacity<0||s.heroOpacity>.7)return false;
if(s.ui&&Object.values(s.ui).some(v=>!bi(v)))return false;
if(s.fontFamily&&!['IBM Plex Sans Arabic','Manrope','Arial','Tahoma'].includes(s.fontFamily))return false;
if(s.phones.some((p:any)=>!bi(p.label)||typeof p.number!=='string'||!/^\+[0-9 ]{8,20}$/.test(p.number)))return false;
const slugs=new Set();for(const p of s.pages){if(!/^[a-z0-9/-]*$/.test(p.slug)||p.slug.includes('..')||slugs.has(p.slug)||!bi(p.title)||!bi(p.description)||!Array.isArray(p.sections)||p.sections.length>80)return false;slugs.add(p.slug);for(const x of p.sections){if(!bi(x.title)||!bi(x.text)||!bi(x.eyebrow)||!url(x.image)||!Object.hasOwn(blockKinds,x.kind))return false;if(x.videoUrl&&!videoSource(x.videoUrl)||!url(x.poster)||x.caption&&!bi(x.caption)||x.buttonLabel&&!bi(x.buttonLabel)||!url(x.buttonHref)||x.mapUrl&&!mapEmbed(x.mapUrl))return false;if(x.style&&(x.style.columns!==undefined&&(!Number.isInteger(x.style.columns)||x.style.columns<1||x.style.columns>4)||x.style.padding!==undefined&&(x.style.padding<0||x.style.padding>160)||!['default','soft','brand'].includes(x.style.background||'default')||!['start','center'].includes(x.style.align||'start')||!['normal','wide'].includes(x.style.width||'normal')))return false;if(x.items&&(!Array.isArray(x.items)||x.items.length>100||x.items.some((i:any)=>!bi(i.title)||!bi(i.text)||!url(i.image)||!url(i.href))))return false;}}
if(s.gallery.some((g:any)=>!bi(g.title)||!bi(g.category)||!url(g.image)))return false;
return slugs.has('')&&JSON.stringify(s).length<1500000;
}
export async function throttle(id:string,max:number,minutes:number){const t=Date.now();await db().prepare('INSERT INTO throttle(id,count,until) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN until<? THEN 1 ELSE count+1 END,until=CASE WHEN until<? THEN excluded.until ELSE until END').bind(id,t+minutes*60000,t,t).run();const row=await db().prepare('SELECT count FROM throttle WHERE id=?').bind(id).first<{count:number}>();return (row?.count||0)<=max;}
export function safeUrl(value:string){return typeof value==='string'&&(value.startsWith('/')&&!value.startsWith('//')||/^https:\/\//.test(value))?value:'';}
