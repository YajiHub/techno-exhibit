# SentinelClick Prototype v7 - Enhanced Architecture Guide

## 📋 New Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Models3D.jsx     # 3D hardware models (Keychain, Silicone, Pendant)
│   ├── MobileSimulator.jsx  # Mobile app UI with contact management
│   └── WebSimulator.jsx     # Web dashboard with event streaming
├── services/            # Business logic & API integrations
│   ├── sosService.js    # Emergency alert logic (Email + SMS)
│   └── contactService.js    # Contact management (CRUD)
├── App.jsx              # Main app orchestrator (cleaner)
├── main.jsx             # Entry point
├── App.css              # Global styles
├── index.css            # Base styles
└── assets/              # Images, icons, etc.
```

## 🎯 Key Features

### 1. **Real Email Alerts via FormSubmit**
- Free service (no API key required)
- Sends emails to configured contacts
- Works immediately, no setup needed

### 2. **Real SMS Alerts via Twilio** (Global)
- **Setup Required**: 
  1. Visit: https://console.twilio.com/
  2. Sign in (or create free account with $20 trial)
  3. Get Account SID, Auth Token, and Twilio Phone Number
  4. Input credentials in Mobile app > Twilio SMS Config section
  
- Sends SMS globally (works everywhere)
- Free $20 trial (≈60-100 SMS)
- Pay-as-you-go after: ~$0.0075/SMS

### 3. **Contact Management**
Configure contacts with:
- **Name**: Contact person/organization
- **Phone**: For SMS alerts (optional)
- **Email**: For email alerts (optional)
- **Facebook**: For future social media integration (optional)

Contact type automatically determined:
- `email` - Email only
- `sms` - SMS only
- `email+sms` - Both
- `email+sms+facebook` - All three (when implemented)

### 4. **Live GPS Tracking**
- Captures real laptop/device GPS coordinates
- Displays location on embedded OpenStreetMap
- Includes map link in SOS messages

### 5. **Event Logging**
- Real-time event stream in web dashboard
- Shows: GPS locks, contact additions, SOS blasts, API responses
- Capped at 50 most recent events

## 🚀 How to Use the Prototype

### Demo Users
**Pre-configured contact:**
- **Name**: Default Emergency
- **Phone**: 09631338357 (Test number)
- **Email**: s.montecillo.jopurjayii@cmu.edu.ph

### Quick Start

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173/

2. **Configure SMS (Optional)**
   - Click **Mobile** tab
   - Click **▶ SMS API Key (Optional)**
   - Paste Semaphore API key
   - Click "Save API Key"

3. **Add Contacts**
   - In Mobile app, go to **CIRCLE** tab
   - Fill in contact details
   - Click "Add Contact"
   - Contact appears in pipeline targets (Web tab)

4. **Trigger SOS**
   - Click red SOS button on 3D product model
   - Watch event log for real-time delivery status
   - Messages sent to all configured contacts

5. **Delete Contacts**
   - Web Dashboard: Hover over contact name, click DELETE
   - Or remove from Mobile app (delete button)

## 🛠️ Service Layer Architecture

### sosService.js
```javascript
// Email
sosService.sendEmail(email, message, logFn)

// SMS
sosService.sendSMS(phone, message, twilioConfig, logFn)
// twilioConfig = { accountSid, authToken, fromNumber }

// Facebook (placeholder)
sosService.sendFacebookMessage(fbId, message, logFn)

// Full blast
sosService.triggerSOSBlast(contacts, geo, twilioConfig, logFn)
```

### contactService.js
```javascript
// CRUD operations
contactService.loadContacts()      // From localStorage
contactService.saveContacts(data)  // To localStorage
contactService.addContact(data)
contactService.deleteContact(id)
contactService.updateContact(id, data)
```

## 📊 Data Flow

```
User clicks SOS button
    ↓
App calls triggerSOS()
    ↓
sosService.triggerSOSBlast() iterates contacts
    ↓
For each contact:
  - If has email: sendEmail() via FormSubmit
  - If has phone: sendSMS() via Semaphore
  - If has facebook: sendFacebookMessage() (future)
    ↓
Results logged in event stream
    ↓
Web dashboard updates with delivery status
```

## 💾 Storage

- **Contacts**: `localStorage['sentinel_contacts']` (JSON array)
- **Twilio Config**: `localStorage['twilio_config']` (JSON object with SID, token, phone)

Both auto-sync on changes.

## 🔗 Third-Party APIs

| Service | Purpose | Cost | Setup |
|---------|---------|------|-------|
| **FormSubmit** | Email | Free | None (no key) |
| **Twilio** | SMS (Global) | Free trial, then $0.0075/SMS | 5 min + credentials |
| **OpenStreetMap** | Maps | Free | None |
| **Google Maps** | Location links | Free | None |

## 🎨 UI Breakdown

### Left Sidebar
- Product selector (3 models)
- Quick guide
- Brand info

### Center (3D Viewer)
- Interactive 3D models
- Rotate: click + drag
- Click red button: trigger SOS
- Toggle green switch: enable GPS tracking
- Bottom info: product price & GPS status

### Right Panel (Software)

**Mobile View:**
- Top: SOS status
- Center: Map or Contacts list
- Add contact form with SMS key config
- Bottom tabs: MAP / CIRCLE

**Web View:**
- Left: Contact pipeline targets
- Center: Live map
- Right: Event stream log

## 🔒 Security Notes

⚠️ **Frontend-only implementation** - Not production-ready for sensitive data:
- API keys stored in localStorage (visible to browser DevTools)
- FormSubmit/Semaphore endpoints exposed in frontend code
- For production: use secure backend proxy

**For this prototype**: Acceptable for demo purposes.

## 📝 Future Enhancements

- [ ] Backend API for secure credential storage
- [ ] Facebook Messenger integration
- [ ] WhatsApp integration
- [ ] Database instead of localStorage
- [ ] User authentication
- [ ] Contact groups/permissions
- [ ] SOS message templates
- [ ] Battery/signal status
- [ ] Geofencing alerts
- [ ] Incident history

## 🐛 Troubleshooting

**SMS not sending?**
- Check API key is valid (no spaces)
- Verify Semaphore account has credits
- Ensure phone number format is correct (+63 or 09)

**Email not sending?**
- Check email format is valid
- Verify FormSubmit endpoint working

**GPS not locking?**
- Allow browser location permission
- Check if using HTTPS (some browsers require it)

**Contacts not saving?**
- Check browser allows localStorage
- Clear browser cache and reload

## 📞 Support

For Semaphore issues: support@semaphore.co  
For FormSubmit issues: https://formsubmit.co/

---

**Version**: 7.0 (Refactored)  
**Last Updated**: April 25, 2026  
**Built with**: React, Vite, Three.js, Tailwind CSS
