# Drink&Drive - Mobile-First Application

## Overview
Drink&Drive is a comprehensive mobile-first React + TypeScript application that provides safe transport solutions for people who have consumed alcohol. The app offers both standard rides and a unique service where drivers conduct customers' vehicles home.

## Key Features

### For Clients (Passengers)
- **Onboarding**: 3-step carousel explaining the service
- **Authentication**: Login, register, forgot password with mock validation
- **Home Screen**: Map view, destination selection, service type selection
- **Ride Management**: 
  - Request rides with estimated costs and durations
  - Real-time driver tracking
  - Emergency SOS button with contact management
  - Quick messaging system
  - Share location with friends
- **Ride Feedback**: Rating system and detailed feedback after each ride
- **Ride History**: Filter by service type and date range
- **Profile**: Personal info, saved addresses, emergency contacts, preferences
- **Safety Info**: Educational content about responsible transport

### For Drivers (Șoferi)
- **Driver Home**: Online/offline toggle, available ride requests
- **Statistics**: Weekly completed rides, average rating, estimated earnings
- **Ride Acceptance**: Accept or reject incoming ride requests
- **Active Ride Management**: Route tracking, completion workflow
- **Profile Management**: Vehicle info, documents, ratings

## Technology Stack
- **Frontend**: React 18 + TypeScript + React Router
- **State Management**: React Context API (Authentication)
- **Styling**: Inline styles with centralized theme system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Language**: All UI text in Romanian

## Project Structure

```
src/
├── api/
│   ├── auth.ts              # Mock authentication API
│   ├── rides.ts             # Mock rides management API
│   ├── users.ts             # Mock user data API
│   └── index.ts
├── components/
│   ├── Button.tsx           # Reusable button component
│   ├── Card.tsx             # Card container component
│   ├── Input.tsx            # Form input component
│   ├── Modal.tsx            # Modal dialog component
│   ├── BottomSheet.tsx      # Bottom sheet component
│   ├── Badge.tsx            # Badge/label component
│   ├── Map.tsx              # Placeholder map component
│   └── index.ts
├── context/
│   └── AuthContext.tsx      # Authentication state management
├── screens/
│   ├── Onboarding.tsx       # Onboarding carousel
│   ├── Login.tsx            # Login screen
│   ├── Register.tsx         # Registration screen
│   ├── ForgotPassword.tsx   # Password reset screen
│   ├── ClientHome.tsx       # Client home/main screen
│   ├── DriverHome.tsx       # Driver home screen
│   ├── SafetyInfo.tsx       # Safety information screen
│   ├── Profile.tsx          # User profile screen
│   ├── RideDetails.tsx      # Ride confirmation screen
│   ├── SearchingRide.tsx    # Ride search loading screen
│   ├── DriverFound.tsx      # Driver assigned screen
│   ├── ActiveRide.tsx       # Active ride tracking screen
│   ├── RideSummary.tsx      # Ride completion summary
│   ├── Feedback.tsx         # Ride feedback form
│   └── NotFound.tsx         # 404 error screen
├── theme/
│   └── index.ts             # Centralized theme configuration
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main app component with routing
├── main.tsx                 # React DOM entry point
└── index.css                # Global styles

```

## Color System
- **Primary**: #FF8A00 (Strong Orange)
- **Background**: #0B0B0F (Near Black)
- **Surface**: #1A1A1F (Dark Gray)
- **Success**: #2ECC71 (Green)
- **Error**: #E74C3C (Red)
- **Text Primary**: #FFFFFF (White)
- **Text Secondary**: #B3B3B3 (Light Gray)

## Key Routes

### Unauthenticated
- `/onboarding` - Welcome carousel
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

### Authenticated - Client
- `/home` - Client home with map and ride booking
- `/ride/details` - Ride details and confirmation
- `/ride/searching` - Driver search loading
- `/ride/driver-found` - Driver assigned view
- `/ride/active` - Active ride tracking with SOS
- `/ride/summary` - Ride completion summary
- `/ride/feedback` - Feedback form
- `/safety` - Safety information
- `/profile` - User profile and settings

### Authenticated - Driver
- `/home` - Driver home with available requests
- `/driver/home` - Alternative driver home route

## Mock Data
The application uses completely mocked data for:
- User authentication (email: ion@example.com, password: password123)
- Driver and ride data
- Location services
- Payment processing

All API calls simulate realistic delays (500ms-2000ms) to mimic network latency.

## Design Principles
- **Mobile-First**: Optimized for portrait smartphone viewing
- **Accessibility**: High contrast ratios, touch-friendly buttons
- **Responsive**: Grid-based layout system with flexible spacing
- **Dark Theme**: Reduces eye strain for night-time usage
- **Safety Focus**: Prominent safety features and information
- **Romanian Language**: All UI text in Romanian for local market

## Future Enhancements
1. Real database integration (Supabase)
2. Google Maps/Mapbox integration
3. Real payment processing (Stripe)
4. Push notifications
5. Analytics and logging
6. Admin dashboard
7. Advanced geolocation features
8. Social sharing features
9. Subscription management
10. Multi-language support

## Running the Application

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm typecheck

# Linting
npm run lint
```

## Notes for Development
- All styling uses inline styles with the centralized theme system
- The app is designed to be easily mockable and swappable with real APIs
- Each screen is self-contained and follows the Single Responsibility Principle
- The component library is minimalist, using only essential UI components
- Authentication state persists in localStorage for demo purposes
