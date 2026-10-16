#!/usr/bin/env python3
"""PILOTO-EVENT-TEMPLATE-01: load suggested type/team templates and bust PWA cache."""
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/src/frontend")
p_index=root/"index.html"
p_sw=root/"service-worker.js"
html=p_index.read_text(encoding="utf-8-sig")
sw=p_sw.read_text(encoding="utf-8-sig")
js="./pilot-event-templates.js?v=PILOTO-EVENT-TEMPLATE-01"
css="./pilot-event-templates.css?v=PILOTO-EVENT-TEMPLATE-01"
if html.count("</body>")!=1 or html.count("</head>")!=1 or html.count('pilot-availability-areas.js')!=1:
    raise SystemExit("EVENT-TEMPLATE-01: unexpected HTML version; stop build.")
if "pilot-event-templates.js" in html or "pilot-event-templates.css" in html:
    raise SystemExit("EVENT-TEMPLATE-01: duplicate scripts; stop build.")
html=html.replace("</head>",f'  <link rel="stylesheet" href="{css}">\n</head>',1)
html=html.replace("</body>",f'  <script src="{js}" defer></script>\n</body>',1)
match=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",sw)
if not match or not match.group(1).endswith("-avail01"):
    raise SystemExit("EVENT-TEMPLATE-01: service worker is not at AVAIL-01; stop build.")
sw=sw[:match.start(1)]+match.group(1)[:-len("-avail01")]+"-eventtype01"+sw[match.end(1):]
if sw.count("const APP_SHELL=[")!=1:
    raise SystemExit("EVENT-TEMPLATE-01: unsupported service worker structure; stop build.")
sw=sw.replace("const APP_SHELL=[",f"const APP_SHELL=['{js}','{css}',",1)
p_index.write_text(html,encoding="utf-8",newline="\n")
p_sw.write_text(sw,encoding="utf-8",newline="\n")
print("PILOTO-EVENT-TEMPLATE-01 installed, PWA cache refreshed")
