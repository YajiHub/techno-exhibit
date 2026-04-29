import emailjs from '@emailjs/browser';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to convert local PH numbers (09...) to International (+639...)
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/[^0-9+]/g, ''); // Strip dashes or spaces
  if (cleaned.startsWith('09')) {
    return '+63' + cleaned.substring(1);
  }
  return cleaned;
};

// --- TEXTBEE SMS GATEWAY FUNCTION ---
const sendActualSMS = async (phoneNumber, messageText, addLog) => {
  try {
    const internationalNumber = formatPhoneNumber(phoneNumber);
    addLog(`[SMS] Routing to ${internationalNumber} via TextBee...`);
    
    const API_KEY = "02523ced-55f2-4861-867d-7239be353976";
    const DEVICE_ID = "69f18004b5cd3ce4c7957231"; 

    // TextBee requires the body to use 'receivers' (array) and 'smsBody'
    const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({
        receivers: [internationalNumber],
        smsBody: messageText,
      })
    });

    if (response.ok) {
      addLog(`[SMS] ✓ Queued in TextBee for ${internationalNumber}`);
    } else {
      const errorData = await response.json();
      addLog(`[SMS] ❌ TextBee Error: ${errorData.message || 'Check Device ID/API Key'}`);
    }
  } catch (error) {
    console.error('TextBee Network Error:', error);
    addLog(`[SMS] ❌ Network error reaching TextBee API`);
  }
};

export const sosService = {
  triggerSOSBlast: async (contacts, geo, customMessage, victimName, addLog) => {
    addLog('[KERNEL] Processing SOS blast...');

    const trackingUrl = window.location.origin + '/track.html';
    const time = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
    
    const defaultMessage = `🚨 EMERGENCY ALERT 🚨\n${victimName} needs help!\n\n📍 LIVE TRACKING:\n${trackingUrl}\n\nPlease respond immediately!`;
    
    const activeMessage = customMessage 
      ? customMessage
          .replace(/{name}/g, victimName || 'The device owner')
          .replace(/{location}/g, trackingUrl)
          .replace(/{tracking}/g, trackingUrl)
          .replace(/{time}/g, time)
      : defaultMessage;

    const phoneContacts = contacts.filter(c => c.phone && c.phone.trim() !== '');
    const emailContacts = contacts.filter(c => c.email && c.email.trim() !== '');

    if (phoneContacts.length === 0 && emailContacts.length === 0) {
      addLog('[ALERT] No valid contacts found. Skipping blast.');
      return;
    }

    // ----------------------------------------------------
    // SEQUENCE 1: SMS BLAST (Via TextBee)
    // ----------------------------------------------------
    if (phoneContacts.length > 0) {
      addLog(`[SMS] Initiating blast to ${phoneContacts.length} phone recipient(s)...`);
      
      for (const contact of phoneContacts) {
        await sendActualSMS(contact.phone, activeMessage, addLog);
        await delay(200); 
      }
    } else {
      addLog('[SMS] No phone numbers found. Skipping SMS blast.');
    }

    // ----------------------------------------------------
    // SEQUENCE 2: EMAIL BLAST (Via EmailJS)
    // ----------------------------------------------------
    if (emailContacts.length > 0) {
      addLog(`[EMAIL] Initiating blast to ${emailContacts.length} email recipient(s)...`);
      
      for (const contact of emailContacts) {
        try {
          addLog(`[EMAIL] Routing to ${contact.email}...`);
          
          await emailjs.send(
            'service_8te2gbi',       
            'template_f49740g',      
            {
              to_name: contact.name,
              to_email: contact.email,
              victim_name: victimName || 'SentinelClick User',
              message: activeMessage,
              latitude: geo.lat.toFixed(5),
              longitude: geo.lng.toFixed(5),
              time: time
            },
            '3oxHlBVChJQp1iNra' // Public Key as string (Working format)
          );
          
          addLog(`[EMAIL] ✓ Successfully delivered to ${contact.email}`);
          await delay(1500); 

        } catch (error) {
          console.error('EmailJS Error for', contact.email, error);
          addLog(`[EMAIL] ❌ Failed to deliver to ${contact.email}`);
        }
      }
    } else {
      addLog('[EMAIL] No email addresses found. Skipping email blast.');
    }

    addLog('[KERNEL] SOS blast sequence completed.');
  }
};