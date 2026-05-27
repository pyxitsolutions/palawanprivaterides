import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app/App.tsx';
import RidesPage from './app/pages/RidesPage.tsx';
import ToursPage from './app/pages/ToursPage.tsx';
import BookingPage from './app/pages/BookingPage.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/rides" element={<RidesPage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/book" element={<BookingPage />} />
    </Routes>
  </BrowserRouter>
);
