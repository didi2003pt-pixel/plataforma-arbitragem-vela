#!/usr/bin/env python3
"""Install REG-05 UI after REG-04 and refresh the PWA cache to prevent stale screens."""
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/src/frontend")
index_path=root/"index.html"
sw_path=root/"service-worker.js"
index=index_path.read_text(encoding="utf-8-sig")
sw=sw_path.read_text(encoding="utf-8-sig")
script="./pilot-profile-ui.js?v=PILOTO-REG-06"
css="./pilot-profile-ui.css?v=PILOTO-REG-06"
if index.count("</head>")!=1 or index.count("</body>")!=1 or index.count("pilot-register-referee.js")!=1:
    raise SystemExit("REG-05: unexpected HTML layout; stop build.")
if script in index or css in index:
    raise SystemExit("REG-05: page already modified; stop build.")
index=index.replace("</head>",f'  <link rel="stylesheet" href="{css}">\n</head>',1)
index=index.replace("</body>",f'  <script src="{script}" defer></script>\n</body>',1)
cache=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",sw)
if not cache or not cache.group(1).endswith("-reg04"):
    raise SystemExit("REG-05: unexpected Service Worker cache version; stop build.")
sw=sw[:cache.start(1)]+cache.group(1)[:-len("-reg04")]+"-reg06"+sw[cache.end(1):]
if sw.count("const APP_SHELL=[")!=1:
    raise SystemExit("REG-05: missing APP_SHELL; stop build.")
sw=sw.replace("const APP_SHELL=[",f"const APP_SHELL=['{css}','{script}',",1)
index_path.write_text(index,encoding="utf-8",newline="\n")
sw_path.write_text(sw,encoding="utf-8",newline="\n")
print("REG-06 UI installed: compact edit action and profile correction request")
