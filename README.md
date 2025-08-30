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

