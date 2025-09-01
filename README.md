# Sheet Flow 🎼

A cross-platform sheet music viewer built with React Native and Expo. Display and interact with MusicXML files using [OpenSheetMusicDisplay (OSMD)](https://github.com/opensheetmusicdisplay) in a native mobile or web app.

---

## Vision & Motivation

**SheetFlow** was created to make classical sheet music universally accessible and interactive for musicians on any device. Leveraging modern cross-platform technologies, SheetFlow brings MusicXML files to life, allowing users to browse, view, and interact with high-quality digital scores. The app is designed for music students, teachers, and performers seeking a portable, responsive, and extensible music notation experience.

---

## Architecture Overview

- **Tech Stack:** [Expo](https://expo.dev/) (React Native), TypeScript, React Native WebView, OpenSheetMusicDisplay (OSMD)
- **Authentication:** [Supabase Auth](https://supabase.com/auth) with OAuth support (Google, Apple)
- **Routing:** Modular, file-based routing via Expo Router
- **Music Rendering:** OSMD integrated seamlessly via WebView for performant, pixel-perfect notation
- **State Management:** React Context for global state (extensible to Redux/Zustand for larger scale)
- **Component Structure:** Highly composable, platform-aware components for maximum code reuse
- **Cross-Platform Support:** Uniform experience across iOS, Android, and Web, with responsive hooks and adaptive UI

---

## Features

- 📱 **Universal Platform Support:** iOS, Android, and Web
- 🔐 **Secure Authentication:** Email/password and OAuth (Google, Apple) via Supabase
- 🎵 **MusicXML Rendering:** Professional, interactive sheet music display
- 🎨 **Powered by OSMD:** High-fidelity music notation via OpenSheetMusicDisplay
- 📖 **Multi-Score Library:** Browse works by Clementi, Beethoven, and more
- 🎹 **Built for Musicians:** Optimized UI/UX for practice and performance
- 📲 **Responsive Design:** Mobile-first, but scalable for desktop/tablet
- 🧩 **Easy Extensibility:** Add new scores or features with minimal code changes

---

## Technical Highlights

- **Web-Native Integration:** Advanced use of React Native WebView to embed and interact with a web-based music notation engine, overcoming cross-platform rendering and communication challenges.
- **Performance Optimization:** Efficient MusicXML parsing and rendering for large scores, with lazy loading and caching strategies.
- **Responsive Sheet Music Layout:** Custom hooks and layout logic ensure readable sheet music on any screen size.
- **Modular File Structure:** File-based routing and separation of concerns for maintainability and scalability.

---

## Screenshots

<!-- Add actual image files in a 'screenshots' folder for best effect -->
![SheetFlow on iOS](screenshots/sheetflow-ios.png)
![SheetFlow on Android](screenshots/sheetflow-android.png)
![SheetFlow on Web](screenshots/sheetflow-web.png)

---

## How It Works

The app uses a WebView component to render MusicXML files through OpenSheetMusicDisplay (OSMD), a powerful JavaScript library for music notation. This approach allows us to display complex sheet music in a native environment with minimal performance overhead and maximum visual fidelity.

- **Main Sheet Music Logic:** See [`app/(tabs)/sheet.tsx`](app/(tabs)/sheet.tsx)
  - MusicXML file management
  - WebView integration and communication
  - Cross-platform dropdown/picker components
  - Responsive layout handling

---

## Sheet Music Files

Currently included:
- **Clementi**: Sonatina Op.36 No.1 Part 2 (Andante)
- **Beethoven**: An die ferne Geliebte Op.98 (Page 1)

Add more files easily by updating the `musicFiles` array in [`sheet.tsx`](app/(tabs)/sheet.tsx).

---

## Environment Setup

### Environment Variables

This project uses environment variables to keep sensitive information (like API tokens) out of the repository.

1. **Copy the template:**
   ```bash
   cp .env.template .env
   ```

2. **Add your tokens to `.env`:**
   ```bash
   # GitHub Packages Authentication (for sponsors only)
   GITHUB_TOKEN=your_github_token_here

   # Supabase Access Token for MCP
   SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
   ```

3. **Important:** Never commit the `.env` file. It's already included in `.gitignore`.

### MCP (Model Context Protocol) Setup

This project includes MCP servers for enhanced development capabilities:

- **Gluestack UI Components**: For UI component assistance
- **Firebase**: For Firebase services integration  
- **Supabase**: For database and backend services

The MCP configuration is in `.vscode/mcp.json` and automatically reads tokens from your `.env` file for security.

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

## Authentication Setup

The app uses Supabase for secure authentication with support for email/password and OAuth providers (Google, Apple).

### 1. Supabase Project Setup

1. **Create Supabase Project:**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project
   - Wait for the project to be fully set up

2. **Get API Credentials:**
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. **Configure Environment Variables:**
   - Copy `.env.template` to `.env`
   - Add your Supabase credentials:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Enable OAuth Providers (Optional)

**For Google OAuth:**
1. Go to Authentication > Providers in Supabase Dashboard
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL to: `com.joelkingsleyr.sheetflow://`

**For Apple OAuth:**
1. Enable Apple provider in Supabase Dashboard
2. Configure Apple Developer settings
3. Set redirect URL to: `com.joelkingsleyr.sheetflow://`

### 3. Authentication Features

- ✅ Email/Password sign up and sign in
- ✅ OAuth with Google and Apple
- ✅ Session persistence across app restarts
- ✅ Automatic token refresh
- ✅ Secure logout

### 4. Test Authentication

- Email authentication works on all platforms
- OAuth providers work best on physical devices
- Web version supports all authentication methods

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

- 🎧 MIDI playback and interactive practice tools
- ✏️ User annotations and cloud sync
- 🎼 Expanded score library: more genres & composers
- ⚡ Performance improvements for very large scores
- 🧑‍🤝‍🧑 Collaborative features

---

## Dependencies

- **React Native WebView:** For rendering HTML/JavaScript content in the native app
- **OpenSheetMusicDisplay:** For music notation rendering (loaded via CDN)
- **Expo:** For cross-platform development & deployment

---

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [OpenSheetMusicDisplay](https://github.com/opensheetmusicdisplay)

---

## Join the Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)

---

