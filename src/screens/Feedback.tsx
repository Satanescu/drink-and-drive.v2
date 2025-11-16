import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card } from '../components';
import { CheckCircle } from 'lucide-react';

export const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const availableTags = [
    'M-am simțit în siguranță.',
    'Aș mai călători cu acest șofer.',
    'Mașina a fost curată.',
    'Șoferul a fost politicos.',
  ];

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  };

  const textareaStyles: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
    minHeight: '120px',
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.fontSize.base,
  };

  const tagsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const tagStyles = (selected: boolean): React.CSSProperties => ({
    padding: theme.spacing.md,
    backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
    border: `2px solid ${selected ? theme.colors.primary : theme.colors.border.light}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    color: selected ? theme.colors.text.primary : theme.colors.text.secondary,
    textAlign: 'left',
    fontSize: theme.typography.fontSize.base,
    transition: theme.transitions.fast,
  });

  const successContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    gap: theme.spacing.lg,
  };

  const successTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
  };

  const successMessageStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    maxWidth: '300px',
  };

  if (submitted) {
    return (
      <div style={{ ...containerStyles, ...successContainerStyles }}>
        <CheckCircle size={80} color={theme.colors.success} />
        <h1 style={successTitleStyles}>Mulțumim!</h1>
        <p style={successMessageStyles}>
          Feedback-ul tău ne ajută să facem drumurile mai sigure. Redirecționare în curs...
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Spune-ne cum a fost</h1>

      <h2 style={sectionTitleStyles}>Comentarii (opțional)</h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cum a fost experiența? Orice feedback ajută..."
        style={textareaStyles}
      />

      <h2 style={sectionTitleStyles}>Selectează experiențele tale</h2>

      <div style={tagsContainerStyles}>
        {availableTags.map((tag) => (
          <button
            key={tag}
            style={tagStyles(tags.includes(tag))}
            onClick={() => handleToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <Button
          onClick={() => navigate('/home')}
          variant="ghost"
          size="lg"
          fullWidth
        >
          Omite
        </Button>
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
        >
          Trimite feedback
        </Button>
      </div>
    </div>
  );
};
