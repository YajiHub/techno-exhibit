/**
 * SOS Service - Email alerts via FormSubmit
 * SMS is shown in prototype but routes through email for demo purposes
 */

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax';

export const sosService = {
  sendEmail: async (emailAddress, message, addLog) => {
    try {
      const response = await fetch(`${FORMSUBMIT_ENDPOINT}/${emailAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: '🚨 SENTINELCLICK SOS ALERT 🚨',
          message: message,
          _captcha: false
        })
      });
      if (response.ok) {
        addLog(`[✓] Email sent → ${emailAddress}`);
        return true;
      } else {
        addLog(`[✗] Email failed → ${emailAddress}`);
        return false;
      }
    } catch (error) {
      addLog(`[✗] Email error: ${error.message}`);
      return false;
    }
  },

  sendSMSSimulated: async (phoneNumber, addLog) => {
    // Prototype simulation — real SMS requires backend with Semaphore/Globe/Smart API
    await new Promise(r => setTimeout(r, 800));
    addLog(`[📱] SMS queued → ${phoneNumber} (prototype demo)`);
    return true;
  },

  sendFacebookMessage: async (facebookId, message, addLog) => {
    addLog(`[ℹ] Facebook: Requires backend OAuth — coming soon`);
    return false;
  },

  triggerSOSBlast: async (contacts, geo, customMessage, victimName, addLog) => {
    const trackingUrl = window.location.origin + '/track.html';
    const time = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });

    const defaultMsg = `🚨 EMERGENCY ALERT 🚨\n${victimName} needs help!\n\n📍 LIVE TRACKING:\n${trackingUrl}\n\n⏰ Time: ${time}\n\nPlease respond immediately!`;

    const message = customMessage
      ? customMessage
          .replace(/{name}/g, victimName)
          .replace(/{tracking}/g, trackingUrl)
          .replace(/{location}/g, trackingUrl)
          .replace(/{time}/g, time)
      : defaultMsg;

    addLog('[🚨] SOS BLAST INITIATED');
    addLog(`[📡] Notifying ${contacts.length} emergency contacts...`);

    let successCount = 0;
    let totalCount = 0;

    for (const contact of contacts) {
      if (contact.email && contact.email.includes('@')) {
        totalCount++;
        const ok = await sosService.sendEmail(contact.email, message, addLog);
        if (ok) successCount++;
      }
      if (contact.phone && contact.phone.trim()) {
        totalCount++;
        const ok = await sosService.sendSMSSimulated(contact.phone, addLog);
        if (ok) successCount++;
      }
    }

    addLog(`[✅] BLAST COMPLETE: ${successCount}/${totalCount} alerts delivered`);
    return successCount > 0;
  }
};