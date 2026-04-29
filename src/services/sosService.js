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

// --- ANDROID SMS GATEWAY FUNCTION (CLOUD INTEGRATION) ---
const sendActualSMS = async (phoneNumber, messageText, addLog) => {
  try {
    const internationalNumber = formatPhoneNumber(phoneNumber);
    addLog(`[SMS] Routing to ${internationalNumber} via Default SIM (Cloud)...`);
    
    // Your exact Cloud Login and Password
    const cloudLogin = "FJKFOE"; 
    const cloudPassword = "b_shfabqdivhyi";
    
    const credentials = btoa(`${cloudLogin}:${cloudPassword}`); 
    
    // We use the Vite proxy '/capcom-cloud' to bypass the browser's CORS block
    const response = await fetch("/capcom-cloud/3rdparty/v1/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}` 
      },
      body: JSON.stringify({
        message: messageText,
        phoneNumbers: [internationalNumber]
        // Removed simNumber entirely so the phone uses its default SMS SIM
      })
    });

    if (response.ok) {
      addLog(`[SMS] ✓ Successfully pushed to phone for ${internationalNumber}`);
    } else {
      addLog(`[SMS] ❌ Cloud Gateway rejected SMS to ${internationalNumber}`);
      console.error("SMS Cloud Error Details:", await response.text());
    }
  } catch (error) {
    console.error('Android Cloud Gateway Error:', error);
    addLog(`[SMS] ❌ Network error reaching cloud gateway`);
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
    // SEQUENCE 1: SMS BLAST (Via Capcom6 Cloud Proxy)
    // ----------------------------------------------------
    if (phoneContacts.length > 0) {
      addLog(`[SMS] Initiating blast to ${phoneContacts.length} phone recipient(s)...`);
      
      for (const contact of phoneContacts) {
        await sendActualSMS(contact.phone, activeMessage, addLog);
        await delay(2000); 
      }
    } else {
      addLog('[SMS] No phone numbers found. Skipping SMS blast.');
    }

    // ----------------------------------------------------
    // SEQUENCE 1: SMS BLAST (Via Capcom6 Cloud Proxy)
    // ----------------------------------------------------
    if (phoneContacts.length > 0) {
      addLog(`[SMS] Initiating blast to ${phoneContacts.length} phone recipient(s)...`);
      
      for (const contact of phoneContacts) {
        await sendActualSMS(contact.phone, activeMessage, addLog);
        await delay(2000); 
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
            '3oxHlBVChJQp1iNra' // Reverted to the working string format
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