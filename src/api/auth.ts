import { User } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Ion Popescu',
    email: 'ion@example.com',
    phone: '+40 721 234 567',
    role: 'client',
    profilePhoto: undefined,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fullName: 'Maria Ionescu',
    email: 'maria@example.com',
    phone: '+40 722 345 678',
    role: 'driver',
    profilePhoto: undefined,
    rating: 4.9,
    createdAt: new Date('2024-02-20'),
  },
];

let currentUser: User | null = null;

export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(1000);

    const user = mockUsers.find((u) => u.email === email);
    if (!user || password.length < 6) {
      throw new Error('Email sau parolă greșită');
    }

    currentUser = user;
    const token = `mock-token-${user.id}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    await delay(1200);

    if (mockUsers.find((u) => u.email === data.email)) {
      throw new Error('Email-ul este deja folosit');
    }

    if (data.password.length < 6) {
      throw new Error('Parola trebuie să aibă minim 6 caractere');
    }

    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: 'client',
      profilePhoto: undefined,
      rating: undefined,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;

    const token = `mock-token-${newUser.id}`;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return { user: newUser, token };
  },

  async logout(): Promise<void> {
    await delay(500);
    currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);

    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }

    return null;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    await delay(1000);

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw new Error('Email-ul nu a fost găsit');
    }

    return { message: 'Am trimis instrucțiuni de resetare a parolei pe email' };
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await delay(800);

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Utilizatorul nu a fost găsit');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

    if (currentUser?.id === userId) {
      currentUser = mockUsers[userIndex];
      localStorage.setItem('user', JSON.stringify(currentUser));
    }

    return mockUsers[userIndex];
  },
};
