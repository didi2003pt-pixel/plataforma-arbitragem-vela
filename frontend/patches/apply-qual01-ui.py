#!/usr/bin/env python3
"""QUAL-01: inject CA qualifications edit UI after all overlays; refresh PWA."""
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '/src/frontend')
page=root/'index.html';worker=root/'service-worker.js'
html=page.read_text(encoding='utf-8-sig')
sw=worker.read_text(encoding='utf-8-sig')
script='./pilot-qualifications-ui.js?v=PILOTO-QUAL-01'
if html.count('</body>')!=1 or html.count('pilot-availability-areas.js')!=1:
    raise SystemExit('QUAL-01 unexpected index, refuse patch')
if script in html:raise SystemExit('QUAL-01 already installed')
html=html.replace('</body>',f'  <script src="{script}" defer></script>\n</body>',1)
match=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",sw)
if not match or not match.group(1).endswith('-avail01'):
    raise SystemExit('QUAL-01 unexpected service worker cache')
sw=sw[:match.start(1)]+match.group(1)[:-len('-avail01')]+'-qual01'+sw[match.end(1):]
if sw.count('const APP_SHELL=[')!=1:raise SystemExit('QUAL-01 APP_SHELL changed')
sw=sw.replace('const APP_SHELL=[',f"const APP_SHELL=['{script}',",1)
page.write_text(html,encoding='utf-8',newline='\n')
worker.write_text(sw,encoding='utf-8',newline='\n')
print('QUAL-01: edit official qualifications UI installed with fresh PWA cache')
