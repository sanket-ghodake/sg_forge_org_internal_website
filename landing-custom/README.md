# 🌐 Custom Landing Page Starter Base (`landing-custom/`)

A production-ready starter template designed for building custom organizational landing pages with **zero Git conflicts** and **zero main repository drift**.

---

## 🎯 Architecture: Git Submodule & Zero Main Repo Drift

When pulling the latest platform features (`git pull origin main`), you should never experience merge conflicts from your custom marketing or landing page code.

This directory is architected to be maintained as an **independent Git repository or Git submodule**:

### Option 1: Attach as a Git Submodule with `ignore = all` (Recommended)
If you host your custom landing page in a separate Git repository (e.g. GitHub/GitLab):

```bash
# 1. Add your repository as a submodule
git submodule add <your-custom-landing-git-url> landing-custom

# 2. Configure Git to ignore all submodule working tree modifications & commits
git config submodule.landing-custom.ignore all
```

In `.gitmodules`:
```ini
[submodule "landing-custom"]
    path = landing-custom
    url = <your-custom-landing-git-url>
    ignore = all
```

With `ignore = all`:
- You can freely edit, commit, and push in `landing-custom/` without making the main SG Forge repository dirty.
- Running `git pull origin main` in the main repo fast-forwards smoothly with zero merge conflicts.

### Option 2: Independent Nested Git Repository
You can also initialize an independent git repo directly inside this folder:
```bash
cd landing-custom
git init
git remote add origin <your-custom-repo-url>
```

---

## 🚀 Quickstart & Local Development

### 1. Run Standalone
```bash
cd landing-custom
bun run dev
# Server running at http://localhost:3000
```

### 2. Connect to SG Forge Gateway (`.env`)
To have the Caddy reverse proxy route root traffic (`/`) to this custom landing page, update `.env`:

```env
APP_LANDING="Custom Landing|3000|/|Platform Services|Public Ingress|landing-custom"
```

Then regenerate the proxy or start the platform:
```bash
./run.sh sync-proxy
./run.sh dev
```

---

## 🐳 Docker Deployment

Build and run as a standalone container:
```bash
docker build -t custom-landing:latest -f Dockerfile .
docker run -d --name custom-landing -p 3000:3000 --network ag_net custom-landing:latest
```

---

## 📁 Directory Structure
```
landing-custom/
├── Dockerfile              # Production container build
├── README.md               # Developer and submodule guide
├── package.json            # Independent package definition
├── logs/                   # Isolated runtime logs directory
│   ├── .gitignore
│   └── README.md
├── src/
│   ├── README.md
│   ├── server.ts           # Standalone Bun HTTP server
│   └── template.html.ts    # Meta Astryx responsive HTML template
└── test/
    ├── README.md
    └── landing-custom.test.ts # Tier 1 unit tests
```
