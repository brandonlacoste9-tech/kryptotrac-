import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CryptoGrid from './components/CryptoGrid';
import GameGrid from './components/GameGrid';
import GamePage from './components/GamePage';
import GamePlayer from './pages/GamePlayer';
import MyLibrary from './pages/MyLibrary';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Games from './pages/Games';
import About from './pages/About';
import PortfolioDashboard from './pages/PortfolioDashboard';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <CryptoGrid />
              <GameGrid />
            </>
          } />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/play/:id" element={<GamePlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/games" element={<Games />} />
          <Route path="/categories" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/portfolio" element={<PortfolioDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
