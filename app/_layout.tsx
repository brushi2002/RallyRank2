import { GlobalProvider } from '@/lib/globalprovider';
import { Slot } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';


// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GlobalProvider>
          <Slot />
      </GlobalProvider>
    </SafeAreaProvider>
  );
}
