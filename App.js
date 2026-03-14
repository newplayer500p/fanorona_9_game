import { SafeAreaProvider } from 'react-native-safe-area-context';
import FanoronaGame from './src/index';

export default function App() {
  return (
    <SafeAreaProvider>
      <FanoronaGame />
    </SafeAreaProvider>
  );
}