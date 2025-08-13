# Sheet Flow 🎼

A cross-platform sheet music viewer built with React Native and Expo. Display and interact with MusicXML files using OpenSheetMusicDisplay (OSMD) in a native mobile app and web interface.

## Features

- 📱 **Cross-platform**: Works on iOS, Android, and Web
- 🎵 **MusicXML Support**: Display professional sheet music using MusicXML format
- 🎨 **Interactive Display**: Powered by OpenSheetMusicDisplay for high-quality music notation rendering
- 📖 **Multiple Pieces**: Browse between different musical compositions
- 🎹 **Classical Music**: Includes works by Clementi, Beethoven, and more
- 📲 **Responsive Design**: Optimized for both mobile and desktop viewing

## How it Works

The app uses a WebView component to render MusicXML files through OpenSheetMusicDisplay (OSMD), a powerful JavaScript library for music notation. This approach allows us to display complex sheet music with high fidelity across all platforms while maintaining native app performance.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

The main sheet music functionality is in `app/(tabs)/sheet.tsx`, which includes:
- MusicXML file management
- WebView integration with OpenSheetMusicDisplay
- Cross-platform dropdown/picker components
- Responsive layout handling

## Sheet Music Files

The app currently includes MusicXML files for:
- **Clementi**: Sonatina Op.36 No.1 Part 2 (Andante)
- **Beethoven**: An die ferne Geliebte Op.98 (Page 1)

Additional MusicXML files can be added to the `musicFiles` array in `sheet.tsx`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Dependencies

This project uses several key dependencies:
- **React Native WebView**: For rendering HTML/JavaScript content within the native app
- **OpenSheetMusicDisplay**: JavaScript library for music notation rendering (loaded via CDN)
- **Expo**: For cross-platform development and deployment

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
