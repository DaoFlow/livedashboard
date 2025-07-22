import os
import subprocess
from pathlib import Path

REPO_URL = "https://github.com/SFOE/sharedmobility.git"
TARGET_DIR = Path(__file__).resolve().parents[1] / "sharedmobility"

def fetch_repo():
    if not TARGET_DIR.exists():
        print(f"Cloning {REPO_URL} into {TARGET_DIR}")
        subprocess.run(["git", "clone", REPO_URL, str(TARGET_DIR)], check=True)
    else:
        print(f"Updating existing repository in {TARGET_DIR}")
        subprocess.run(["git", "-C", str(TARGET_DIR), "pull"], check=True)

if __name__ == "__main__":
    fetch_repo()
