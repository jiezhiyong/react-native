# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application called ChatQA that supports iOS, Android, and Web platforms. The app uses a modern stack with TypeScript, NativeWind (Tailwind CSS), React Navigation, and extensive Expo SDK integration.

## Core Development Commands

### Development
```bash
# Start development server
pnpm start:dev          # Development variant with APP_VARIANT=development
pnpm start:test         # Test variant without dev features
pnpm start:prod         # Production build with minification

# Run on specific platforms
pnpm run:android        # Android device/emulator
pnpm run:ios:simulator  # iOS Simulator
pnpm run:ios:device     # iOS physical device
```

### Building
```bash
# Generate native code
pnpm prebuild:dev       # Development build
pnpm prebuild:test      # Test build
pnpm prebuild          # Production build

# Build debug versions
pnpm build:android:debug  # Android debug APK
pnpm build:ios:debug      # iOS debug archive
```

### Testing & Quality
```bash
pnpm test              # Jest tests with watch mode
pnpm lint              # ESLint
pnpm typecheck         # TypeScript checking
pnpm format            # ESLint + Prettier formatting
```

### Analysis
```bash
# Bundle analysis
pnpm analyze:web       # Web bundle analysis
pnpm analyze:ios       # iOS bundle analysis
pnpm analyze:android   # Android bundle analysis
```

## Architecture Overview

### App Structure
- **File-based routing**: Uses Expo Router with TypeScript support in `/app` directory
- **Multi-variant support**: Development, Test, and Production app variants with different bundle IDs
- **Comprehensive navigation**: Tab navigation, drawer navigation, and stack navigation
- **State management**: Zustand stores with persistence via secure storage

### Key Directories
- `/app` - File-based routing (tabs, protected routes, discovery features)
- `/components` - UI components including react-native-reusables (shadcn/ui)
- `/lib` - Utilities, constants, and helper functions
- `/store` - Zustand state management (auth, scroll, scan-history)
- `/hooks` - Custom React hooks
- `/assets` - Images, fonts, and static assets

### Core Technologies
- **React Native 0.76** with New Architecture enabled
- **Expo SDK 52** with extensive plugin ecosystem
- **NativeWind 4** for Tailwind CSS styling
- **React Navigation 7** for navigation
- **Zustand** for state management with secure storage persistence
- **TanStack React Query** for server state management
- **React Hook Form** with Zod validation

### Environment Management
The app uses `APP_VARIANT` environment variable to control behavior:
- `development` - Development builds with debug panel
- `test` - Internal testing builds without dev features
- `production` - Release builds

### Styling System
- Uses NativeWind for Tailwind CSS in React Native
- Custom design system with CSS variables for theming
- Dark/light theme support
- react-native-reusables for shadcn/ui components

### Navigation Structure
```
(tabs)/ - Main tab navigation
├── index.tsx - Home
├── discover.tsx - Feature discovery
└── mine.tsx - User profile

discover/ - Feature showcase screens
├── camera.tsx, audio.tsx, etc.
└── Various Expo SDK demonstrations

(protected)/ - Auth-required screens
```

### State Management Patterns
- **Auth State**: Zustand store with secure storage persistence
- **UI State**: Zustand store for scroll behavior, theme preferences
- **Server State**: TanStack React Query for API data
- **Form State**: React Hook Form with Zod validation

## Development Guidelines

### Adding New Features
1. Use file-based routing in `/app` directory
2. Create reusable components in `/components`
3. Add state management in `/store` if needed
4. Follow NativeWind styling patterns
5. Use TypeScript strictly

### Working with Expo SDK
The app extensively uses Expo SDK modules. Common patterns:
- Camera: `expo-camera` and `react-native-vision-camera`
- Storage: `expo-secure-store` with custom wrapper
- Authentication: `expo-auth-session` and `expo-apple-authentication`
- Media: `expo-image`, `expo-av`, `expo-media-library`

### Build Configurations
- **Development**: Full debug features, different bundle ID
- **Test**: Debug panel optional, simulates production behavior
- **Production**: Minified, optimized, release configuration

### Internationalization
- Uses `typesafe-i18n` (currently disabled in layout)
- Supports Chinese localization
- RTL support enabled

### Security & Permissions
- Comprehensive permission management via Expo plugins
- Secure storage for sensitive data
- Apple Sign In and authentication flows

## Common Tasks

### Adding shadcn/ui Components
```bash
npx @react-native-reusables/cli@latest add
```

### Adding Expo Plugins
```bash
npx expo install <plugin-name>
```

### Debugging
- Uses Flipper integration for development
- React Query and React Navigation dev tools enabled
- Custom debug panel controlled by environment variables

### Testing
- Jest configuration with Expo preset
- Coverage collection configured
- React Native Testing Library available

## Platform-Specific Notes

### iOS
- Uses Xcode workspaces
- Apple Sign In enabled
- Privacy manifest configured
- Associated domains for deep linking

### Android
- Gradle build system
- Custom permissions for camera, storage, location
- Adaptive icons configured
- Software keyboard handling

### Web
- Metro bundler with server output
- Progressive Web App capabilities
- Intent filters for deep linking

## Important Files
- `app.config.ts` - Expo configuration with variant support
- `metro.config.js` - Metro bundler configuration with NativeWind
- `babel.config.js` - Babel configuration with module resolver
- `tailwind.config.js` - Tailwind CSS configuration
- `global.css` - Global styles with CSS variables
