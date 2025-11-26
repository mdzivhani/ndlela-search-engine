# 🚀 Quick Start: DNS and SSL Setup

## Current Status: ✅ Application Running on HTTP

Your application is successfully deployed and accessible at:
- **HTTP**: http://102.214.11.174 ✓ Working

## 📋 What You Need to Do

### Step 1: Configure DNS (YOUR ACTION REQUIRED)

**Goal**: Make ndlelasearchengine.co.za point to your server

**Your Server IP**: `102.214.11.174`

#### Instructions:

1. **Log in to your domain registrar** (where you bought ndlelasearchengine.co.za)
   - Common SA registrars: Afrihost, Domains.co.za, Hetzner, ZACR

2. **Find DNS Management**
   - Look for: "DNS Settings", "DNS Management", or "Name Servers"

3. **Add these TWO A records**:

   ```
   Type: A    Host: @      Value: 102.214.11.174    TTL: 3600
   Type: A    Host: www    Value: 102.214.11.174    TTL: 3600
   ```

4. **Save the changes**

5. **Wait 5-10 minutes** for DNS to propagate

#### Visual Guide:

```
┌─────────────────────────────────────────┐
│ DNS Management                          │
├─────────┬──────┬────────────────┬───────┤
│ Type    │ Host │ Value          │ TTL   │
├─────────┼──────┼────────────────┼───────┤
│ A       │ @    │ 102.214.11.174 │ 3600  │
│ A       │ www  │ 102.214.11.174 │ 3600  │
└─────────┴──────┴────────────────┴───────┘
```

### Step 2: Check DNS Status

After waiting 5-10 minutes, run this command on your server:

```bash
cd /home/mulalo/applications/ndlela-search-engine
./check-dns.sh
```

**What to look for:**
- ✅ "DNS is properly configured!" = Ready for SSL
- ❌ "DNS is NOT configured yet" = Wait longer or check DNS settings

**Alternative check (from any computer):**
- Visit: https://dnschecker.org/
- Enter: `ndlelasearchengine.co.za`
- Should show: `102.214.11.174`

### Step 3: Setup SSL/HTTPS (After DNS is working)

Once DNS check shows ✅, run:

```bash
cd /home/mulalo/applications/ndlela-search-engine
sudo ./setup-ssl.sh
```

This will:
1. Verify DNS is configured
2. Obtain free SSL certificate from Let's Encrypt
3. Configure HTTPS
4. Enable automatic certificate renewal
5. Redirect HTTP to HTTPS

**Duration**: 1-2 minutes

### Step 4: Access Your Site

After SSL setup completes:
- **HTTPS**: https://ndlelasearchengine.co.za ✅
- **HTTPS (www)**: https://www.ndlelasearchengine.co.za ✅
- HTTP will automatically redirect to HTTPS

---

## 📖 Detailed Documentation

For more details, see:
- **DNS_SETUP_GUIDE.md** - Detailed DNS configuration instructions
- **DEPLOYMENT_GUIDE.md** - Complete deployment documentation
- **FINAL_DEPLOYMENT_SUMMARY.md** - Current deployment status

---

## ⚡ Quick Commands Reference

### Check DNS Status
```bash
./check-dns.sh
```

### Setup SSL (after DNS works)
```bash
sudo ./setup-ssl.sh
```

### Check Application Status
```bash
docker compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

---

## 🔍 Troubleshooting

### DNS Not Working After 10 Minutes?

**Check your DNS settings:**
```bash
# From your server
nslookup ndlelasearchengine.co.za

# Expected: Should show 102.214.11.174
# If not: Double-check your DNS records in registrar panel
```

**Common issues:**
- Wrong IP address in DNS records
- DNS records not saved
- TTL too high (old records cached)
- Using wrong DNS management panel

**Solution:** 
- Log back into registrar
- Verify the A records are exactly as shown
- Delete any conflicting records
- Save again and wait

### SSL Setup Fails?

**Error: "DNS not configured"**
- DNS check failed
- Run `./check-dns.sh` to diagnose
- Ensure DNS points to 102.214.11.174

**Error: "Port 80 not accessible"**
- Firewall blocking port 80
- Check: `sudo ufw status`
- Fix: `sudo ufw allow 80/tcp`

**Error: "Certificate validation failed"**
- DNS configured but not propagated globally yet
- Wait 30 more minutes and try again

---

## 🎯 Expected Timeline

| Step | Duration | Status |
|------|----------|--------|
| Application deployment | ✅ Complete | Done |
| Configure DNS | 5 minutes | **← YOU ARE HERE** |
| Wait for DNS propagation | 5-30 minutes | Waiting |
| Check DNS status | 1 minute | After propagation |
| Run SSL setup | 2 minutes | After DNS works |
| **Total** | **15-40 minutes** | In progress |

---

## ✅ Success Checklist

- [x] Application deployed on server
- [x] Accessible via http://102.214.11.174
- [ ] **DNS A records added (@ and www)**
- [ ] DNS propagated and verified
- [ ] SSL certificate obtained
- [ ] HTTPS working on domain
- [ ] Automatic HTTPS redirect enabled

---

## 📞 Need Help?

1. **Check DNS status**: Run `./check-dns.sh`
2. **Read detailed guide**: `cat DNS_SETUP_GUIDE.md`
3. **View application logs**: `docker compose -f docker-compose.prod.yml logs`
4. **Check all documentation**: `ls -la *.md`

---

## 🎉 What's Next After SSL?

Once HTTPS is working:

1. **Test your site**: https://ndlelasearchengine.co.za
2. **Configure firewall**: Restrict ports for security
3. **Setup monitoring**: Check logs regularly
4. **Database backups**: Schedule automated backups
5. **Update application**: Pull new code and redeploy as needed

Your application will be fully production-ready!

---

**Current Step**: Configure DNS with your registrar
**Command to check**: `./check-dns.sh`
**Next command**: `sudo ./setup-ssl.sh` (after DNS works)
