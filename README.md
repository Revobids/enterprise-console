# RevoBricks Enterprise Console

A secure admin console for RevoBricks enterprise operations with Firebase phone authentication.

## Features

- **Firebase Phone Authentication**: Secure OTP-based login using Firebase Auth
- **Redux State Management**: Centralized state management with Redux Toolkit
- **Modern UI Components**: Built with shadcn/ui and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-friendly interface

## Project Structures

```
src/
├── api/                   # API management and services
│   ├── ApiManager.ts      # High-level API methods
│   ├── ApiMethods.ts      # Low-level HTTP methods
│   └── endpoints.ts       # API endpoint definitions
├── components/
│   ├── auth/             # Authentication components
│   │   ├── AdminLoginCard.tsx
│   │   └── AdminPhoneAuthForm.tsx
│   ├── providers/        # Context providers
│   │   ├── AdminAuthProvider.tsx
│   │   └── ReduxProvider.tsx
│   └── ui/               # shadcn/ui components
├── config/
│   └── firebase.config.ts # Firebase configuration
├── hooks/
│   └── useAdminAuth.ts   # Admin authentication hook
├── lib/
│   └── utils.ts          # Utility functions
├── redux/
│   ├── slices/
│   │   └── adminAuthSlice.ts # Admin auth Redux slice
│   ├── hooks.ts          # Redux hooks
│   └── store.ts          # Redux store configuration
├── types/
│   └── api.ts            # TypeScript type definitions
└── app/                  # Next.js app directory
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with phone authentication enabled

### Installation

1. Clone the repository and navigate to the enterprise-console directory

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/
```

4. Update Firebase configuration in `src/config/firebase.config.ts` if needed

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Authentication Flow

1. **Phone Number Entry**: Admin enters their registered phone number
2. **OTP Verification**: Firebase sends OTP via SMS
3. **Backend Authentication**: OTP is verified and JWT token is issued
4. **Session Management**: Admin session is maintained with secure cookies

## API Integration

The console integrates with your backend API for:

- Admin authentication (`/admin/auth/authenticate`)
- Profile management (`/admin/auth/profile`)
- Session management (`/admin/auth/sessions`)
- Activity logging (`/admin/auth/activity-logs`)

## Security Features

- Firebase phone authentication with reCAPTCHA
- JWT token-based session management
- Secure cookie storage
- Role-based access control
- Activity logging
- Session timeout handling

## Admin Roles

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Standard admin access
- **MANAGER**: Limited management access

## Technologies Used

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Language**: TypeScript
- **Build Tool**: Next.js with Turbopack

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `RevoBricks Enterprise Console` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

## License

© 2024 RevoBricks. All rights reserved.
