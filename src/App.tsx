import React from 'react';
import './css/App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Monja from './pages/Monja';
import { theme } from './theme/theme';
import Player from './pages/Player';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Monja" element={<Monja />} />
          <Route path="/Player" element={<Player />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
export default App;
