import re,urllib.request,concurrent.futures,json
from pathlib import Path
source=Path('app/seed.ts').read_text();ids=re.search(r"const pics=\[(.*?)\];",source).group(1);ids=re.findall(r"'([^']+)'",ids)
def get(item):
 i,p=item;url='https://images.unsplash.com/'+p+'?auto=format&fit=crop&w=1400&q=85'
 try:
  data=urllib.request.urlopen(url,timeout=35).read();Path('public/images/photo-'+str(i)+'.jpg').write_bytes(data);return i,len(data)
 except Exception as e:return i,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 print(list(ex.map(get,enumerate(ids))))
Path('image-sources.json').write_text(json.dumps([{'local':'public/images/photo-'+str(i)+'.jpg','source':'https://images.unsplash.com/'+p,'provider':'Unsplash','usage':'Illustrative healthcare photography'} for i,p in enumerate(ids)],indent=2))
