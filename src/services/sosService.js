/**
 * SOS Service - Handles emergency alerts via Email and SMS
 * Supports: FormSubmit (Email), Twilio API (SMS Worldwide)
 */

// FormSubmit: Free Email (no key required)
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax';

// Twilio: Global SMS service
// Sign up: https://www.twilio.com/
// You need: Account SID, Auth Token, and a Twilio phone number

export const sosService = {
  /**
   * Send emergency alert via Email
   */
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
        addLog(`[✓] Email sent to ${emailAddress}`);
        return true;
      } else {
        addLog(`[✗] Email failed to ${emailAddress}`);
        return false;
      }
    } catch (error) {
      console.error('Email Error:', error);
      addLog(`[✗] Email error: ${error.message}`);
      return false;
    }
  },

  /**
   * Send SMS via Twilio API (Worldwide)
   */
  sendSMS: async (phoneNumber, message, twilioConfig, addLog) => {
    if (!twilioConfig || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber) {
      addLog(`[⚠] SMS skipped: No Twilio credentials configured`);
      return false;
    }

    try {
      // Normalize phone number (ensure +63 format for Philippines or international format)
      let normalizedPhone = phoneNumber;
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = '+63' + normalizedPhone.slice(1);
      } else if (!normalizedPhone.startsWith('+')) {
        normalizedPhone = '+' + normalizedPhone;
      }

      // Create basic auth header for Twilio
      const authString = `${twilioConfig.accountSid}:${twilioConfig.authToken}`;
      const encodedAuth = btoa(authString);

      const formData = new URLSearchParams();
      formData.append('To', normalizedPhone);
      formData.append('From', twilioConfig.fromNumber);
      formData.append('Body', message);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.sid) {
        addLog(`[✓] SMS sent to ${normalizedPhone}`);
        return true;
      } else {
        const errorMsg = result.message || result.error_message || 'Unknown error';
        addLog(`[✗] SMS failed to ${normalizedPhone}: ${errorMsg}`);
        return false;
      }
    } catch (error) {
      console.error('SMS Error:', error);
      addLog(`[✗] SMS error: ${error.message}`);
      return false;
    }
  },

  /**
   * Send Facebook Messenger (placeholder - requires backend)
   */
  sendFacebookMessage: async (facebookId, message, addLog) => {
    addLog(`[ℹ] Facebook: Feature requires backend OAuth integration`);
    return false;
  },

  /**
   * Trigger full SOS blast to all contacts
   */
  triggerSOSBlast: async (contacts, geo, twilioConfig, addLog) => {
    const message = `🚨 EMERGENCY ALERT 🚨\nSentinelClick Activated!\nLocation: https://www.google.com/maps?q=${geo.lat},${geo.lng}\nTime: ${new Date().toLocaleTimeString()}`;

    addLog('[ALERT]: SOS BLAST INITIATED');
    addLog(`[INFO]: Notifying ${contacts.length} emergency contacts...`);

    let successCount = 0;
    let totalCount = 0;

    for (const contact of contacts) {
      // Send Email
      if (contact.email && contact.email.includes('@')) {
        totalCount++;
        const emailSuccess = await sosService.sendEmail(contact.email, message, addLog);
        if (emailSuccess) successCount++;
      }

      // Send SMS
      if (contact.phone && !contact.phone.includes('X')) {
        totalCount++;
        const smsSuccess = await sosService.sendSMS(contact.phone, message, twilioConfig, addLog);
        if (smsSuccess) successCount++;
      }

      // Send Facebook (future)
      if (contact.facebook) {
        totalCount++;
        const fbSuccess = await sosService.sendFacebookMessage(contact.facebook, message, addLog);
        if (fbSuccess) successCount++;
      }
    }

    addLog(`[SUMMARY]: ${successCount}/${totalCount} messages delivered`);
    return successCount > 0;
  }
};
