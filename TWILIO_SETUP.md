# SMS Setup Guide - Twilio

## Why Twilio?

Twilio is the industry standard for SMS:
- ✅ Works globally (Philippines, USA, etc.)
- ✅ Simple REST API
- ✅ Easy setup with free trial
- ✅ Reliable delivery
- ✅ All major telcos supported

## Your Twilio Credentials

You already have these! Just need to find them:
- **Account SID**: ACf16a71989d330f002fb27d5d2803d232
- **Auth Token**: e6e6c76fc3e860f852fa043855d3eb17
- **Twilio Phone**: (Need to get from console)

## Step-by-Step Setup

### 1. Find Your Twilio Phone Number

- Go to https://console.twilio.com/
- Login with your account
- Go to **Phone Numbers** → **Active Numbers**
- Copy your Twilio phone number (looks like: +1234567890)

### 2. Add to SentinelClick

**In the Prototype:**
1. Open SentinelClick in browser (http://localhost:5173/)
2. Click **Mobile** tab
3. Go to **CIRCLE** tab
4. Click **▶ Twilio SMS Config**
5. Fill in your credentials:
   - **Account SID**: `ACf16a71989d330f002fb27d5d2803d232`
   - **Auth Token**: `e6e6c76fc3e860f852fa043855d3eb17`
   - **Twilio Phone**: `+1234567890` (from step 1)
6. Click **Save Credentials**

### 3. Test SMS Sending

**Method 1: Direct Test**
- Add a contact with your phone number (09631338357)
- Click SOS button on 3D model
- Check your phone! 📱

**Method 2: Check Twilio Console**
- Log in to https://console.twilio.com/
- Go to **Logs** → **Messages**
- See all SMS sent from the app

## Phone Number Formats

Twilio accepts:
- ✅ `+639631338357` (international format, preferred)
- ✅ `09631338357` (local format, auto-converts)
- ✅ `639631338357` (without +)

## Message Limits

- Each SMS up to 160 characters (including emoji)
- Longer messages auto-split
- SentinelClick message ≈ 90-120 characters

## Twilio Trial Account

**Free $20 trial credit**
- Enough for ~60-100 SMS
- Test before upgrade

**Upgrade Info:**
- Pay-as-you-go: ~$0.0075 per SMS (Philippines)
- Volume discounts available
- No monthly fee

## Troubleshooting

### "Auth Failed"
- Double-check Account SID and Auth Token (no spaces)
- Verify they match your Twilio console

### "Invalid phone number"
- Ensure phone format is correct
- International: +639XXXXXXXXX
- Test number first

### SMS not received
- Verify Twilio phone number is correct
- Check recipient has SMS enabled
- Check Twilio balance (trial account)

### SMS delayed
- Philippines carriers may add 1-5 sec delay
- Twilio typically sends within 1 second
- Check Twilio logs for delivery status

## Advanced: Custom Twilio Phone

Want a different number?

1. In Twilio Console: **Phone Numbers** → **Buy New Number**
2. Select country (Philippines if available)
3. Choose number
4. Update SentinelClick with new number

## Compare with Alternatives

| Service | Setup | Cost | Notes |
|---------|-------|------|-------|
| **Twilio** | 5 min | $0.0075/SMS | Industry standard ⭐ |
| **Semaphore** | 2 min | $0.50-1/SMS | PH-only |
| **AWS SNS** | 10 min | $0.50/SMS | Enterprise |
| **Vonage** | 5 min | Similar | Enterprise-grade |

## Test Scenario

**Setup:**
- Account SID: ✅ Your SID
- Auth Token: ✅ Your token
- Twilio Phone: ✅ Your Twilio number
- Contact: Your phone (09631338357)

**Expected Result:**
- You receive SMS on phone
- Email also sent automatically
- Web dashboard shows delivery status
- Twilio console logs the message

---

**Need Help?**
- Twilio Support: https://support.twilio.com/
- Twilio Docs: https://www.twilio.com/docs/sms
- Check your account balance in console
