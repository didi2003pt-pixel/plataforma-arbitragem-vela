#!/usr/bin/env python3
"""PILOTO-AVAIL-01: use existing requirements to show committees in referee availability."""
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/src/frontend")
index_path=root/"index.html"
sw_path=root/"service-worker.js"
index=index_path.read_text(encoding="utf-8-sig")
sw=sw_path.read_text(encoding="utf-8-sig")
js="./pilot-availability-areas.js?v=PILOTO-AVAIL-01"
css="./pilot-availability-areas.css?v=PILOTO-AVAIL-01"
if index.count("</body>")!=1 or index.count("</head>")!=1 or index.count('pilot-profile-ui.js')!=1:
    raise SystemExit("AVAIL-01: unexpected HTML structure. Stop build.")
if "pilot-availability-areas" in index:
    raise SystemExit("AVAIL-01 already installed. Stop build.")
index=index.replace("</head>",f'  <link rel="stylesheet" href="{css}">\n</head>',1)
index=index.replace("</body>",f'  <script src="{js}" defer></script>\n</body>',1)
match=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",sw)
if not match or not match.group(1).endswith("-reg07"):
    raise SystemExit("AVAIL-01: unexpected service-worker cache suffix. Stop build.")
sw=sw[:match.start(1)]+match.group(1)[:-len("-reg07")]+"-avail01"+sw[match.end(1):]
if sw.count("const APP_SHELL=[")!=1:
    raise SystemExit("AVAIL-01: unexpected APP_SHELL. Stop build.")
sw=sw.replace("const APP_SHELL=[",f"const APP_SHELL=['{js}','{css}',",1)
index_path.write_text(index,encoding="utf-8",newline="\n")
sw_path.write_text(sw,encoding="utf-8",newline="\n")
print("PILOTO-AVAIL-01 committees UI installed and PWA cache refreshed")
