# Sheet Flow 🎼

A cross-platform sheet music viewer built with React Native and Expo. Display and interact with MusicXML files using [OpenSheetMusicDisplay (OSMD)](https://github.com/opensheetmusicdisplay) in a native mobile or web app.

---

## Vision & Motivation

**SheetFlow** was created to make classical sheet music universally accessible and interactive for musicians on any device. Leveraging modern cross-platform technologies, SheetFlow brings MusicXML files to life, allowing users to browse, view, and interact with high-quality digital scores. The app is designed for music students, teachers, and performers seeking a portable, responsive, and extensible music notation experience.

---

## Architecture Overview

- **Tech Stack:** [Expo](https://expo.dev/) (React Native), TypeScript, React Native WebView, OpenSheetMusicDisplay (OSMD)
- **Routing:** Modular, file-based routing via Expo Router
- **Music Rendering:** OSMD integrated seamlessly via WebView for performant, pixel-perfect notation
- **State Management:** React Context for global state (extensible to Redux/Zustand for larger scale)
- **Component Structure:** Highly composable, platform-aware components for maximum code reuse
- **Cross-Platform Support:** Uniform experience across iOS, Android, and Web, with responsive hooks and adaptive UI

---

## Features

- 📱 **Universal Platform Support:** iOS, Android, and Web
- 🎵 **MusicXML Rendering:** Professional, interactive sheet music display
- 🎨 **Powered by OSMD:** High-fidelity music notation via OpenSheetMusicDisplay
- 🎹 **Audio Playback Controls:** Play, pause, stop, and loop sheet music with visual cursor tracking
- 🔄 **Loop Playback:** Automatically repeat sheet music for practice sessions
- 🎯 **Interactive Cursor:** Visual tracking of playback position with customizable colors
- 🔍 **Zoom Controls:** Smooth zoom in/out functionality for detailed viewing
- 🔐 **Authentication:** Google Sign-In, Apple Sign-In, and guest access support
- 📖 **Multi-Score Library:** Browse classical works and hymns with difficulty ratings
- 🏷️ **Difficulty Badges:** Easy, Medium, and Hard ratings for each piece
- 📲 **Responsive Design:** Mobile-first, but scalable for desktop/tablet
- 🧩 **Easy Extensibility:** Add new scores or features with minimal code changes

---

## Technical Highlights

- **Web-Native Integration:** Advanced use of React Native WebView to embed and interact with a web-based music notation engine, overcoming cross-platform rendering and communication challenges.
- **Audio Playback System:** Integrated OSMD playback manager with custom loop functionality, cursor tracking, and responsive control interface.
- **Cross-Platform Authentication:** Firebase Auth with Google Sign-In, Apple Sign-In, and anonymous access, properly configured for iOS, Android, and Web.
- **Performance Optimization:** Efficient MusicXML parsing and rendering for large scores, with lazy loading and caching strategies.
- **UI Component Library:** Leveraging Gluestack UI for consistent, accessible, and responsive components across platforms.
- **Responsive Sheet Music Layout:** Custom hooks and layout logic ensure readable sheet music on any screen size.
- **Modular File Structure:** File-based routing and separation of concerns for maintainability and scalability.

---

## Screen Recordings

**SheetFlow on Android**

https://github.com/user-attachments/assets/43dfb5ba-9a86-478c-9f89-b6718f185217

---

## How It Works

The app uses a WebView component to render MusicXML files through OpenSheetMusicDisplay (OSMD), a powerful JavaScript library for music notation. This approach allows us to display complex sheet music in a native environment with minimal performance overhead and maximum visual fidelity.

### Key Components:

- **Home Screen** ([`app/(tabs)/index.tsx`](app/(tabs)/index.tsx)): 
  - Browse available sheet music with difficulty ratings
  - User authentication status and controls
  - Clean, card-based interface with FlatList for performance

- **Sheet Music Display** ([`app/sheet/index.tsx`](app/sheet/index.tsx) & [`components/sheetMusicDisplay/`](components/sheetMusicDisplay/)):
  - MusicXML file loading and parsing
  - WebView integration with OSMD
  - Cross-platform file handling (web vs native)
  - Audio playback controls with loop functionality
  - Zoom controls and cursor customization

- **Authentication** ([`contexts/AuthContext.tsx`](contexts/AuthContext.tsx) & [`app/auth/login.tsx`](app/auth/login.tsx)):
  - Firebase Authentication integration
  - Google Sign-In with MaterialIcons branding
  - Apple Sign-In (iOS only) with proper branding
  - Guest access for quick usage
  - Persistent authentication state

---

## Sheet Music Files

Currently included:
- **Clementi**: Sonatina Op.36 No.1 Part 2 (Andante) - Easy
- **Beethoven**: An die ferne Geliebte Op.98 (Page 1) - Hard
- **Mendelssohn**: Op. 98 - Medium
- **Traditional**: Original Silent Night - Easy
- **Traditional**: To God Be The Glory - Easy

Each piece includes difficulty ratings (Easy, Medium, Hard) displayed as colored badges. Add more files easily by updating the `musicFiles` array in [`app/(tabs)/index.tsx`](app/(tabs)/index.tsx) and [`app/sheet/index.tsx`](app/sheet/index.tsx).

---

## Get Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app
   ```bash
   npx expo start
   ```
   Options for running:
   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go)

Start developing by editing files in the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction/).

