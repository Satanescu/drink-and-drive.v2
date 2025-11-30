import React, { useState } from 'react';
import { theme } from '../theme';
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

export const EmergencyContacts: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: 1, name: 'Mama', phone: '123-456-7890' },
    { id: 2, name: 'Tata', phone: '098-765-4321' },
  ]);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleAddContact = () => {
    if (newContactName && newContactPhone) {
      const newContact: EmergencyContact = {
        id: Date.now(),
        name: newContactName,
        phone: newContactPhone,
      };
      setContacts([...contacts, newContact]);
      setShowAddContactForm(false);
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    color: theme.colors.text.primary,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  };

  const backButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.text.primary,
    marginRight: theme.spacing.lg,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  };

  const contactItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  };

  const inputStyles: React.CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
    width: '100%',
    marginBottom: theme.spacing.lg,
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <button onClick={() => navigate('/profile')} style={backButtonStyles}>
          <ArrowLeft />
        </button>
        <h1 style={titleStyles}>{t('emergencyContacts')}</h1>
      </div>

      {contacts.map((contact) => (
        <div key={contact.id} style={contactItemStyles}>
          <div style={{ flex: 1 }}>
            <div>{contact.name}</div>
            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              {contact.phone}
            </div>
          </div>
          <a href={`tel:${contact.phone}`} style={{ color: theme.colors.primary, marginRight: theme.spacing.lg }}>
            <Phone />
          </a>
          <a href={`sms:${contact.phone}`} style={{ color: theme.colors.primary }}>
            <MessageSquare />
          </a>
        </div>
      ))}

      {showAddContactForm ? (
        <div>
          <h2 style={{ ...titleStyles, fontSize: theme.typography.fontSize.lg, marginTop: theme.spacing.xl }}>
            Adaugă Contact Nou
          </h2>
          <input
            type="text"
            placeholder="Nume"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            style={inputStyles}
          />
          <input
            type="text"
            placeholder="Număr de Telefon"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            style={inputStyles}
          />
          <Button onClick={handleAddContact} variant="primary" fullWidth>
            Adaugă Contact
          </Button>
          <Button onClick={() => setShowAddContactForm(false)} variant="ghost" fullWidth style={{ marginTop: theme.spacing.md }}>
            Anulează
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowAddContactForm(true)} variant="primary" fullWidth style={{ marginTop: theme.spacing.xl }}>
          Adaugă Contact Nou
        </Button>
      )}
    </div>
  );
};
