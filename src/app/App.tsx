import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import '../styles/theme.css';
import { useDynamicFavicon } from '../hooks/useDynamicFavicon';

function App() {
  useDynamicFavicon();
  return <RouterProvider router={router} />;
}

export default App;
