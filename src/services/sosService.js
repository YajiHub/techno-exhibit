import emailjs from '@emailjs/browser';

export const sosService = {
  triggerSOSBlast: async (contacts, geo, customMessage, victimName, addLog) => {
    addLog('[KERNEL] Processing SOS blast...');

    // 1. Prepare the tracking link and time
    const trackingUrl = window.location.origin + '/track.html';
    const time = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
    
    const defaultMessage = `🚨 EMERGENCY ALERT 🚨\n${victimName} needs help!\n\n📍 LIVE TRACKING:\n${trackingUrl}\n\nPlease respond immediately!`;
    
    // Replace custom variables if the user provided a custom message in the Mobile Simulator
    const activeMessage = customMessage 
      ? customMessage
          .replace(/{name}/g, victimName || 'The device owner')
          .replace(/{location}/g, trackingUrl)
          .replace(/{tracking}/g, trackingUrl)
          .replace(/{time}/g, time)
      : defaultMessage;

    // 2. Filter contacts that actually have an email address
    const emailContacts = contacts.filter(c => c.email && c.email.trim() !== '');

    if (emailContacts.length === 0) {
      addLog('[EMAIL] No email contacts found. Skipping email blast.');
      return;
    }

    addLog(`[EMAIL] Initiating blast to ${emailContacts.length} recipient(s)...`);

    // 3. Send emails concurrently using EmailJS
    const emailPromises = emailContacts.map(async (contact) => {
      try {
        addLog(`[EMAIL] Routing to ${contact.email}...`);
        
        // EmailJS Send Function
        await emailjs.send(
          'service_8te2gbi',       // Your Service ID
          'template_55t7i1c',      // Your Template ID
          {
            to_name: contact.name,
            to_email: contact.email,
            victim_name: victimName || 'SentinelClick User',
            message: activeMessage,
            latitude: geo.lat.toFixed(5),
            longitude: geo.lng.toFixed(5),
            time: time
          },
          '3oxHlBVChJQp1iNra'      // Your Public Key
        );
        
        addLog(`[EMAIL] ✓ Successfully delivered to ${contact.email}`);
      } catch (error) {
        console.error('EmailJS Error for', contact.email, error);
        addLog(`[EMAIL] ❌ Failed to deliver to ${contact.email}`);
      }
    });

    // Wait for all emails to finish sending
    await Promise.all(emailPromises);
    addLog('[KERNEL] SOS blast sequence completed.');
  }
};