---

## Social Authentication Setup

The app supports Google Sign-In, Apple Sign-In, and guest access for user authentication. To enable these features:

### 1. Firebase Configuration

1. **Set up Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Authentication service
   - Add Google and Apple as sign-in providers
   - Enable Anonymous authentication for guest access

2. **Get Client IDs:**
   - Go to Project Settings > General tab
   - Scroll to "Your apps" section
   - Note the Web Client ID from your web app configuration
   - For iOS: Add an iOS app or check existing iOS app for Client ID

### 2. Configure Client IDs

Update the file `config/auth.ts` with your actual client IDs:

```typescript
export const GOOGLE_WEB_CLIENT_ID = 'your-actual-web-client-id.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = 'your-actual-ios-client-id.apps.googleusercontent.com';
```

### 3. Platform-specific Setup

**For Android:**
- Download `google-services.json` from Firebase Console
- Place it in the root directory of your project

**For iOS:**
- Download `GoogleService-Info.plist` from Firebase Console
- Add it to your iOS project when building with Xcode

### 4. Authentication Features

- **Google Sign-In**: Available on Android and iOS with proper Google branding
- **Apple Sign-In**: iOS-only with Apple branding (requires actual device for testing)
- **Guest Access**: Anonymous authentication for quick app exploration
- **Persistent Sessions**: Users remain logged in across app restarts
- **Profile Management**: View user email and sign out functionality

### 5. Test Social Authentication

- Google Sign-In works on Android and iOS
- Apple Sign-In only works on iOS devices (not simulators in some cases)
- Guest access works on all platforms
- Make sure to test on actual devices for full functionality

---

## Building Release Standalone Apps

For production-ready standalone builds that don't require a Metro bundler:

### iOS Release Build

1. **Generate native iOS project:**
   ```bash
   npx expo prebuild --platform ios --clean
   ```

2. **Export JavaScript bundle:**
   ```bash
   npx expo export --platform ios --output-dir ios-build
   ```

3. **Copy bundle to iOS project:**
   ```bash
   cp ios-build/_expo/static/js/ios/*.hbc ios/sheetflow/main.jsbundle
   ```

4. **Add bundle to Xcode project:**
   - Open `ios/sheetflow.xcworkspace` in Xcode
   - Right-click on "sheetflow" folder → "Add Files to 'sheetflow'"
   - Select `main.jsbundle` and ensure it's added to the target

5. **Build and run:**
   ```bash
   npx expo run:ios --configuration Release --device
   ```

### Android Release Build

1. **Configure Android SDK path:**
   ```bash
   echo "sdk.dir=$ANDROID_HOME" > android/local.properties
   ```

2. **Build release APK:**
   ```bash
   cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
   ```

3. **Install on device:**
   ```bash
   ./gradlew installRelease
   ```

### Alternative: EAS Build (Recommended for CI/CD)

For cloud-based builds or when local builds are challenging:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for both platforms
npx eas build --platform all --profile production

# Or build locally
npx eas build --platform ios --profile debug --local
npx eas build --platform android --profile debug --local
```

**Note:** Release builds include the JavaScript bundle and run independently of Metro server, making them suitable for testing Firebase Auth persistence and production deployment.

---

## Testing & Quality

- **Linting:** Automated with ESLint and Prettier
- **Testing:** Unit and integration tests using Jest and React Native Testing Library (planned for future releases)
- **CI/CD:** Ready for GitHub Actions and Expo EAS for automated builds and deployments

---

## Project Lead & Contributions

**Built and maintained by [Joel Kingsley](https://github.com/joelkingsley)**

- Designed and architected the codebase for scalability and maintainability
- Led all aspects of development: UI/UX, integration, performance, and deployment
- Established coding standards and best practices
- Onboarded contributors with clear docs and code reviews

---

## Roadmap

- 🎧 Enhanced MIDI playback with tempo controls and metronome
- ✏️ User annotations and cloud sync
- 📚 Personal sheet music collections and favorites
- 🎼 Expanded score library: more genres & composers
- ⚡ Performance improvements for very large scores
- 🧑‍🤝‍🧑 Collaborative features and sharing
- 📊 Practice tracking and progress analytics
- 🎵 Transposition and key signature adjustments
- 📱 Offline mode and sheet music caching

---

## Dependencies

- **React Native WebView:** For rendering HTML/JavaScript content in the native app
- **OpenSheetMusicDisplay:** For music notation rendering (loaded via CDN)
- **Expo:** For cross-platform development & deployment
- **Firebase:** Authentication and backend services
- **Gluestack UI:** Comprehensive component library for consistent UI/UX
- **React Native Google Sign-In:** Google authentication integration
- **Expo Apple Authentication:** Apple Sign-In for iOS devices

---

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay)

---

