from __future__ import annotations

import http.server
import socketserver
import threading
import webbrowser
from pathlib import Path

PORT = 8000
ROOT = Path(__file__).resolve().parent


def main() -> None:
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as server:
        url = f"http://127.0.0.1:{PORT}/"
        print(f"A karakterlap fut: {url}")
        print("Leállítás: Ctrl+C")
        threading.Timer(0.7, lambda: webbrowser.open(url)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nA szerver leállt.")


if __name__ == "__main__":
    import os
    os.chdir(ROOT)
    main()
