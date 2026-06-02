import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import App from './app/App.tsx';
import { CurrencyProvider } from './app/context/CurrencyContext.tsx';
import { Analytics } from '@vercel/analytics/react';
import './styles/index.css';

const RidesPage = lazy(() => import('./app/pages/RidesPage.tsx'));
const ToursPage = lazy(() => import('./app/pages/ToursPage.tsx'));
const BookingPage = lazy(() => import('./app/pages/BookingPage.tsx'));
const GalleryPage = lazy(() => import('./app/pages/GalleryPage.tsx'));
const ServicePage = lazy(() => import('./app/pages/ServicePage.tsx'));
const DestinationPage = lazy(() => import('./app/pages/DestinationPage.tsx'));
const BlogListPage = lazy(() => import('./app/pages/BlogListPage.tsx'));
const BlogPostPage = lazy(() => import('./app/pages/BlogPostPage.tsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#e8a020] animate-spin" />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <CurrencyProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/destinations/:slug" element={<DestinationPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    <Analytics />
  </CurrencyProvider>
);
