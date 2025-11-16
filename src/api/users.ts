import { SavedAddress, EmergencyContact, UserPreferences } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockAddresses: SavedAddress[] = [
  {
    id: 'a1',
    userId: '1',
    label: 'Acasă',
    location: { lat: 44.4268, lng: 26.1025, address: 'Str. Primăverii 12, București' },
  },
  {
    id: 'a2',
    userId: '1',
    label: 'Serviciu',
    location: { lat: 44.4368, lng: 26.0925, address: 'Bd. Magheru 25, București' },
  },
];

let mockEmergencyContacts: EmergencyContact[] = [
  {
    id: 'ec1',
    userId: '1',
    name: 'Ana Popescu',
    phone: '+40 721 999 888',
  },
];

let mockPreferences: Record<string, UserPreferences> = {
  '1': {
    userId: '1',
    language: 'ro',
    notifications: {
      reminders: true,
      promotions: true,
      locationReminders: false,
    },
  },
};

export const usersAPI = {
  async getSavedAddresses(userId: string): Promise<SavedAddress[]> {
    await delay(500);
    return mockAddresses.filter((a) => a.userId === userId);
  },

  async addSavedAddress(data: {
    userId: string;
    label: string;
    location: { lat: number; lng: number; address?: string };
  }): Promise<SavedAddress> {
    await delay(600);

    const newAddress: SavedAddress = {
      id: `a${mockAddresses.length + 1}`,
      ...data,
    };

    mockAddresses.push(newAddress);
    return newAddress;
  },

  async updateSavedAddress(addressId: string, updates: Partial<SavedAddress>): Promise<SavedAddress> {
    await delay(500);

    const index = mockAddresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      throw new Error('Adresa nu a fost găsită');
    }

    mockAddresses[index] = { ...mockAddresses[index], ...updates };
    return mockAddresses[index];
  },

  async deleteSavedAddress(addressId: string): Promise<void> {
    await delay(500);

    const index = mockAddresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      throw new Error('Adresa nu a fost găsită');
    }

    mockAddresses.splice(index, 1);
  },

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    await delay(500);
    return mockEmergencyContacts.filter((c) => c.userId === userId);
  },

  async addEmergencyContact(data: {
    userId: string;
    name: string;
    phone: string;
  }): Promise<EmergencyContact> {
    await delay(600);

    const newContact: EmergencyContact = {
      id: `ec${mockEmergencyContacts.length + 1}`,
      ...data,
    };

    mockEmergencyContacts.push(newContact);
    return newContact;
  },

  async updateEmergencyContact(
    contactId: string,
    updates: Partial<EmergencyContact>
  ): Promise<EmergencyContact> {
    await delay(500);

    const index = mockEmergencyContacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      throw new Error('Contactul nu a fost găsit');
    }

    mockEmergencyContacts[index] = { ...mockEmergencyContacts[index], ...updates };
    return mockEmergencyContacts[index];
  },

  async deleteEmergencyContact(contactId: string): Promise<void> {
    await delay(500);

    const index = mockEmergencyContacts.findIndex((c) => c.id === contactId);
    if (index === -1) {
      throw new Error('Contactul nu a fost găsit');
    }

    mockEmergencyContacts.splice(index, 1);
  },

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    await delay(400);

    if (!mockPreferences[userId]) {
      mockPreferences[userId] = {
        userId,
        language: 'ro',
        notifications: {
          reminders: true,
          promotions: true,
          locationReminders: false,
        },
      };
    }

    return mockPreferences[userId];
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    await delay(500);

    if (!mockPreferences[userId]) {
      mockPreferences[userId] = {
        userId,
        language: 'ro',
        notifications: {
          reminders: true,
          promotions: true,
          locationReminders: false,
        },
      };
    }

    mockPreferences[userId] = { ...mockPreferences[userId], ...updates };
    return mockPreferences[userId];
  },
};
