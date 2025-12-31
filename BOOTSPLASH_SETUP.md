# react-native-bootsplash Configuration

Place your logo (splashscreen.png) in the following location and run the generator:

## For iOS:
```bash
npx react-native generate-bootsplash assets/splashscreen.png \
  --platforms=ios \
  --background=FFFFFF \
  --logo-width=200
```

## For Android:
```bash
npx react-native generate-bootsplash assets/splashscreen.png \
  --platforms=android \
  --background=FFFFFF \
  --logo-width=200
```

## Or both at once:
```bash
npx react-native generate-bootsplash assets/splashscreen.png \
  --background=FFFFFF \
  --logo-width=200
```

After generation:
1. Follow platform-specific setup instructions
2. Rebuild the app: `npm run android` or `npm run ios`
3. The splash screen will appear automatically on app startup

The App.tsx has already been configured with:
- Fade animation when hiding the splash
- Smooth content fade-in transition
