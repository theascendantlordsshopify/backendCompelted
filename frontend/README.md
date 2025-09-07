# Calendly Clone - Enterprise Frontend

A professional, enterprise-grade scheduling platform frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Enterprise UI**: Professional design with shadcn/ui components
- **Authentication**: Email/password + SSO (SAML/OIDC) support
- **Real-time Updates**: WebSocket integration for live updates
- **Accessibility**: WCAG 2.1 AA compliant
- **Testing**: Comprehensive test suite with Playwright and Jest
- **Performance**: Optimized with React Query and code splitting

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **Testing**: Playwright (E2E) + Jest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── providers/             # React context providers
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your backend API URL and other configuration.

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:watch
```

### E2E Tests
```bash
npm run test:e2e
npm run test:e2e:ui
```

### Type Checking
```bash
npm run type-check
```

## 📚 Storybook

Run Storybook for component development:

```bash
npm run storybook
```

## 🎨 Design System

The application uses a professional enterprise theme with:

- **Colors**: Neutral base with muted indigo/teal accents
- **Typography**: Inter font family with consistent scale
- **Spacing**: 8px grid system
- **Shadows**: Subtle elevation system
- **Animations**: Smooth micro-interactions

### Theme Customization

The theme can be customized in:
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - CSS custom properties
- `src/lib/constants.ts` - Theme constants

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow the established folder structure
- Use meaningful component and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Use shadcn/ui components as base
- Implement proper accessibility attributes
- Handle loading and error states
- Use proper TypeScript types

### API Integration
- Use React Query for data fetching
- Implement proper error handling
- Use optimistic updates where appropriate
- Cache responses appropriately

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
# ... other variables
```

## 📖 API Documentation

The frontend integrates with the Django REST API. Key endpoints:

- **Authentication**: `/api/v1/users/`
- **Events**: `/api/v1/events/`
- **Availability**: `/api/v1/availability/`
- **Integrations**: `/api/v1/integrations/`
- **Workflows**: `/api/v1/workflows/`
- **Notifications**: `/api/v1/notifications/`
- **Contacts**: `/api/v1/contacts/`

## 🤝 Contributing

1. Follow the established code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 📄 License

This project is proprietary and confidential.