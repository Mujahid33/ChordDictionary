/* ===== APP ROOT ===== */
/* Clean Architecture: App Layer - Composition Root */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/presentation/components/layout/Header';
import { BottomNav } from '@/presentation/components/layout/BottomNav';
import { HomePage } from '@/presentation/pages/HomePage';
import { ChordDetailPage } from '@/presentation/pages/ChordDetailPage';
import { FavoritesPage } from '@/presentation/pages/FavoritesPage';
import { TunerPage, LibraryPage, SettingsPage } from '@/presentation/pages/PlaceholderPages';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app__content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chord/:id" element={<ChordDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/tuner" element={<TunerPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
