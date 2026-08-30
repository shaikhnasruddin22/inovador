# Single Linux VPS Production Deployment Guide — Inovador Design Studio

**Document**: All-in-One Ubuntu VPS Deployment Specification (Next.js 16 + Strapi v5 + MySQL + Nginx + PM2 + Let's Encrypt SSL)  
**Target OS**: Ubuntu 22.04 LTS / 24.04 LTS (Hetzner, Hostinger, DigitalOcean, Linode, AWS EC2, or GoDaddy VPS)  
**Minimum Recommended Server Specs**: 2 vCPU, 2GB–4GB RAM, 30GB+ SSD  

---

## 1. Architecture Overview

Everything runs securely on a single VPS:

```text
                             Public Internet (HTTPS: 443)
                                          │
                                          ▼
                               Nginx Reverse Proxy
                     (SSL Terminated by Let's Encrypt)
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         Next.js 16 Frontend                             Strapi v5 CMS
        (Managed by PM2: Port 3000)                   (Managed by PM2: Port 1337)
                  │                                               │
                  │ (Server API / ISR Calls)                      │ (DB Queries)
                  └───────────────────────┬───────────────────────┘
                                          ▼
                                Local MySQL Database
                                  (127.0.0.1:3306)
```

---

## Step 1: Initial Server Setup & Package Installation

Connect to your VPS via SSH as `root`:
```bash
ssh root@YOUR_SERVER_IP
```

Update your system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install essential tools, Git, and build utilities:
```bash
sudo apt install -y curl wget git ufw software-properties-common build-essential
```

---

## Step 2: Install Node.js 20 LTS & PM2

Install Node.js 20 LTS via official NodeSource repository:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify Node.js and NPM versions:
```bash
node -v    # Expected: v20.x.x
npm -v     # Expected: v10.x.x
```

Install **PM2** globally to manage persistent background processes:
```bash
sudo npm install -g pm2
```

---

## Step 3: Install & Configure MySQL 8.0

Install MySQL Server:
```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

Run MySQL security configuration:
```bash
sudo mysql_secure_installation
```

Log into MySQL prompt:
```bash
sudo mysql
```

Execute the following SQL commands to create the database and dedicated user *(replace `YourStrongPassword123!` with a secure password)*:
```sql
CREATE DATABASE inovador_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'inovador_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourStrongPassword123!';

GRANT ALL PRIVILEGES ON inovador_cms.* TO 'inovador_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 4: Clone the Project Repository

Create the application directory:
```bash
sudo mkdir -p /var/www/inovador
sudo chown -R $USER:$USER /var/www/inovador
```

Clone your GitHub repository:
```bash
git clone https://github.com/shaikhnasruddin22/inovador.git /var/www/inovador
cd /var/www/inovador
```

---

## Step 5: Configure & Build Backend (Strapi v5 CMS)

Navigate to `backend`:
```bash
cd /var/www/inovador/backend
```

Create production `.env` file:
```bash
nano .env
```

Paste the following configuration *(generate random 32-character strings for keys or use `openssl rand -base64 32`)*:
```env
HOST=127.0.0.1
PORT=1337
NODE_ENV=production
PUBLIC_URL=https://cms.yourdomain.com
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com

DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=inovador_cms
DATABASE_USERNAME=inovador_admin
DATABASE_PASSWORD=YourStrongPassword123!
DATABASE_SSL=false

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

APP_KEYS=random_key_1,random_key_2,random_key_3,random_key_4
API_TOKEN_SALT=random_salt_1
ADMIN_JWT_SECRET=random_jwt_secret_1
TRANSFER_TOKEN_SALT=random_salt_2
JWT_SECRET=random_jwt_secret_2

REVALIDATE_SECRET=generate_long_random_revalidation_secret
```
*(Save and exit nano: press `Ctrl + O`, `Enter`, then `Ctrl + X`)*

Install dependencies and compile the Strapi production build:
```bash
npm install --include=dev
npm run build
```

Start Strapi with PM2:
```bash
pm2 start npm --name "inovador-cms" -- run start
```

Verify Strapi is running:
```bash
pm2 status
curl http://127.0.0.1:1337
```

---

## Step 6: Configure & Build Frontend (Next.js 16)

Navigate to `frontend`:
```bash
cd /var/www/inovador/frontend
```

Create production `.env.production` file:
```bash
nano .env.production
```

Paste the frontend configuration:
```env
# CMS Backend API (Internal on VPS or public domain)
STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_READ_TOKEN=your_strapi_read_token_generated_in_admin
STRAPI_WRITE_TOKEN=your_strapi_write_token_generated_in_admin

NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
USE_MOCK_DATA=false

REVALIDATE_SECRET=generate_long_random_revalidation_secret

# Resend Email Integration
RESEND_API_KEY=re_your_live_api_key
RESEND_FROM_EMAIL=Inovador Briefs <briefs@yourdomain.com>
STUDIO_NOTIFICATION_EMAIL=studio@yourdomain.com

# Cloudflare Turnstile Bot Protection
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAA_your_site_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAAA_your_secret_key
```
*(Save and exit nano: `Ctrl + O`, `Enter`, `Ctrl + X`)*

Install dependencies and compile the Next.js production build:
```bash
npm install
npm run build
```

Start Next.js with PM2:
```bash
pm2 start npm --name "inovador-frontend" -- start
```

---

## Step 7: Configure PM2 to Auto-Start on System Boot

Ensure both Next.js and Strapi restart automatically if the server reboots:
```bash
pm2 save
pm2 startup
```
*(Copy and execute the `sudo env PATH=...` command that PM2 prints out)*

---

## Step 8: Install & Configure Nginx Web Server

Install Nginx:
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Create the Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/inovador
```

Paste the following Nginx configuration *(replace `yourdomain.com` with your actual domain)*:
```nginx
# 1. Next.js Frontend Configuration
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}

# 2. Strapi CMS Backend Configuration
server {
    server_name cms.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 100M;
}
```

Enable the configuration and disable default:
```bash
sudo ln -s /etc/nginx/sites-available/inovador /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 9: DNS Records & Free SSL with Let's Encrypt

In your Domain Registrar DNS (GoDaddy / Namecheap / Cloudflare / HostingRaja), add these **A Records** pointing to your VPS Public IP:

| Type | Host / Name | Value / Points To | TTL |
|---|---|---|---|
| `A` | `@` | `YOUR_VPS_IP` | Automatic / 300 |
| `A` | `www` | `YOUR_VPS_IP` | Automatic / 300 |
| `A` | `cms` | `YOUR_VPS_IP` | Automatic / 300 |

Once DNS propagates (usually 5–15 minutes), install **Certbot** and generate SSL certificates:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d cms.yourdomain.com
```
*(Select Option 2 to automatically redirect all HTTP traffic to HTTPS)*

---

## Step 10: Configure Linux Firewall (UFW)

Secure your server by allowing only SSH, HTTP, and HTTPS:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## Step 11: Future Updates & Maintenance

Whenever you make changes and push to GitHub:
```bash
cd /var/www/inovador
git pull origin main

# Update Backend (if changed)
cd backend && npm install && npm run build && pm2 restart inovador-cms

# Update Frontend (if changed)
cd ../frontend && npm install && npm run build && pm2 restart inovador-frontend
```

---

## Useful PM2 Commands

- View live logs: `pm2 logs`
- Monitor CPU/RAM: `pm2 monit`
- Check running apps: `pm2 list`
- Restart all: `pm2 restart all`
