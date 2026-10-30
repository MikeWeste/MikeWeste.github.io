#!/usr/bin/env python3
"""Build lqa.min.css from lqa.css + lqa-fix.css (strip comments and line breaks)."""
import re
from pathlib import Path

root = Path(__file__).parent
src = (root / "lqa.css").read_text(encoding="utf-8") + (root / "lqa-fix.css").read_text(encoding="utf-8")
src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
src = re.sub(r"\s*\n\s*", "", src)
(root / "lqa.min.css").write_text("/* lqa.min.css */\n" + src, encoding="utf-8")
