# DNS Configuration Guide for ndlelasearchengine.co.za

## Your Server Information
- **Public IP**: 102.214.11.174
- **Domain**: ndlelasearchengine.co.za

## Step 1: Access Your Domain Registrar

You need to log in to where you registered `ndlelasearchengine.co.za`. Common registrars include:
- **South African**: ZACR, Domains.co.za, Afrihost, Axxess, Hetzner
- **International**: GoDaddy, Namecheap, Google Domains, Cloudflare

## Step 2: Add DNS A Records

Navigate to your DNS management panel and add these records:

### Records to Add:

```
Type: A
Host/Name: @
Value/Points to: 102.214.11.174
TTL: 3600 (or Auto)
```

```
Type: A
Host/Name: www
Value/Points to: 102.214.11.174
TTL: 3600 (or Auto)
```

### Visual Example:

| Type | Host/Name | Value          | TTL  |
|------|-----------|----------------|------|
| A    | @         | 102.214.11.174 | 3600 |
| A    | www       | 102.214.11.174 | 3600 |

### Common Registrar-Specific Instructions:

**Afrihost / Domains.co.za:**
1. Login to your account
2. Go to "My Domains"
3. Click on "ndlelasearchengine.co.za"
4. Click "DNS Management" or "Manage DNS"
5. Add the A records as shown above

**GoDaddy:**
1. Login to GoDaddy
2. Select "My Products"
3. Click DNS next to your domain
4. Click "Add" and select "A" record
5. Enter the details as shown above

**Cloudflare:**
1. Login to Cloudflare
2. Select your domain
3. Go to DNS settings
4. Click "Add record"
5. Add the A records (you can enable/disable proxy)

## Step 3: Verify DNS Propagation

After adding the records, wait 5-10 minutes, then test:

### From your server:
```bash
nslookup ndlelasearchengine.co.za
nslookup www.ndlelasearchengine.co.za

# Or using dig
dig ndlelasearchengine.co.za
dig www.ndlelasearchengine.co.za
```

### Expected Result:
Both should return `102.214.11.174`

### Online Tools:
You can also check using these websites:
- https://dnschecker.org/
- https://www.whatsmydns.net/

Enter `ndlelasearchengine.co.za` and check if it resolves to `102.214.11.174` globally.

## Step 4: Test HTTP Access

Once DNS is working:
```bash
curl http://ndlelasearchengine.co.za
curl http://www.ndlelasearchengine.co.za
```

Or open in browser:
- http://ndlelasearchengine.co.za
- http://www.ndlelasearchengine.co.za

## Troubleshooting

### "DNS Not Resolving" or "Can't be reached"
- **Wait longer**: DNS can take up to 48 hours to propagate globally (usually 5-30 minutes)
- **Clear DNS cache**: 
  - Windows: `ipconfig /flushdns`
  - Mac: `sudo dscacheutil -flushcache`
  - Linux: `sudo systemd-resolve --flush-caches`
- **Try different DNS server**: Use Google DNS (8.8.8.8) or Cloudflare (1.1.1.1)

### "Still showing old IP"
- Check TTL (Time To Live) - if you had old records, they may be cached
- Wait for the TTL period to expire
- Some registrars have propagation delays

### "Access Denied" or "Not authorized"
- Verify you're logged in as the domain owner
- Check if domain is locked (unlock it temporarily)
- Contact your registrar's support

## Common Registrar DNS Panels

### ZACR (.co.za domains)
Your registrar manages the DNS. Look for:
- "DNS Management"
- "Name Server Records"
- "DNS Settings"

### Afrihost
1. https://clientarea.afrihost.com/
2. My Products → Domains
3. Click on domain → DNS Management

### Hetzner (South Africa)
1. https://www.hetzner.co.za/
2. Login → Domains
3. DNS Zone Editor

## After DNS is Working

Once you can successfully access http://ndlelasearchengine.co.za, proceed to SSL setup:

```bash
cd /home/mulalo/applications/ndlela-search-engine
sudo ./setup-ssl.sh
```

## Quick Verification Commands

Run these from your server to check DNS status:

```bash
# Check if domain resolves
host ndlelasearchengine.co.za

# Check with specific DNS server (Google DNS)
nslookup ndlelasearchengine.co.za 8.8.8.8

# Test HTTP connection
curl -I http://ndlelasearchengine.co.za

# Check all DNS records
dig ndlelasearchengine.co.za ANY
```

## Need Help?

If you're having trouble:
1. Check your registrar's documentation
2. Contact your registrar's support
3. Provide them with:
   - Domain: ndlelasearchengine.co.za
   - IP Address: 102.214.11.174
   - Record Type: A record for @ and www

---

**Next Step**: After DNS is configured and working, run `sudo ./setup-ssl.sh` to enable HTTPS
