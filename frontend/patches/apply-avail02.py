#!/usr/bin/env python3
"""PILOTO-AVAIL-02: invalidate cached availability editor, no business changes."""
from pathlib import Path
import re, sys
root=Path(sys.argv[1] if len(sys.argv)>1 else "/src/frontend")
index_path=root/"index.html"
worker_path=root/"service-worker.js"
index=index_path.read_text(encoding="utf-8-sig")
worker=worker_path.read_text(encoding="utf-8-sig")
old="pilot-availability-areas.js?v=PILOTO-AVAIL-01"
new="pilot-availability-areas.js?v=PILOTO-AVAIL-02"
if index.count(old)!=1 or worker.count(old)!=1:
    raise SystemExit(f"AVAIL-02: stale script refs mismatch (HTML={index.count(old)}, SW={worker.count(old)}); stop build")
index=index.replace(old,new)
worker=worker.replace(old,new)
match=re.search(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;",worker)
if not match or not match.group(1).endswith("-cred01"):
    raise SystemExit("AVAIL-02: unexpected PWA cache suffix; stop build")
worker=worker[:match.start(1)]+match.group(1)[:-len("-cred01")]+"-avail02"+worker[match.end(1):]
index_path.write_text(index,encoding="utf-8",newline="\n")
worker_path.write_text(worker,encoding="utf-8",newline="\n")
print("PILOTO-AVAIL-02 installed: readable form validation and fresh cache")
