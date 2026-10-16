#!/usr/bin/env python3
"""Install contextual qualification correction after AVAIL-01 and bump PWA cache."""
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/src/frontend")
index_file=root/"index.html"
worker_file=root/"service-worker.js"
index=index_file.read_text(encoding="utf-8-sig")
worker=worker_file.read_text(encoding="utf-8-sig")
js="./pilot-credentials-edit.js?v=PILOTO-CRED-01"
css="./pilot-credentials-edit.css?v=PILOTO-CRED-01"
if index.count("</head>")!=1 or index.count("</body>")!=1 or index.count('pilot-availability-areas.js')!=1:
    raise SystemExit("CRED-01: unexpected HTML structure; stop build.")
if "pilot-credentials-edit" in index:
    raise SystemExit("CRED-01: already installed; stop build.")
index=index.replace("</head>",f'  <link rel="stylesheet" href="{css}">\n</head>',1)
index=index.replace("</body>",f'  <script src="{js}" defer></script>\n</body>',1)
version=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",worker)
if not version or not version.group(1).endswith("-avail01"):
    raise SystemExit("CRED-01: unexpected PWA cache version; stop build.")
worker=worker[:version.start(1)]+version.group(1)[:-len("-avail01")]+"-cred01"+worker[version.end(1):]
if worker.count("const APP_SHELL=[")!=1:
    raise SystemExit("CRED-01: APP_SHELL mismatch; stop build.")
worker=worker.replace("const APP_SHELL=[",f"const APP_SHELL=['{js}','{css}',",1)
index_file.write_text(index,encoding="utf-8",newline="\n")
worker_file.write_text(worker,encoding="utf-8",newline="\n")
print("PILOTO-CRED-01 editing installed with refreshed PWA cache")
