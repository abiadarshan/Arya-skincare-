"""
Local preview server for the ANYA website.

Run from this folder:   py serve.py        (or: python serve.py)
Then open:              http://localhost:5640

It's Python's built-in http.server, plus a "no-cache" header so the
browser always loads your latest CSS/JS changes after a refresh.
"""

import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5640
os.chdir(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


print(f"ANYA site running at http://localhost:{PORT}  (Ctrl+C to stop)")
http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler).serve_forever()
