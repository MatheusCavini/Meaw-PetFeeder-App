import { StatusBar } from 'expo-status-bar';
import RefreshContextProvider from './source/Contexts/refreshConectionContext';
import Home from './source/pages/Home';

export default function App() {
  return(
    <RefreshContextProvider>
      <StatusBar></StatusBar>
      <Home></Home>
    </RefreshContextProvider>
  )
}


