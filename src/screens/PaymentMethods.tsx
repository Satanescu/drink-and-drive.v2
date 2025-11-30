import React, { useState } from 'react';
import { theme } from '../theme';
import { ArrowLeft, CreditCard, MoreVertical, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { useLanguage } from '../context/LanguageContext';

interface Card {
  id: number;
  last4: string;
  cardholderName: string;
  expiryDate: string;
}

export const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [cards, setCards] = useState<Card[]>([
    { id: 1, last4: '1234', cardholderName: 'John Doe', expiryDate: '12/25' },
    { id: 2, last4: '5678', cardholderName: 'John Doe', expiryDate: '06/26' },
  ]);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const handleAddCard = () => {
    if (cardholderName && cardNumber && expiryDate && cvc) {
      const newCard: Card = {
        id: Date.now(),
        last4: cardNumber.slice(-4),
        cardholderName,
        expiryDate,
      };
      setCards([...cards, newCard]);
      setShowAddCardForm(false);
      setCardholderName('');
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
    }
  };

  const handleDeleteCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
    setShowMenu(null);
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

  const cardItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    position: 'relative',
  };

  const menuStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50px',
    right: '10px',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    zIndex: 10,
  };

  const menuItemStyles: React.CSSProperties = {
    padding: theme.spacing.md,
    cursor: 'pointer',
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
        <h1 style={titleStyles}>{t('paymentMethods')}</h1>
      </div>

      {cards.map((card) => (
        <div key={card.id} style={cardItemStyles}>
          <CreditCard size={24} style={{ marginRight: theme.spacing.lg }} />
          <div style={{ flex: 1 }}>
            <div>**** **** **** {card.last4}</div>
            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
              {card.cardholderName} - {card.expiryDate}
            </div>
          </div>
          <button onClick={() => setShowMenu(showMenu === card.id ? null : card.id)} style={{ background: 'none', border: 'none', color: theme.colors.text.primary }}>
            <MoreVertical />
          </button>
          {showMenu === card.id && (
            <div style={menuStyles}>
              <div style={menuItemStyles} onClick={() => handleDeleteCard(card.id)}>
                <Trash2 size={16} style={{ marginRight: theme.spacing.sm }} />
                Șterge
              </div>
            </div>
          )}
        </div>
      ))}

      {showAddCardForm ? (
        <div>
          <h2 style={{ ...titleStyles, fontSize: theme.typography.fontSize.lg, marginTop: theme.spacing.xl }}>
            Adaugă Card Nou
          </h2>
          <input
            type="text"
            placeholder="Nume Deținător Card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            style={inputStyles}
          />
          <input
            type="text"
            placeholder="Număr Card"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            style={inputStyles}
          />
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <input
              type="text"
              placeholder="Data Expirării (MM/AA)"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={{ ...inputStyles, flex: 1 }}
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              style={{ ...inputStyles, flex: 1 }}
            />
          </div>
          <Button onClick={handleAddCard} variant="primary" fullWidth>
            Adaugă Card
          </Button>
          <Button onClick={() => setShowAddCardForm(false)} variant="ghost" fullWidth style={{ marginTop: theme.spacing.md }}>
            Anulează
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowAddCardForm(true)} variant="primary" fullWidth style={{ marginTop: theme.spacing.xl }}>
          Adaugă Card Nou
        </Button>
      )}
    </div>
  );
};