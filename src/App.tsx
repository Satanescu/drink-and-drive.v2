import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './theme';

import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { ForgotPassword } from './screens/ForgotPassword';
import { ClientHome } from './screens/ClientHome';
import { SafetyInfo } from './screens/SafetyInfo';
import { Profile } from './screens/Profile';
import { NotFound } from './screens/NotFound';
import { RideDetails } from './screens/RideDetails';
import { SearchingRide } from './screens/SearchingRide';
import { DriverFound } from './screens/DriverFound';
import { ActiveRide } from './screens/ActiveRide';
import { RideSummary } from './screens/RideSummary';
import { Feedback } from './screens/Feedback';
import { DriverHome } from './screens/DriverHome';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.primary,
        }}
      >
        Se încarcă...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.primary,
        }}
      >
        Se încarcă...
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </>
      ) : (
        <>
          <Route path="/home" element={user?.role === 'driver' ? <DriverHome /> : <ClientHome />} />
          <Route path="/safety" element={<SafetyInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ride/details" element={<RideDetails />} />
          <Route path="/ride/searching" element={<SearchingRide />} />
          <Route path="/ride/driver-found" element={<DriverFound />} />
          <Route path="/ride/active" element={<ActiveRide />} />
          <Route path="/ride/summary" element={<RideSummary />} />
          <Route path="/ride/feedback" element={<Feedback />} />
          <Route path="/driver/home" element={<DriverHome />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
