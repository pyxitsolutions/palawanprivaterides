import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import App from './app/App.tsx';
import RidesPage from './app/pages/RidesPage.tsx';
import ToursPage from './app/pages/ToursPage.tsx';
import BookingPage from './app/pages/BookingPage.tsx';
import GalleryPage from './app/pages/GalleryPage.tsx';
import { CurrencyProvider } from './app/context/CurrencyContext.tsx';
import { Analytics } from '@vercel/analytics/react';
import './styles/index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <CurrencyProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rides" element={<RidesPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </CurrencyProvider>
);
