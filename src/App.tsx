import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { BylawVisualizer } from './components/BylawVisualizer';
import { BylawControls } from './components/BylawControls';
import { store } from './store';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          position: 'relative', 
          width: '100vw', 
          height: '100vh', 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'calc(100% - 350px)', // Subtract sidebar width
            height: '100%'
          }}>
            <BylawVisualizer />
          </div>
          <BylawControls />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
