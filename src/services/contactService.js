/**
 * Contact Service - Manages emergency contacts
 */

export const contactService = {
  /**
   * Load contacts from localStorage
   */
  loadContacts: () => {
    const saved = localStorage.getItem('sentinel_contacts');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default contacts for demo
    return [
      {
        id: 1,
        name: 'Default Emergency',
        phone: '09631338357',
        email: 's.montecillo.jopurjayii@cmu.edu.ph',
        facebook: '',
        type: 'email+sms'
      }
    ];
  },

  /**
   * Save contacts to localStorage
   */
  saveContacts: (contacts) => {
    localStorage.setItem('sentinel_contacts', JSON.stringify(contacts));
  },

  /**
   * Add new contact
   */
  addContact: (contact) => {
    const contacts = contactService.loadContacts();
    const newContact = {
      id: Date.now(),
      ...contact,
      type: determinateContactType(contact)
    };
    contacts.push(newContact);
    contactService.saveContacts(contacts);
    return newContact;
  },

  /**
   * Delete contact
   */
  deleteContact: (contactId) => {
    const contacts = contactService.loadContacts();
    const filtered = contacts.filter(c => c.id !== contactId);
    contactService.saveContacts(filtered);
  },

  /**
   * Update contact
   */
  updateContact: (contactId, updatedContact) => {
    const contacts = contactService.loadContacts();
    const index = contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...updatedContact,
        type: determinateContactType(updatedContact)
      };
      contactService.saveContacts(contacts);
      return contacts[index];
    }
  }
};

/**
 * Determine contact notification types
 */
function determinateContactType(contact) {
  const types = [];
  if (contact.email && contact.email.includes('@')) types.push('email');
  if (contact.phone && !contact.phone.includes('X')) types.push('sms');
  if (contact.facebook) types.push('facebook');
  return types.join('+');
}
