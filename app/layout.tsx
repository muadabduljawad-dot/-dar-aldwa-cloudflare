import './globals.css';
import {env} from 'cloudflare:workers';
export function generateMetadata(){return {metadataBase:new URL(env.PUBLIC_SITE_URL||'https://example.com'),title:'دار الدواء | Dar Aldwa',description:'Medicines, medical equipment and supplies import in Libya'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ar" suppressHydrationWarning><head><meta name="theme-color" content="#075b98"/><link rel="icon" href="/images/logo.jpg"/></head><body>{children}</body></html>}
