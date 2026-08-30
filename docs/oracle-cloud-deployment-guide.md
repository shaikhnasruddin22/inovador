# Oracle Cloud "Always Free" Deployment Guide — Inovador Design Studio

**Document**: Complete Step-by-Step Oracle Cloud Infrastructure (OCI) Setup & Deployment Guide  
**Specs**: Oracle Ampere A1 (2–4 OCPU, 6–12 GB RAM, Ubuntu 22.04/24.04 LTS)  
**Monthly Cost**: **₹0 / Month (Free Forever)**  

---

## Phase 1: Create Oracle Cloud Free Tier Account

1. Go to: **[oracle.com/cloud/free](https://www.oracle.com/cloud/free/)**
2. Click **Start for free**.
3. Fill in your details:
   - **Country**: Select your country (e.g., India).
   - **Home Region**: Choose the region closest to your audience (e.g., `India South (Hyderabad)` or `India West (Mumbai)`). *(Note: Once selected, Home Region cannot be changed).*
4. **Add Payment Method**:
   - Add a valid Visa / Mastercard credit or debit card (with international transactions enabled).
   - Oracle places a small temporary authorization hold (~₹75–₹85 / \$1) and immediately refunds it to verify identity.
5. Complete account verification and log in to the **Oracle Cloud Console**.

---

## Phase 2: Create the "Always Free" Ubuntu VPS Instance

1. In the Oracle Cloud dashboard, click the top-left navigation menu (☰) $\rightarrow$ **Compute** $\rightarrow$ **Instances**.
2. Click **Create Instance**.
3. Configure the instance:
   - **Name**: `inovador-production`
   - **Compartment**: Select your root compartment.
   - **Placement**: Availability Domain 1 (Default).
4. **Image and Shape**:
   - Click **Edit**.
   - **Image**: Click *Change Image* $\rightarrow$ Select **Canonical Ubuntu 22.04** or **24.04**.
   - **Shape**: Click *Change Shape* $\rightarrow$ Select **Ampere** (ARM processor) $\rightarrow$ Choose **VM.Standard.A1.Flex** (Always Free Eligible).
   - Set **OCPUs**: `2`
   - Set **Memory (GB)**: `6` *(or up to 12 GB)*.
5. **Networking (VCN)**:
   - Select **Create new virtual cloud network** and **Create new public subnet**.
   - **Assign public IPv4 address**: Select **Yes**.
6. **Add SSH Keys** *(CRITICAL)*:
   - Select **Generate a key pair for me**.
   - Click **Save private key** (downloads `ssh-key-....key` to your computer). Keep this safe!
7. **Boot Volume**: Default (50 GB is Always Free).
8. Click **Create**.
9. Wait 1–2 minutes until the instance status shows **RUNNING (Green)**. Note down the **Public IP Address**.

---

## Phase 3: Open Ports 80 & 443 in Oracle Firewall (VCN Security List)

> ⚠️ **CRITICAL STEP**: Oracle Cloud blocks all web traffic by default. You MUST add Ingress Rules in the Oracle Cloud Console.

1. On your Instance Details page, scroll down and click on your **Subnet** link (under Primary VNIC).
2. Click on the **Default Security List for...**.
3. Under **Ingress Rules**, click **Add Ingress Rules**:
   - **Source Type**: `CIDR`
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Source Port Range**: *(Leave blank)*
   - **Destination Port Range**: `80,443`
   - **Description**: `Allow HTTP and HTTPS web traffic`
4. Click **Add Ingress Rules**.

---

## Phase 4: Connect to Your Server via SSH

### On Windows (PowerShell or Command Prompt):
Navigate to the folder where you saved your private key:
```powershell
# Set permissions on the key (if needed)
# Connect using the 'ubuntu' username
ssh -i "path\to\your-ssh-key.key" ubuntu@YOUR_ORACLE_PUBLIC_IP
```

### On Mac / Linux:
```bash
chmod 400 path/to/your-ssh-key.key
ssh -i path/to/your-ssh-key.key ubuntu@YOUR_ORACLE_PUBLIC_IP
```

---

## Phase 5: Configure Ubuntu Firewall & Base System

Once logged into your server terminal:

### 1. Fix Oracle's Default `iptables` Web Block:
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

### 2. Update System & Install Essentials:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw software-properties-common build-essential
```

---

## Phase 6: Install Node.js 20 LTS, PM2 & MySQL

```bash
# 1. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2 Process Manager
sudo npm install -g pm2

# 3. Install MySQL Server
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

### Configure MySQL:
Open MySQL prompt:
```bash
sudo mysql
```

Paste these SQL commands *(replace `YourStrongPassword123!` with your own password)*:
```sql
CREATE DATABASE inovador_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'inovador_admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourStrongPassword123!';

GRANT ALL PRIVILEGES ON inovador_cms.* TO 'inovador_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Phase 7: Clone & Configure the Project

```bash
sudo mkdir -p /var/www/inovador
sudo chown -R $USER:$USER /var/www/inovador

git clone https://github.com/shaikhnasruddin22/inovador.git /var/www/inovador
```

### 1. Configure & Start Backend (Strapi v5):
```bash
cd /var/www/inovador/backend
nano .env
```

Paste your backend `.env`:
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
*(Press `Ctrl + O`, `Enter`, then `Ctrl + X` to save)*

Build and start Strapi:
```bash
npm install --include=dev
npm run build
pm2 start npm --name "inovador-cms" -- run start
```

---

### 2. Configure & Start Frontend (Next.js 16):
```bash
cd /var/www/inovador/frontend
nano .env.production
```

Paste your frontend `.env.production`:
```env
STRAPI_API_URL=http://127.0.0.1:1337
STRAPI_READ_TOKEN=your_strapi_read_token
STRAPI_WRITE_TOKEN=your_strapi_write_token

NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
USE_MOCK_DATA=false

REVALIDATE_SECRET=generate_long_random_revalidation_secret

RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=Inovador Briefs <briefs@yourdomain.com>
STUDIO_NOTIFICATION_EMAIL=studio@yourdomain.com

NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAA...
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAA...
```

Build and start Next.js:
```bash
npm install
npm run build
pm2 start npm --name "inovador-frontend" -- start

# Save PM2 state to auto-restart on boot
pm2 save
pm2 startup
```

---

## Phase 8: Configure Nginx & SSL

Install Nginx:
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/inovador
```

Paste Nginx configuration *(replace `yourdomain.com` with your domain)*:
```nginx
# 1. Next.js Frontend
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

# 2. Strapi CMS Backend
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

Enable configuration:
```bash
sudo ln -s /etc/nginx/sites-available/inovador /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Phase 9: Point DNS & Generate Free SSL

1. In your domain provider (GoDaddy / HostingRaja / Cloudflare), add **3 A Records** pointing to your **Oracle Public IP**:
   - `@` $\rightarrow$ `YOUR_ORACLE_PUBLIC_IP`
   - `www` $\rightarrow$ `YOUR_ORACLE_PUBLIC_IP`
   - `cms` $\rightarrow$ `YOUR_ORACLE_PUBLIC_IP`

2. Generate free SSL via Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d cms.yourdomain.com
```

3. Enable UFW firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

## Verification & Status

Your website is now completely online and hosted **100% Free Forever**:
- **Main Website**: `https://www.yourdomain.com`
- **CMS Admin**: `https://cms.yourdomain.com/admin`
- **Monitor processes**: `pm2 status` / `pm2 logs`
