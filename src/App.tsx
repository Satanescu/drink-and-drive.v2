import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './theme';
import { LanguageProvider } from './context/LanguageContext';

import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { ForgotPassword } from './screens/ForgotPassword';
import { ClientHome } from './screens/ClientHome';
import { SafetyInfo } from './screens/SafetyInfo';
import { Profile } from './screens/Profile';
import { RideDetails } from './screens/RideDetails';
import { SearchingRide } from './screens/SearchingRide';
import { DriverFound } from './screens/DriverFound';
import { ActiveRide } from './screens/ActiveRide';
import { RideSummary } from './screens/RideSummary';
import { Feedback } from './screens/Feedback';
import { DriverHome } from './screens/DriverHome';
import { PaymentMethods } from './screens/PaymentMethods';
import { SavedLocations } from './screens/SavedLocations';
import { EmergencyContacts } from './screens/EmergencyContacts';
import { Notifications } from './screens/Notifications';
import { Language } from './screens/Language';
import { HelpCenter } from './screens/HelpCenter';
import { PrivacyPolicy } from './screens/PrivacyPolicy';
import { TermsAndConditions } from './screens/TermsAndConditions';
import { RoleSelection } from './screens/RoleSelection';

const AppContent: React.FC = React.memo(() => {
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
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/home" element={<ClientHome />} />
          <Route path="/driver/home" element={<DriverHome />} />
          <Route path="/safety" element={<SafetyInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ride/details" element={<RideDetails />} />
          <Route path="/ride/searching" element={<SearchingRide />} />
          <Route path="/ride/driver-found" element={<DriverFound />} />
          <Route path="/ride/active" element={<ActiveRide />} />
          <Route path="/ride/summary" element={<RideSummary />} />
          <Route path="/ride/feedback" element={<Feedback />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/saved-locations" element={<SavedLocations />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/language" element={<Language />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route
            path="*"
            element={
              user.role === 'driver' ? (
                <Navigate to="/driver/home" replace />
              ) : user.role === 'user' ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/role-selection" replace />
              )
            }
          />
        </>
      )}
    </Routes>
  );
});

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;