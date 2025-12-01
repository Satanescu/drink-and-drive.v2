import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { theme } from './theme';
import { LanguageProvider } from './context/LanguageContext';

import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { ForgotPassword } from './screens/ForgotPassword';
import { ClientHomeWrapper } from './screens/ClientHomeWrapper';
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
import { DriverTypeSelection } from './screens/DriverTypeSelection';
import { CarRegistration } from './screens/CarRegistration';
import { ScooterRegistration } from './screens/ScooterRegistration';
import { DriverMap } from './screens/DriverMap';
import { VehicleSelection } from './screens/VehicleSelection';

const AppContent: React.FC = () => {
  const { user, activeVehicle, loading, activeRole } = useAuth();

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
        // Public routes for logged-out users
        <>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </>
      ) : activeRole ? (
        // Private routes for users with an active role
        <>
          <Route path="/home" element={<ClientHomeWrapper />} />
          <Route path="/driver/map" element={<DriverMap />} />
          <Route path="/driver/onboarding/type-selection" element={<DriverTypeSelection />} />
          <Route path="/driver/onboarding/car-registration" element={<CarRegistration />} />
          <Route path="/driver/onboarding/scooter-registration" element={<ScooterRegistration />} />
          <Route path="/driver/vehicles" element={<VehicleSelection />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Restored Routes */}
          <Route path="/safety" element={<SafetyInfo />} />
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
          <Route path="/driver/home" element={<DriverHome />} />

          <Route
            path="*"
            element={
              activeRole === 'driver' ? (
                // Always go to type-selection first for a driver
                <Navigate to="/driver/onboarding/type-selection" replace />
              ) : ( // activeRole === 'client'
                <Navigate to="/home" replace />
              )
            }
          />
        </>
      ) : (
        // Routes for logged-in users who need to choose a role
        <>
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="*" element={<Navigate to="/role-selection" replace />} />
        </>
      )}
    </Routes>
  );
};

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