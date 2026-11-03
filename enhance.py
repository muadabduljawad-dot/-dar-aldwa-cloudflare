from pathlib import Path
import re,json,shutil
shutil.copy('public/images/photo-10.jpg','public/images/photo-1.jpg')
shutil.copy('public/images/photo-2.jpg','public/images/photo-5.jpg')
p=Path('app/seed.ts');s=p.read_text().replace("photo(0),undefined,b('دار الدواء ·", "photo(7),undefined,b('دار الدواء ·")
s=s.replace("title:b(['أدوية ومستلزمات صحية','التجهيزات الطبية','البيئة المخبرية','مستحضرات دوائية','المرافق الصحية','تجهيز بيئات الرعاية'][i%6],['Medicines & supplies','Medical equipment','Laboratory setting','Pharmaceutical products','Healthcare facilities','Care environments'][i%6])", "title:b(['مستحضرات دوائية','معدات التحليل','البيئة المخبرية','أقراص وكبسولات','بيئات الرعاية الصحية','التجهيزات المخبرية','نماذج تعليمية طبية','أدوات ومستلزمات طبية','بيئة الرعاية الجراحية','أمبولات ومستلزمات','معدات المختبرات','أدوات التحليل'][i],['Pharmaceutical products','Analysis equipment','Laboratory environment','Tablets & capsules','Healthcare settings','Laboratory equipment','Medical teaching models','Medical supplies','Surgical care setting','Ampoules & supplies','Laboratory instruments','Analysis tools'][i])")
# Supply editable interface text dictionary.
public=Path('app/public-site.tsx').read_text();pairs=re.findall(r"(?:txt|t)\('([^']*)','([^']*)'\)",public);ui={a:{'ar':a,'en':b} for a,b in pairs}
s=s.replace("export const seed:Site={",'export const seed:Site={ui:'+json.dumps(ui,ensure_ascii=False)+',favicon:"/images/logo.jpg",fontFamily:"IBM Plex Sans Arabic",')
p.write_text(s)
p=Path('app/model.ts');s=p.read_text().replace('export type Site={','export type Site={ui?:Record<string,Bi>,favicon?:string,fontFamily?:string,');p.write_text(s)
p=Path('app/public-site.tsx');s=p.read_text().replace("const txt=(ar:string,en:string)=>lang==='ar'?ar:en;","const txt=(ar:string,en:string)=>site.ui?.[ar]?.[lang]||(lang==='ar'?ar:en);")
s=s.replace("document.documentElement.dir=lang==='ar'?'rtl':'ltr'","document.documentElement.dir=lang==='ar'?'rtl':'ltr';const favicon=document.querySelector<HTMLLinkElement>('link[rel=icon]');if(favicon&&safe(site.favicon))favicon.href=site.favicon!")
s=s.replace("},[lang]);","},[lang,site.favicon]);")
s=s.replace("'--space':site.spacing","fontFamily:site.fontFamily?`'${site.fontFamily}',sans-serif`:undefined,'--space':site.spacing")
s=s.replace('<Inquiry lang={lang}/>','<Inquiry lang={lang} ui={site.ui}/>')
s=s.replace("function Inquiry({lang}:{lang:'ar'|'en'})","function Inquiry({lang,ui}:{lang:'ar'|'en',ui?:Record<string,Bi>})").replace("const t=(ar:string,en:string)=>lang==='ar'?ar:en;async function submit","const t=(ar:string,en:string)=>ui?.[ar]?.[lang]||(lang==='ar'?ar:en);async function submit")
p.write_text(s)
p=Path('app/admin-client.tsx');s=p.read_text();s=s.replace("['appearance','المظهر واللغات']","['appearance','المظهر واللغات'],['labels','الأزرار ونصوص الواجهة']")
marker="{tab==='appearance'&&"
labels='''{tab==='labels'&&<fieldset disabled={!canEdit}><div className="admin-panel"><h2>الأزرار ونصوص الواجهة</h2><p>عدّل العبارات المشتركة في القوائم والأزرار والفوتر والنماذج.</p><input placeholder="بحث عن عبارة" value={search} onChange={e=>setSearch(e.target.value)}/>{Object.entries(site.ui||{}).filter(([k,v])=>(k+' '+v.en).includes(search)).map(([k,v])=><BField key={k} label={k} value={v} onChange={v=>change(s=>{s.ui={...s.ui,[k]:v}})}/>)}</div></fieldset>}
'''
s=s.replace(marker,labels+marker)
s=s.replace("{imageField('صورة مشاركة الموقع'", "{imageField('أيقونة المتصفح favicon',site.favicon||'',v=>change(s=>s.favicon=v))}<label>الخط<select value={site.fontFamily||'IBM Plex Sans Arabic'} onChange={e=>change(s=>s.fontFamily=e.target.value)}><option>IBM Plex Sans Arabic</option><option>Manrope</option><option>Arial</option><option>Tahoma</option></select></label>{imageField('صورة مشاركة الموقع'")
s=s.replace('<div className="admin-row"><label>رابط الصفحة', '''<div className="admin-row"><button disabled={pageIndex===0} onClick={()=>{change(s=>{[s.pages[pageIndex-1],s.pages[pageIndex]]=[s.pages[pageIndex],s.pages[pageIndex-1]]});setPageIndex(pageIndex-1)}}>↑ ترتيب الصفحة</button><button disabled={pageIndex===site.pages.length-1} onClick={()=>{change(s=>{[s.pages[pageIndex+1],s.pages[pageIndex]]=[s.pages[pageIndex],s.pages[pageIndex+1]]});setPageIndex(pageIndex+1)}}>↓ ترتيب الصفحة</button><label>رابط الصفحة''')
p.write_text(s)
