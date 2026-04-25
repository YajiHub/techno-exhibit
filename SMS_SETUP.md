# SMS Setup Guide - Semaphore API

## Why Semaphore?

Semaphore is perfect for the Philippines:
- ✅ Free 100 intro credits (~100 SMS)
- ✅ No credit card required
- ✅ Designed for Philippine mobile networks
- ✅ Simple REST API
- ✅ Supports all major PH telcos (Globe, Smart, Sun)

## Step-by-Step Setup

### 1. Create Account
- Go to https://semaphore.co/
- Click **"Sign Up"**
- Enter email (e.g., s.montecillo.jopurjayii@cmu.edu.ph)
- Create password
- Click verification link in email

### 2. Get API Key
- Log in to Semaphore dashboard
- Go to **Settings** → **API Keys**
- Copy your **API Key** (starts with a long hex string)
- ⚠️ Keep this secret! (Though this is a demo, don't share publicly)

### 3. Add to SentinelClick

**In the Prototype:**
1. Open SentinelClick in browser (http://localhost:5173/)
2. Click **Mobile** tab
3. Go to **CIRCLE** tab
4. Click **▶ SMS API Key (Optional)**
5. Paste your Semaphore API key
6. Click **Save API Key**

The key is now saved locally in your browser.

### 4. Test SMS Sending

**Method 1: Direct Test**
- Add a contact with your phone number (09631338357)
- Click SOS button on 3D model
- Check your phone! 📱

**Method 2: Check Semaphore Dashboard**
- Log in to https://semaphore.co/
- Go to **Messages** → **Sent**
- See all SMS sent from the app

## Phone Number Formats

Semaphore accepts:
- ✅ `09XXXXXXXXX` (local format)
- ✅ `+639XXXXXXXXX` (international format)
- ✅ `639XXXXXXXXX` (without +)

Example with your number:
- `09631338357` ✅
- `+639631338357` ✅
- `639631338357` ✅

## Message Format

Default SOS message includes:
```
🚨 EMERGENCY ALERT 🚨
SentinelClick Activated!
Location: https://www.google.com/maps?q=14.5547,121.0244
Time: 3:45:23 PM
```

Characters counted: Standard SMS limits apply (160 chars = 1 SMS, 153 chars = 1 SMS if includes emoji)

## Troubleshooting

### "API Key Invalid"
- Copy entire key (no extra spaces)
- Log in to Semaphore, verify key still valid
- Try clicking Save again

### "No credits remaining"
- Free account has 100 intro credits only
- Create new account or upgrade plan

### SMS received but delayed
- Semaphore typically sends within 1-3 seconds
- Philippines carrier may add delay
- Normal for high-volume SMS

### Contact number rejected
- Invalid format - use 09XXXXXXXXX
- Not a valid PH number
- Try another number to test

## Free Alternatives (If Semaphore Limited)

| Service | Cost | Setup | Notes |
|---------|------|-------|-------|
| **Semaphore** | 100 free | 2 min | PH-optimized ⭐ |
| **Twilio** | $15 trial | 5 min | Global, more features |
| **Vonage** | Free tier | 10 min | High volume friendly |
| **AWS SNS** | Pay-per-use | Complex | Enterprise-grade |

## Advanced: Custom Message

To modify SOS message, edit in [sosService.js](src/services/sosService.js):

```javascript
const message = `🚨 EMERGENCY ALERT 🚨
SentinelClick Activated!
Location: https://www.google.com/maps?q=${geo.lat},${geo.lng}
Time: ${new Date().toLocaleTimeString()}`;
```

## Test Scenario

**Setup:**
- API Key: ✅ Configured
- Contact: Your phone (09631338357)
- Email: s.montecillo.jopurjayii@cmu.edu.ph

**Expected Result:**
- You receive SMS on phone
- Email also sent to s.montecillo.jopurjayii@cmu.edu.ph
- Web dashboard shows delivery status

---

**Need Help?**
- Semaphore Support: https://support.semaphore.co/
- Check your Semaphore account balance
- Verify phone number is correct
