from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else "/src/frontend")
index_path = root / "index.html"
sw_path = root / "service-worker.js"

css_ref = "./mobile-fix.css?v=3.2.0-mobile1"
js_ref = "./mobile-fix.js?v=3.2.0-mobile1"

index = index_path.read_text(encoding="utf-8-sig")
sw = sw_path.read_text(encoding="utf-8-sig")

if css_ref not in index:
    if "</head>" not in index:
        raise SystemExit("MOBILE1: </head> not found in index.html")
    index = index.replace(
        "</head>",
        f'  <link rel="stylesheet" href="{css_ref}" />\n</head>',
        1,
    )

if js_ref not in index:
    if "</body>" not in index:
        raise SystemExit("MOBILE1: </body> not found in index.html")
    index = index.replace(
        "</body>",
        f'  <script src="{js_ref}" defer></script>\n</body>',
        1,
    )

cache_rx = re.compile(r"const\s+CACHE_VERSION\s*=\s*'([^']+)'\s*;")
match = cache_rx.search(sw)
if not match:
    raise SystemExit("MOBILE1: CACHE_VERSION not found in service-worker.js")

cache_value = match.group(1)
if not cache_value.endswith("-mobile1"):
    cache_value += "-mobile1"
sw = cache_rx.sub(f"const CACHE_VERSION='{cache_value}';", sw, count=1)

if css_ref not in sw or js_ref not in sw:
    shell_rx = re.compile(r"const\s+APP_SHELL\s*=\s*\[")
    if not shell_rx.search(sw):
        raise SystemExit("MOBILE1: APP_SHELL not found in service-worker.js")
    sw = shell_rx.sub(
        f"const APP_SHELL=['{css_ref}','{js_ref}',",
        sw,
        count=1,
    )

index_path.write_text(index, encoding="utf-8", newline="\n")
sw_path.write_text(sw, encoding="utf-8", newline="\n")

print("MOBILE1: build patch applied")
