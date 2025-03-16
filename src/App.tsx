import Chat from './components/Chat';
import { TranslationProvider } from './components/TranslationProvider';

function App() {
  return (
    <TranslationProvider>
      <Chat />
    </TranslationProvider>
  );
}

export default App;
