import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

const muiTheme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <StyledThemeProvider theme={theme}>
        <App />
      </StyledThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>
);
