import {env} from 'cloudflare:workers';
import {published} from './server';
export const dynamic='force-dynamic';
export default async function sitemap(){const site=await published();const base=(env.PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'');return site.pages.filter(p=>!p.hidden).flatMap(p=>['ar','en'].map(lang=>({url:base+'/'+lang+(p.slug?'/'+p.slug:''),alternates:{languages:{ar:base+'/ar'+(p.slug?'/'+p.slug:''),en:base+'/en'+(p.slug?'/'+p.slug:'')}}})));}
