import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { Button, Card, Input } from '../components';
import { ridesAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Ride, Driver } from '../types';
import { Star } from 'lucide-react';

interface RideSummaryState {
  ride: Ride;
  driver: Driver;
}

export const RideSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as RideSummaryState;

  const ride = state?.ride;
  const driver = state?.driver;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRating = async () => {
    if (!user || !ride || !driver) return;

    try {
      await ridesAPI.submitRating({
        rideId: ride.id,
        fromUserId: user.id,
        toUserId: driver.id,
        driverRating: rating,
        comfort: 0,
        cleanliness: 0,
        punctuality: 0,
        comment: comment,
        tags: [],
      });
      navigate('/home');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.primary,
    padding: theme.spacing.xl,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  };

  const starContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  };

  return (
    <div style={containerStyles}>
      <h1 style={titleStyles}>Rate Your Ride</h1>
      <Card>
        <div style={starContainerStyles}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={48}
              color={star <= rating ? theme.colors.primary : theme.colors.text.secondary}
              onClick={() => setRating(star)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        <Input
          type="text"
          placeholder="Leave a comment..."
          value={comment}
          onChange={setComment}
          className="mb-4"
        />
        <Button onClick={handleRating} variant="primary" size="lg" fullWidth>
          Submit Rating
        </Button>
      </Card>
    </div>
  );
};