#!/usr/bin/env python3
"""Install REG-01 client script on top of MOBILE1, including PWA cache-bust."""
from pathlib import Path
import re
import sys
root = Path(sys.argv[1] if len(sys.argv) > 1 else "/src/frontend")
index_path, sw_path = root / "index.html", root / "service-worker.js"
index, sw = index_path.read_text(encoding="utf-8-sig"), sw_path.read_text(encoding="utf-8-sig")
script = "./pilot-register-referee.js?v=PILOTO-REG-01"
tag = f'  <script src="{script}" defer></script>'
if tag not in index:
    if index.count("</body>") != 1:
        raise SystemExit("REG-01: unexpected index.html; cancel build")
    index = index.replace("</body>", tag + "\n</body>", 1)
cache = re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;", sw)
if not cache:
    raise SystemExit("REG-01: PWA cache version missing; cancel build")
new_cache = cache.group(1)
if not new_cache.endswith("-reg01"):
    new_cache += "-reg01"
sw = sw[:cache.start(1)] + new_cache + sw[cache.end(1):]
if script not in sw:
    if sw.count("const APP_SHELL=[") != 1:
        raise SystemExit("REG-01: unexpected service worker; cancel build")
    sw = sw.replace("const APP_SHELL=[", f"const APP_SHELL=['{script}',", 1)
index_path.write_text(index, encoding="utf-8", newline="\n")
sw_path.write_text(sw, encoding="utf-8", newline="\n")
print("REG-01 frontend installed with fresh service-worker cache")
