import {redirect} from 'next/navigation';
import {published} from './server';
export const dynamic='force-dynamic';
export default async function Page(){const site=await published();redirect('/'+(site.defaultLanguage==='en'?'en':'ar'));}
