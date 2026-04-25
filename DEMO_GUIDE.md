# SentinelClick Demo - Quick Reference

## 🎯 What This Is

A high-fidelity 3D interactive prototype for **SentinelClick** - a personal safety device that sends real emergency alerts via SMS & Email.

## 🚀 Quick Start (2 minutes)

```bash
# Terminal 1: Start dev server
cd c:\Users\LEGION2\Yaji\prototype\sentinel-exhibit
npm run dev

# Opens at http://localhost:5173/
```

## 📱 Demo Flow

### Step 1: Open Mobile Tab
- Click **Mobile** button (top right)
- Shows realistic phone UI

### Step 2: Configure SMS (Optional)
- In Mobile app, click **CIRCLE** tab
- Click **▶ Twilio SMS Config**
- Paste your Twilio credentials (or skip for email-only)
- Click "Save Credentials"

[Get Twilio credentials in 5 minutes →](TWILIO_SETUP.md)

### Step 3: Add Contact
- Fill form in Mobile app:
  - **Name**: Your name or friend's name
  - **Phone**: 09XXXXXXXXX (for SMS)
  - **Email**: your@email.com (for email)
  - **Facebook**: (optional)
- Click **"Add Contact"**
- Contact appears in Web dashboard

### Step 4: Trigger SOS
- Click **Web** tab (optional, to see dashboard)
- Switch back to 3D view
- **Click the red SOS button** on the product
- See events log update in real-time
- Check phone for SMS & email inbox

### Step 5: Verify Delivery
- **Web Dashboard**: Event stream shows delivery status
- **Phone**: Check SMS received
- **Email**: Check inbox/spam folder

## 🎨 UI Overview

| Section | Purpose | Interaction |
|---------|---------|-------------|
| **Left Sidebar** | Product selector | Click to change model |
| **Center** | 3D interactive model | Rotate: drag, SOS: click button |
| **Right Panel** | Mobile or Web view | Toggle at top right |

### 3D Model Controls
- **Red Button**: Triggers SOS (spins/animates)
- **Green Switch**: Toggles GPS tracking (simulated)
- **Rotate**: Click + drag on model

### Mobile App
- **MAP Tab**: Shows live location
- **CIRCLE Tab**: Contact management & SMS key config

### Web Dashboard
- **Left Panel**: Contact list with delivery types
- **Center**: Real-time map
- **Right Panel**: Event log (GPS, contacts, alerts, delivery)

## 📞 Test Contacts

**Pre-loaded:**
```
Name: Default Emergency
Phone: 09631338357
Email: s.montecillo.jopurjayii@cmu.edu.ph
Type: email+sms
```

**Add Your Own:**
1. Mobile → CIRCLE tab
2. Fill form
3. Click "Add Contact"

## 🔑 API Keys & Services

### Email (FormSubmit)
- ✅ **Always works** - no key needed
- Free, no setup required
- Sends to configured email addresses

### SMS (Twilio) - Optional
- 📱 **Real SMS Worldwide**
- Requires: Twilio account + credentials
- Free: $20 trial (≈60-100 SMS)
- Setup: 5 minutes [→ Guide](TWILIO_SETUP.md)

## 🎬 Demo Script (5 minutes)

1. **Show Product Evolution** (30 sec)
   - Click each product (Keychain, Silicone, Pendant)
   - Explain sizes and target users

2. **Add Contact** (1 min)
   - Click Mobile tab
   - Go to CIRCLE tab
   - Add contact with real phone number
   - Show contact appears in Web dashboard

3. **Configure SMS** (1 min)
   - Show Twilio credentials setup (if available)
   - Input Account SID, Auth Token, Phone number
   - Explain $20 trial credits

4. **Trigger SOS** (2 min)
   - Click SOS button on 3D model
   - Watch Web dashboard update with:
     - GPS location locked
     - Contact notifications
     - Email delivery
     - SMS delivery (if key configured)
   - Show real SMS on phone / email in inbox

5. **Show Event Log** (1 min)
   - Point to real-time event stream
   - Explain each event type
   - Show full delivery history

## 💡 Key Talking Points

1. **Realistic Prototype**
   - 3D hardware visualization
   - Real product differentiation (3 models)
   - Actual GPS location (if enabled)
   - Real SMS/Email delivery

2. **Multi-Channel Alerts**
   - SMS for immediate notification
   - Email for documentation
   - Facebook ready (for future)
   - Customizable contacts

3. **Easy Configuration**
   - Add/remove contacts on-the-fly
   - No backend required
   - Everything stored locally
   - One-click SOS trigger

4. **Data Privacy**
   - All data stays in browser
   - No external storage (except SMS/Email to recipients)
   - No tracking servers
   - User owns their data

## 🎯 Where to Look for Competitors

- **Jiobit**: Advanced GPS tracking
- **Invisawear**: Fashion-forward safety devices
- **AngelSense**: Specialized for vulnerable populations
- **Life360**: Family location sharing

**SentinelClick Advantage**: Combines all into affordable Filipino-first platform

## 🔧 Troubleshooting

**SMS not sending?**
- Check API key is valid
- Verify contact has correct phone format (09XXXXXXXXX)
- Check Semaphore account balance (100 credits = ~100 SMS)

**Email not sending?**
- Check email format is valid
- Check spam folder
- FormSubmit is free, no key needed

**Map not loading?**
- Need internet connection
- Allow pop-ups/iframes in browser
- Check map loads in Mobile app MAP tab

**GPS not locking?**
- Allow browser location permission
- May be blocked if not HTTPS
- Works best on Windows with location services enabled

**Contacts not saving?**
- Refresh page and check
- Try different browser
- Clear browser cache (Ctrl+Shift+Delete)

## 📊 What's Behind the Scenes

### Architecture
- **Frontend**: React + Vite (bundled & fast)
- **3D**: Three.js via @react-three/fiber
- **Styling**: Tailwind CSS (dark, modern theme)
- **Storage**: Browser localStorage
- **APIs**: FormSubmit (email), Semaphore (SMS)

### File Structure
```
src/
├── components/          # UI components (separated)
│   ├── Models3D.jsx
│   ├── MobileSimulator.jsx
│   └── WebSimulator.jsx
├── services/            # Business logic
│   ├── sosService.js
│   └── contactService.js
└── App.jsx              # Main app (cleaner than before)
```

[Full Architecture Guide →](ARCHITECTURE.md)

## 🎓 Learning Value

This prototype demonstrates:
- ✅ Component architecture (React best practices)
- ✅ Service layer separation (clean code)
- ✅ Third-party API integration
- ✅ Real-time UI updates
- ✅ 3D visualization in web
- ✅ Local storage persistence
- ✅ Geolocation API usage
- ✅ Modern UI/UX patterns

## 📈 Future Roadmap

- [ ] Backend authentication
- [ ] Database for contact storage
- [ ] WhatsApp/Facebook integration
- [ ] Incident history & analytics
- [ ] Geofencing alerts
- [ ] Wearable device sync
- [ ] Mobile app (iOS/Android)

---

**Need More Info?**
- [Architecture Deep Dive](ARCHITECTURE.md)
- [SMS Setup Guide](SMS_SETUP.md)
- [README.md](README.md)

**Ready to Demo?** Start with "Quick Start" above! 🚀
