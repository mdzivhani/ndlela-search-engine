#!/bin/bash

# DNS Status Checker for ndlelasearchengine.co.za

echo "============================================"
echo "DNS Status Check"
echo "============================================"
echo ""

DOMAIN="ndlelasearchengine.co.za"
SERVER_IP=$(curl -s ifconfig.me)

echo "Server IP: $SERVER_IP"
echo "Domain: $DOMAIN"
echo ""

# Check with system DNS
echo "1. Checking with system DNS..."
DNS_RESULT=$(nslookup $DOMAIN 2>&1)
if echo "$DNS_RESULT" | grep -q "NXDOMAIN"; then
    echo "   ❌ Domain not found (NXDOMAIN)"
    DNS_CONFIGURED=false
elif echo "$DNS_RESULT" | grep -q "$SERVER_IP"; then
    echo "   ✅ Domain resolves to $SERVER_IP (CORRECT)"
    DNS_CONFIGURED=true
else
    RESOLVED_IP=$(echo "$DNS_RESULT" | grep "Address:" | tail -1 | awk '{print $2}')
    echo "   ⚠️  Domain resolves to $RESOLVED_IP (INCORRECT - should be $SERVER_IP)"
    DNS_CONFIGURED=false
fi

echo ""

# Check with Google DNS
echo "2. Checking with Google DNS (8.8.8.8)..."
GOOGLE_DNS=$(dig +short $DOMAIN @8.8.8.8 | tail -1)
if [ -z "$GOOGLE_DNS" ]; then
    echo "   ❌ Not found on Google DNS"
elif [ "$GOOGLE_DNS" = "$SERVER_IP" ]; then
    echo "   ✅ Resolves to $SERVER_IP (CORRECT)"
else
    echo "   ⚠️  Resolves to $GOOGLE_DNS (INCORRECT)"
fi

echo ""

# Check www subdomain
echo "3. Checking www.$DOMAIN..."
WWW_DNS=$(dig +short www.$DOMAIN @8.8.8.8 | tail -1)
if [ -z "$WWW_DNS" ]; then
    echo "   ❌ www subdomain not found"
elif [ "$WWW_DNS" = "$SERVER_IP" ]; then
    echo "   ✅ www resolves to $SERVER_IP (CORRECT)"
else
    echo "   ⚠️  www resolves to $WWW_DNS (INCORRECT)"
fi

echo ""

# Test HTTP connection if DNS is configured
if [ "$DNS_CONFIGURED" = true ]; then
    echo "4. Testing HTTP connection..."
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://$DOMAIN 2>/dev/null)
    if [ "$HTTP_RESPONSE" = "200" ]; then
        echo "   ✅ HTTP connection successful (200 OK)"
    else
        echo "   ⚠️  HTTP returned code: $HTTP_RESPONSE"
    fi
fi

echo ""
echo "============================================"
echo "Summary"
echo "============================================"

if [ "$DNS_CONFIGURED" = true ]; then
    echo "✅ DNS is properly configured!"
    echo ""
    echo "You can access your site at:"
    echo "  • http://$DOMAIN"
    echo "  • http://www.$DOMAIN"
    echo ""
    echo "Next step: Setup SSL/HTTPS"
    echo "  cd /home/mulalo/applications/ndlela-search-engine"
    echo "  sudo ./setup-ssl.sh"
else
    echo "❌ DNS is NOT configured yet"
    echo ""
    echo "Required DNS records:"
    echo "  Type  Host    Value"
    echo "  A     @       $SERVER_IP"
    echo "  A     www     $SERVER_IP"
    echo ""
    echo "See DNS_SETUP_GUIDE.md for detailed instructions"
    echo ""
    echo "After configuring DNS:"
    echo "  1. Wait 5-10 minutes for propagation"
    echo "  2. Run this script again: ./check-dns.sh"
    echo "  3. Once DNS is working, run: sudo ./setup-ssl.sh"
fi

echo ""
