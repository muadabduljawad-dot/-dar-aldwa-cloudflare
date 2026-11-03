import {notFound} from 'next/navigation';
import {published} from '../../server';
import PublicSite from '../../public-site';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{lang:string,slug?:string[]}>}){const {lang,slug}=await params;const site=await published();const page=site.pages.find(p=>p.slug===(slug||[]).join('/'));return {title:page?.title[lang==='en'?'en':'ar']+' | '+site.name[lang==='en'?'en':'ar'],description:page?.description[lang==='en'?'en':'ar'],alternates:{canonical:"/"+lang+(page?.slug?"/"+page.slug:""),languages:{ar:"/ar"+(page?.slug?"/"+page.slug:""),en:"/en"+(page?.slug?"/"+page.slug:"")}},openGraph:{images:[site.seoImage]}};}
export default async function Page({params}:{params:Promise<{lang:string,slug?:string[]}>}){const {lang,slug}=await params;if(!['ar','en'].includes(lang))notFound();const site=await published();const page=site.pages.find(p=>p.slug===(slug||[]).join('/')&&!p.hidden);if(!page)notFound();return <PublicSite initial={site} lang={lang as 'ar'|'en'} slug={page.slug}/>;}
